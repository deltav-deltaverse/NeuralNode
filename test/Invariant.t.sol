// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../contracts/BubbleRoomV4.sol";
import "../contracts/BubbleRoomSpawn.sol";
import "../contracts/EmergenceTraits.sol";
import "../contracts/SeedRegistry.sol";

/// @title InvariantHandler - drives random actions for invariant testing
contract InvariantHandler is Test {
    BubbleRoomV4 public room;
    BubbleRoomSpawn public spawn;
    EmergenceTraits public traits;
    SeedRegistry public seeds;

    address public actor = address(0xBEEF);
    uint256 public totalRooms;
    uint256 public totalSeeds;
    uint256 public totalSpawns;
    uint256 public totalInteractions;

    constructor(
        BubbleRoomV4 _room,
        BubbleRoomSpawn _spawn,
        EmergenceTraits _traits,
        SeedRegistry _seeds
    ) {
        room = _room;
        spawn = _spawn;
        traits = _traits;
        seeds = _seeds;
    }

    function mintRoom() external {
        vm.startPrank(actor);
        address[] memory p = new address[](1);
        p[0] = actor;
        BubbleRoomV4.Role[] memory r = new BubbleRoomV4.Role[](1);
        r[0] = BubbleRoomV4.Role.MODERATOR;

        room.mintRoom(
            "", "Theme", "Origin",
            p, r, false, false, false,
            BubbleRoomV4.RoomType.DELTA,
            0, "", false, "seed", "tone", true
        );
        totalRooms++;
        vm.stopPrank();
    }

    function createSeed() external {
        vm.prank(actor);
        seeds.createGenesisSeed("Genesis seed", "Commanding", true);
        totalSeeds++;
    }

    function spawnSeed() external {
        if (totalSeeds == 0) return;
        vm.prank(actor);
        seeds.spawnSeed(totalSeeds, "mutation", "");
        totalSeeds++;
        totalSpawns++;
    }

    function recordInteraction() external {
        if (totalRooms == 0) return;
        traits.recordInteraction(totalRooms);
        totalInteractions++;
    }

    function recordSpawnSuccess() external {
        if (totalRooms == 0) return;
        traits.recordSpawnSuccess(totalRooms);
    }

    function recordConsensus(uint16 weight) external {
        if (totalRooms == 0) return;
        weight = weight % 101;
        if (weight == 0) weight = 1;
        traits.recordConsensus(totalRooms, weight);
    }
}

contract InvariantTest is Test {
    BubbleRoomV4 public room;
    BubbleRoomSpawn public spawn;
    EmergenceTraits public traits;
    SeedRegistry public seeds;
    InvariantHandler public handler;

    function setUp() public {
        address deployer = address(1);
        vm.startPrank(deployer);
        room = new BubbleRoomV4();
        spawn = new BubbleRoomSpawn(address(room));
        traits = new EmergenceTraits(address(room), address(spawn));
        seeds = new SeedRegistry();
        vm.stopPrank();

        handler = new InvariantHandler(room, spawn, traits, seeds);

        targetContract(address(handler));
    }

    /// @notice Room IDs are always sequential and nextRoomId is always ahead
    function invariant_roomIdSequential() public view {
        assertGe(room.nextRoomId(), handler.totalRooms() + 1);
    }

    /// @notice Seed IDs are always sequential
    function invariant_seedIdSequential() public view {
        assertGe(seeds.nextSeedId(), handler.totalSeeds() + 1);
    }

    /// @notice All traits remain within 0-100 bounds
    function invariant_traitsBounded() public view {
        if (handler.totalRooms() == 0) return;
        uint256 latestRoom = handler.totalRooms();
        EmergenceTraits.Traits memory t = traits.getTraits(latestRoom);
        assertTrue(t.intelligence <= 100);
        assertTrue(t.knowledge <= 100);
        assertTrue(t.resonance <= 100);
        assertTrue(t.adaptability <= 100);
        assertTrue(t.coherence <= 100);
        assertTrue(uint8(t.wisdom) <= 4);
    }

    /// @notice Genesis seeds always have originSeedId == 0
    function invariant_genesisOriginZero() public view {
        if (handler.totalSeeds() == 0) return;
        // First seed is always genesis
        (,,, uint256 origin,,,,) = seeds.seeds(1);
        assertEq(origin, 0);
    }
}
