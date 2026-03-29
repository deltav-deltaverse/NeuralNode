// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../contracts/BubbleRoomV4.sol";
import "../contracts/DeltaGenesisSBT.sol";
import "../contracts/BubbleRoomSpawn.sol";
import "../contracts/EmergenceTraits.sol";
import "../contracts/SeedRegistry.sol";
import "../contracts/SwarmGovernance.sol";

contract FuzzTest is Test {
    BubbleRoomV4 public room;
    DeltaGenesisSBT public sbt;
    BubbleRoomSpawn public spawn;
    EmergenceTraits public traits;
    SeedRegistry public seeds;
    SwarmGovernance public governance;

    address public deployer = address(1);

    function setUp() public {
        vm.startPrank(deployer);
        room = new BubbleRoomV4();
        sbt = new DeltaGenesisSBT();
        spawn = new BubbleRoomSpawn(address(room));
        traits = new EmergenceTraits(address(room), address(spawn));
        seeds = new SeedRegistry();
        governance = new SwarmGovernance(address(room), address(traits));
        vm.stopPrank();
    }

    // ========================
    // BubbleRoomV4 Fuzz
    // ========================

    function testFuzz_MintRoom_AnyThemeAndSeed(
        string calldata theme,
        string calldata aiSeed,
        string calldata tone
    ) public {
        vm.startPrank(deployer);
        address[] memory p = new address[](1);
        p[0] = deployer;
        BubbleRoomV4.Role[] memory r = new BubbleRoomV4.Role[](1);
        r[0] = BubbleRoomV4.Role.MODERATOR;

        uint256 id = room.mintRoom(
            "", theme, "fuzz",
            p, r, false, false, false,
            BubbleRoomV4.RoomType.DELTA,
            0, "", false, aiSeed, tone, true
        );

        (string memory gotSeed, string memory gotTone, bool evolves) = room.getRoomAI(id);
        assertEq(gotSeed, aiSeed);
        assertEq(gotTone, tone);
        assertTrue(evolves);
        vm.stopPrank();
    }

    function testFuzz_MintRoom_AllRoomTypes(uint8 roomTypeRaw) public {
        uint8 roomType = roomTypeRaw % 10; // 10 room types
        vm.startPrank(deployer);
        address[] memory p = new address[](1);
        p[0] = deployer;
        BubbleRoomV4.Role[] memory r = new BubbleRoomV4.Role[](1);
        r[0] = BubbleRoomV4.Role.MODERATOR;

        uint256 id = room.mintRoom(
            "", "Theme", "Origin",
            p, r, false, false, false,
            BubbleRoomV4.RoomType(roomType),
            0, "", false, "seed", "tone", true
        );

        assertEq(room.ownerOf(id), deployer);
        vm.stopPrank();
    }

    function testFuzz_MintRoom_MultipleParticipants(uint8 count) public {
        uint8 n = (count % 10) + 1; // 1-10 participants
        vm.startPrank(deployer);

        address[] memory p = new address[](n);
        BubbleRoomV4.Role[] memory r = new BubbleRoomV4.Role[](n);
        for (uint8 i = 0; i < n; i++) {
            p[i] = address(uint160(100 + i));
            r[i] = BubbleRoomV4.Role(i % 4);
        }

        uint256 id = room.mintRoom(
            "", "Multi", "Fuzz",
            p, r, false, false, false,
            BubbleRoomV4.RoomType.DELTA,
            0, "", false, "seed", "tone", true
        );

        address[] memory got = room.getRoomParticipants(id);
        assertEq(got.length, n);
        vm.stopPrank();
    }

    // ========================
    // DeltaGenesisSBT Fuzz
    // ========================

    function testFuzz_MintGenesis_UniqueAddresses(address recipient) public {
        vm.assume(recipient != address(0));
        vm.assume(uint160(recipient) > 10); // avoid precompiles
        vm.startPrank(deployer);
        sbt.mintGenesis(recipient, "ipfs://fuzz");
        assertEq(sbt.ownerOf(1), recipient);
        assertTrue(sbt.hasClaimed(recipient));
        vm.stopPrank();
    }

    // ========================
    // SeedRegistry Fuzz
    // ========================

    function testFuzz_CreateAndSpawnSeed(
        string calldata prompt,
        string calldata mutation,
        string calldata tone
    ) public {
        vm.startPrank(deployer);
        uint256 genId = seeds.createGenesisSeed(prompt, tone, true);
        uint256 childId = seeds.spawnSeed(genId, mutation, "");

        (string memory childPrompt,,,,,,,) = seeds.seeds(childId);
        string memory expected = string(abi.encodePacked(prompt, " >> ", mutation));
        assertEq(childPrompt, expected);

        assertEq(seeds.getLineageDepth(childId), 1);
        vm.stopPrank();
    }

    function testFuzz_SpawnChainDepth(uint8 depth) public {
        uint8 n = (depth % 8) + 1; // 1-8 levels deep
        vm.startPrank(deployer);

        uint256 current = seeds.createGenesisSeed("root", "tone", true);
        for (uint8 i = 0; i < n; i++) {
            current = seeds.spawnSeed(current, string(abi.encodePacked("gen", bytes1(i + 48))), "");
        }

        assertEq(seeds.getLineageDepth(current), n);
        vm.stopPrank();
    }

    // ========================
    // EmergenceTraits Fuzz
    // ========================

    function testFuzz_TraitsBounded(uint8 interactions, uint8 spawns, uint16 weight) public {
        uint8 iCount = interactions % 20;
        uint8 sCount = spawns % 20;
        uint16 w = weight % 101; // 0-100

        _mintRoom(deployer);

        for (uint8 i = 0; i < iCount; i++) {
            traits.recordInteraction(1);
        }
        for (uint8 i = 0; i < sCount; i++) {
            traits.recordSpawnSuccess(1);
        }
        if (w > 0) {
            traits.recordConsensus(1, w);
        }

        EmergenceTraits.Traits memory t = traits.getTraits(1);
        assertTrue(t.intelligence <= 100, "intelligence > 100");
        assertTrue(t.knowledge <= 100, "knowledge > 100");
        assertTrue(t.resonance <= 100, "resonance > 100");
        assertTrue(t.adaptability <= 100, "adaptability > 100");
        assertTrue(t.coherence <= 100, "coherence > 100");
        assertTrue(uint8(t.wisdom) <= 4, "invalid wisdom class");
    }

    // ========================
    // SwarmGovernance Fuzz
    // ========================

    function testFuzz_VotingPeriod(uint256 period) public {
        period = bound(period, 1 hours, 30 days);
        _mintRoom(deployer);

        vm.startPrank(deployer);
        uint256 pid = governance.createProposal(
            1, SwarmGovernance.ProposalType.CUSTOM, "Fuzz", "", period
        );

        (,,,,,,uint256 deadline,,,) = governance.proposals(pid);
        assertEq(deadline, block.timestamp + period);
        vm.stopPrank();
    }

    function testFuzz_VotingPeriod_OutOfRange_Reverts(uint256 period) public {
        vm.assume(period < 1 hours || period > 30 days);
        _mintRoom(deployer);

        vm.startPrank(deployer);
        vm.expectRevert("Invalid voting period");
        governance.createProposal(
            1, SwarmGovernance.ProposalType.CUSTOM, "Fuzz", "", period
        );
        vm.stopPrank();
    }

    // ========================
    // Helper
    // ========================

    function _mintRoom(address creator) internal {
        vm.startPrank(creator);
        address[] memory p = new address[](1);
        p[0] = creator;
        BubbleRoomV4.Role[] memory r = new BubbleRoomV4.Role[](1);
        r[0] = BubbleRoomV4.Role.MODERATOR;
        room.mintRoom(
            "", "Test", "Test", p, r,
            false, false, false,
            BubbleRoomV4.RoomType.DELTA,
            0, "", false, "seed", "tone", true
        );
        vm.stopPrank();
    }
}
