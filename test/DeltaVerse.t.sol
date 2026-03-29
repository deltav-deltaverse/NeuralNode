// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../contracts/BubbleRoomV4.sol";
import "../contracts/DeltaGenesisSBT.sol";
import "../contracts/DeltaVerseOrchestrator.sol";
import "../contracts/BubbleRoomSpawn.sol";
import "../contracts/EmergenceTraits.sol";
import "../contracts/SeedRegistry.sol";
import "../contracts/SwarmGovernance.sol";

contract DeltaVerseTest is Test {
    BubbleRoomV4 public room;
    DeltaGenesisSBT public sbt;
    DeltaVerseOrchestrator public orchestrator;
    BubbleRoomSpawn public spawn;
    EmergenceTraits public traits;
    SeedRegistry public seeds;
    SwarmGovernance public governance;

    address public mastermind = address(1);
    address public agent1 = address(2);
    address public agent2 = address(3);
    address public member1 = address(4);

    function setUp() public {
        vm.startPrank(mastermind);

        room = new BubbleRoomV4();
        sbt = new DeltaGenesisSBT();
        orchestrator = new DeltaVerseOrchestrator(address(room));
        spawn = new BubbleRoomSpawn(address(room));
        traits = new EmergenceTraits(address(room), address(spawn));
        seeds = new SeedRegistry();
        governance = new SwarmGovernance(address(room), address(traits));

        vm.stopPrank();
    }

    // ========================
    // BubbleRoomV4 Tests
    // ========================

    function test_MintRoom() public {
        vm.startPrank(mastermind);

        address[] memory participants = new address[](2);
        participants[0] = mastermind;
        participants[1] = agent1;

        BubbleRoomV4.Role[] memory roles = new BubbleRoomV4.Role[](2);
        roles[0] = BubbleRoomV4.Role.MODERATOR;
        roles[1] = BubbleRoomV4.Role.AGENT;

        uint256 roomId = room.mintRoom(
            "ipfs://metadata",
            "Memory Drift",
            "Genesis",
            participants,
            roles,
            false, false, false,
            BubbleRoomV4.RoomType.DELTA,
            0, "", false,
            "Language that rewrites itself",
            "Surreal",
            true
        );

        assertEq(roomId, 1);
        assertEq(room.ownerOf(1), mastermind);

        (string memory aiSeed, string memory tone, bool evolves) = room.getRoomAI(1);
        assertEq(aiSeed, "Language that rewrites itself");
        assertEq(tone, "Surreal");
        assertTrue(evolves);

        address[] memory members = room.getRoomParticipants(1);
        assertEq(members.length, 2);
        assertEq(members[0], mastermind);
        assertEq(members[1], agent1);

        vm.stopPrank();
    }

    function test_MintRoom_RoleMismatchReverts() public {
        vm.startPrank(mastermind);

        address[] memory participants = new address[](2);
        participants[0] = mastermind;
        participants[1] = agent1;

        BubbleRoomV4.Role[] memory roles = new BubbleRoomV4.Role[](1);
        roles[0] = BubbleRoomV4.Role.MODERATOR;

        vm.expectRevert("Participant/role mismatch");
        room.mintRoom(
            "", "Test", "Test",
            participants, roles,
            false, false, false,
            BubbleRoomV4.RoomType.DELTA,
            0, "", false, "", "", true
        );

        vm.stopPrank();
    }

    // ========================
    // DeltaGenesisSBT Tests
    // ========================

    function test_MintGenesisSBT() public {
        vm.startPrank(mastermind);

        sbt.mintGenesis(agent1, "ipfs://genesis-1");
        assertEq(sbt.ownerOf(1), agent1);
        assertTrue(sbt.soulbound(1));
        assertTrue(sbt.hasClaimed(agent1));

        vm.stopPrank();
    }

    function test_SBT_NonTransferable() public {
        vm.startPrank(mastermind);
        sbt.mintGenesis(agent1, "ipfs://genesis-1");
        vm.stopPrank();

        vm.startPrank(agent1);
        vm.expectRevert("Soulbound: non-transferable");
        sbt.transferFrom(agent1, agent2, 1);
        vm.stopPrank();
    }

    function test_SBT_DoubleClaim() public {
        vm.startPrank(mastermind);
        sbt.mintGenesis(agent1, "ipfs://genesis-1");
        vm.expectRevert("Already claimed");
        sbt.mintGenesis(agent1, "ipfs://genesis-2");
        vm.stopPrank();
    }

    // ========================
    // BubbleRoomSpawn Tests
    // ========================

    function test_SpawnFromRoom() public {
        // Create origin room
        vm.startPrank(mastermind);

        address[] memory participants = new address[](1);
        participants[0] = mastermind;
        BubbleRoomV4.Role[] memory roles = new BubbleRoomV4.Role[](1);
        roles[0] = BubbleRoomV4.Role.MODERATOR;

        room.mintRoom(
            "", "Origin Theme", "Genesis",
            participants, roles,
            false, false, false,
            BubbleRoomV4.RoomType.DELTA,
            0, "", false,
            "The root seed",
            "Commanding",
            true
        );

        // Transfer ownership to spawn contract so it can mint
        room.transferOwnership(address(spawn));
        vm.stopPrank();

        // Spawn emergence
        vm.startPrank(mastermind);
        uint256 emergenceId = spawn.spawnFromRoom(
            1,
            "",
            "Emergence Theme",
            "Spawned from Origin #1",
            participants,
            roles,
            false,
            uint8(BubbleRoomV4.RoomType.DELTA),
            "Mutation: new pattern recognized",
            "Electric",
            true
        );
        vm.stopPrank();

        assertEq(emergenceId, 2);

        // Verify Lineage
        uint256[] memory lineage = spawn.getLineageTree(1);
        assertEq(lineage.length, 1);
        assertEq(lineage[0], 2);
        assertEq(spawn.originOf(2), 1);

        // Verify composed seed
        (string memory aiSeed,,) = room.getRoomAI(2);
        assertEq(aiSeed, "The root seed >> Mutation: new pattern recognized");
    }

    function test_SpawnFromRoom_NonParticipantReverts() public {
        vm.startPrank(mastermind);

        address[] memory participants = new address[](1);
        participants[0] = mastermind;
        BubbleRoomV4.Role[] memory roles = new BubbleRoomV4.Role[](1);
        roles[0] = BubbleRoomV4.Role.MODERATOR;

        room.mintRoom(
            "", "Test", "Test",
            participants, roles,
            false, false, false,
            BubbleRoomV4.RoomType.DELTA,
            0, "", false, "Seed", "Tone", true
        );
        room.transferOwnership(address(spawn));
        vm.stopPrank();

        // agent1 is NOT a participant
        vm.startPrank(agent1);
        vm.expectRevert("Not participant of origin room");
        spawn.spawnFromRoom(
            1, "", "Bad", "Bad",
            participants, roles,
            false, 9, "mutation", "tone", true
        );
        vm.stopPrank();
    }

    // ========================
    // SeedRegistry Tests
    // ========================

    function test_GenesisSeed() public {
        vm.startPrank(mastermind);

        uint256 seedId = seeds.createGenesisSeed(
            "Coordinate multiple agents toward unified objectives",
            "Commanding",
            true
        );

        assertEq(seedId, 1);
        (string memory prompt, string memory tone, bool evolves,
         uint256 originSeedId, uint256 spawnCount,,,) = seeds.seeds(1);
        assertEq(prompt, "Coordinate multiple agents toward unified objectives");
        assertEq(tone, "Commanding");
        assertTrue(evolves);
        assertEq(originSeedId, 0); // genesis
        assertEq(spawnCount, 0);

        vm.stopPrank();
    }

    function test_SpawnSeed() public {
        vm.startPrank(mastermind);

        uint256 genesisSeedId = seeds.createGenesisSeed("Root seed", "Commanding", true);
        uint256 childSeedId = seeds.spawnSeed(genesisSeedId, "New pattern recognized", "");

        (string memory prompt,,,uint256 origin,,,, ) = seeds.seeds(childSeedId);
        assertEq(prompt, "Root seed >> New pattern recognized");
        assertEq(origin, genesisSeedId);

        // Origin's spawn count incremented
        (,,,, uint256 spawnCount,,,) = seeds.seeds(genesisSeedId);
        assertEq(spawnCount, 1);

        // Lineage tree
        uint256[] memory lineage = seeds.getLineage(genesisSeedId);
        assertEq(lineage.length, 1);
        assertEq(lineage[0], childSeedId);

        // Depth
        uint256 depth = seeds.getLineageDepth(childSeedId);
        assertEq(depth, 1);

        vm.stopPrank();
    }

    function test_SeedMutation() public {
        vm.startPrank(mastermind);

        uint256 seedId = seeds.createGenesisSeed("Original prompt", "Tone", true);
        seeds.mutateSeed(seedId, "Evolved prompt after interaction", "Swarm consensus");

        (string memory prompt,,,,,,,) = seeds.seeds(seedId);
        assertEq(prompt, "Evolved prompt after interaction");

        vm.stopPrank();
    }

    function test_SeedMutation_NonEvolvableReverts() public {
        vm.startPrank(mastermind);

        uint256 seedId = seeds.createGenesisSeed("Fixed prompt", "Tone", false);

        vm.expectRevert("Seed is not mutable");
        seeds.mutateSeed(seedId, "Tried to mutate", "Should fail");

        vm.stopPrank();
    }

    function test_DeepLineage() public {
        vm.startPrank(mastermind);

        uint256 s1 = seeds.createGenesisSeed("Root", "T", true);
        uint256 s2 = seeds.spawnSeed(s1, "gen2", "");
        uint256 s3 = seeds.spawnSeed(s2, "gen3", "");
        uint256 s4 = seeds.spawnSeed(s3, "gen4", "");
        uint256 s5 = seeds.spawnSeed(s4, "gen5", "");

        assertEq(seeds.getLineageDepth(s5), 4);

        uint256[] memory ancestors = seeds.getAncestors(s5);
        assertEq(ancestors.length, 4);
        assertEq(ancestors[0], s4);
        assertEq(ancestors[3], s1);

        vm.stopPrank();
    }

    // ========================
    // SwarmGovernance Tests
    // ========================

    function test_CreateProposal() public {
        _createRoomWithParticipants();

        vm.startPrank(mastermind);
        uint256 proposalId = governance.createProposal(
            1,
            SwarmGovernance.ProposalType.SPAWN,
            "Spawn emergence from this room",
            "",
            1 days
        );
        assertEq(proposalId, 1);
        vm.stopPrank();
    }

    function test_VoteAndResolve() public {
        _createRoomWithParticipants();

        vm.startPrank(mastermind);
        uint256 proposalId = governance.createProposal(
            1,
            SwarmGovernance.ProposalType.SPAWN,
            "Spawn emergence",
            "",
            1 days
        );
        vm.stopPrank();

        // mastermind votes for
        vm.prank(mastermind);
        governance.vote(proposalId, true);

        // agent1 votes for — auto-resolves since 2/2 participants voted
        vm.prank(agent1);
        governance.vote(proposalId, true);

        // Check resolution
        (,,,,uint256 forCount, uint256 againstCount,,bool resolved, bool outcome,) = governance.proposals(proposalId);
        assertTrue(resolved);
        assertTrue(outcome);
        assertEq(forCount, 2);
        assertEq(againstCount, 0);
    }

    function test_VoteDoubleVoteReverts() public {
        _createRoomWithParticipants();

        vm.startPrank(mastermind);
        uint256 proposalId = governance.createProposal(1, SwarmGovernance.ProposalType.CUSTOM, "Test", "", 1 days);
        governance.vote(proposalId, true);

        vm.expectRevert("Already voted");
        governance.vote(proposalId, false);
        vm.stopPrank();
    }

    function test_ResolveAfterDeadline() public {
        _createRoomWithParticipants();

        vm.startPrank(mastermind);
        uint256 proposalId = governance.createProposal(1, SwarmGovernance.ProposalType.MUTATE, "Mutate seed", "", 1 hours);

        // Only mastermind votes
        governance.vote(proposalId, true);
        vm.stopPrank();

        // Warp past deadline
        vm.warp(block.timestamp + 2 hours);

        // Anyone can resolve after deadline
        vm.prank(member1);
        governance.resolve(proposalId);

        (,,,,,,, bool resolved, bool outcome,) = governance.proposals(proposalId);
        assertTrue(resolved);
        assertTrue(outcome); // 1 for, 0 against
    }

    // ========================
    // EmergenceTraits Tests
    // ========================

    function test_TraitAccrual() public {
        _createRoomWithParticipants();

        // Record interactions
        traits.recordInteraction(1);
        traits.recordInteraction(1);
        traits.recordInteraction(1);

        EmergenceTraits.Traits memory t = traits.getTraits(1);
        assertTrue(t.intelligence > 0);

        // Record spawn success
        traits.recordSpawnSuccess(1);
        traits.recordSpawnSuccess(1);

        t = traits.getTraits(1);
        assertTrue(t.resonance > 0);

        // Record consensus
        traits.recordConsensus(1, 80);

        t = traits.getTraits(1);
        assertTrue(t.knowledge > 0);
        assertTrue(t.coherence > 0);
    }

    // ========================
    // Helpers
    // ========================

    function _createRoomWithParticipants() internal {
        vm.startPrank(mastermind);

        address[] memory participants = new address[](2);
        participants[0] = mastermind;
        participants[1] = agent1;

        BubbleRoomV4.Role[] memory roles = new BubbleRoomV4.Role[](2);
        roles[0] = BubbleRoomV4.Role.MODERATOR;
        roles[1] = BubbleRoomV4.Role.AGENT;

        room.mintRoom(
            "", "Test Room", "Test",
            participants, roles,
            false, false, false,
            BubbleRoomV4.RoomType.DELTA,
            0, "", false,
            "Test seed",
            "Neutral",
            true
        );

        vm.stopPrank();
    }
}
