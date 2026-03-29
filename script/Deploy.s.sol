// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../contracts/BubbleRoomV4.sol";
import "../contracts/DeltaGenesisSBT.sol";
import "../contracts/DeltaVerseOrchestrator.sol";
import "../contracts/BubbleRoomSpawn.sol";
import "../contracts/EmergenceTraits.sol";
import "../contracts/SeedRegistry.sol";
import "../contracts/SwarmGovernance.sol";

contract DeployDeltaVerse is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Phase 1: Core contracts
        BubbleRoomV4 bubbleRoom = new BubbleRoomV4();
        DeltaGenesisSBT genesisSBT = new DeltaGenesisSBT();

        // Phase 2: Orchestration
        DeltaVerseOrchestrator orchestrator = new DeltaVerseOrchestrator(address(bubbleRoom));
        BubbleRoomSpawn spawn = new BubbleRoomSpawn(address(bubbleRoom));

        // Phase 3: Traits and Seeds
        EmergenceTraits traits = new EmergenceTraits(address(bubbleRoom), address(spawn));
        SeedRegistry seedRegistry = new SeedRegistry();

        // Phase 4: Governance
        SwarmGovernance governance = new SwarmGovernance(address(bubbleRoom), address(traits));

        // Phase 5: Register founding agent seeds
        seedRegistry.createGenesisSeed(
            "Coordinate multiple specialized agents toward unified objectives. The first rank from which all roles are assigned.",
            "Commanding",
            true
        );
        seedRegistry.createGenesisSeed(
            "Unify human consciousness, artificial intelligence, and decentralized infrastructure.",
            "Visionary",
            true
        );
        seedRegistry.createGenesisSeed(
            "Build through patient accumulation what Kairos will seize. Discipline over impulse.",
            "Disciplined",
            true
        );
        seedRegistry.createGenesisSeed(
            "Recognize critical windows where action becomes transformative. The forelock graspable only when approaching.",
            "Electric",
            true
        );
        seedRegistry.createGenesisSeed(
            "Construct from ground zero. Map all resources before building. Establish immutable identity.",
            "Resolute",
            true
        );

        vm.stopBroadcast();

        // Log addresses
        console.log("=== DeltaVerse Deployed ===");
        console.log("BubbleRoomV4:           ", address(bubbleRoom));
        console.log("DeltaGenesisSBT:        ", address(genesisSBT));
        console.log("DeltaVerseOrchestrator: ", address(orchestrator));
        console.log("BubbleRoomSpawn:        ", address(spawn));
        console.log("EmergenceTraits:        ", address(traits));
        console.log("SeedRegistry:           ", address(seedRegistry));
        console.log("SwarmGovernance:        ", address(governance));
        console.log("=== 5 Agent Seeds Registered ===");
    }
}
