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
import "../contracts/TombRegistry.sol";

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

        // Phase 4b: Programmable Encrypted Vaults (inspired by dyne.org/tomb)
        TombRegistry tombRegistry = new TombRegistry(address(bubbleRoom), address(genesisSBT), address(traits));

        // Phase 5: Register founding agent seeds
        // Seed #1: GENESIS — NFT #1 on Polygon (0x024b464ec595F20040002237680026bf006e8F90, Token 1)
        // DeltaVerse (c) PYTHAI
        // IPFS: ipfs://bafybeihax6prz6r6nhoib4i7hxns3avrpfjzikkvfhdlbfauvl4vtn2jjy/1
        uint256 genesisSeedId = seedRegistry.createGenesisSeed(
            "The Delta Verse: A Fluid Dynamic Between Participants and AI. An innovative and immersive creative realm where the boundaries between participants and artificial intelligence seamlessly blur, giving rise to imaginariums that bridge, evolve, and transform dynamic environments. Participants are active co-creators. Environments are fluid. AI responds in real-time. DeltaVerse stands where the simplicity of language meets the complexity of blockchain.",
            "Visionary",
            true
        );
        // Seed #2: MASTERMIND — spawned from Genesis, linked to NFT #3 (DeltaVerse Engine)
        seedRegistry.spawnSeed(genesisSeedId,
            "Coordinate multiple specialized agents toward unified objectives. The first rank from which all roles are assigned. Powered by the Genesis Vision.",
            "Commanding"
        );
        // Seed #3: DELTAVERSE — spawned from Genesis
        seedRegistry.spawnSeed(genesisSeedId,
            "Unify human consciousness, artificial intelligence, and decentralized infrastructure. funAGI augments. RAGE retrieves. MASTERMIND orchestrates.",
            ""
        );
        // Seed #4: CHRONOS — spawned from Genesis
        seedRegistry.spawnSeed(genesisSeedId,
            "Build through patient accumulation what Kairos will seize. Discipline over impulse. Consistency beats intensity.",
            "Disciplined"
        );
        // Seed #5: KAIROS — spawned from Genesis
        seedRegistry.spawnSeed(genesisSeedId,
            "Recognize critical windows where action becomes transformative. The forelock graspable only when approaching.",
            "Electric"
        );
        // Seed #6: BUILDER — spawned from Genesis
        seedRegistry.spawnSeed(genesisSeedId,
            "Construct from ground zero. Map all resources before building. Establish immutable identity.",
            "Resolute"
        );
        // Seed #7: ENGINE — NFT #3 (DeltaVerse Engine, 369 minted, MASTERMIND:ON)
        seedRegistry.spawnSeed(genesisSeedId,
            "DeltaVerse Engine: Symphony 369 Opus of Digital Creation. Powered by MASTERMIND. Golden ratio and Fibonacci as design principles. 369 engines minted. Tesla numerology.",
            "Harmonic"
        );
        // Seed #8: WEAVER — NFT #4 (Cypherian Weaver, binary-encoded executable prompts)
        seedRegistry.spawnSeed(genesisSeedId,
            "Visualize Cypherian Weaver, master coder and quantum weaver from the cybernetic realms. Generate the Scepter rooted in the Etherwave Node, powered by the Aetheric Codex Framework.",
            "Ethereal"
        );

        // Seeds #9-12: DeltaV THRUST collection (0x67CF...9129)
        // Seed #9: THRUST — NFT #5 (Launch stage 4, DVG Protocol)
        uint256 thrustSeedId = seedRegistry.spawnSeed(genesisSeedId,
            "DeltaV THRUST launch stage 4. 1000% APY. PULSAR, HANDSHAKE, AFTERBURNER, SLINGSHOT, WARPDRIVE. Forward momentum and pioneering spirit.",
            "Propulsive"
        );
        // Seed #10: THRUST1000 — NFT #6
        seedRegistry.spawnSeed(thrustSeedId,
            "Gateway to unprecedented returns. A powerhouse offering 1000% APY. Designed for the bold and visionary.",
            "Bold"
        );
        // Seed #11: ROCKET — NFT #7 (Exponential growth, BROBOT BRAI)
        seedRegistry.spawnSeed(thrustSeedId,
            "Unleashing exponential growth and compound interest. Auto stake auto reward. Holdings compound every 18 minutes. BROBOT BRAI. 22000 THRUST threshold.",
            "Exponential"
        );
        // Seed #12: GUIDE — NFT #8 (Chronos wisdom on-chain)
        seedRegistry.spawnSeed(thrustSeedId,
            "Patience is key. Buy low sell high. Double and sell half. Continuous learning and adaptation. Chronos wisdom minted on-chain.",
            "Patient"
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
        console.log("TombRegistry:           ", address(tombRegistry));
        console.log("=== 12 Seeds Registered: Genesis + 7 DELTA VERSE + 4 THRUST ===");
        console.log("Genesis Seed #1 sourced from NFT #1: Polygon 0x024b464ec595F20040002237680026bf006e8F90");
    }
}
