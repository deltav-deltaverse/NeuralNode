// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../contracts/BubbleRoomV4.sol";
import "../contracts/DeltaGenesisSBT.sol";
import "../contracts/BubbleRoomSpawn.sol";
import "../contracts/EmergenceTraits.sol";
import "../contracts/TombRegistry.sol";

contract TombTest is Test {
    BubbleRoomV4 public room;
    DeltaGenesisSBT public sbt;
    BubbleRoomSpawn public spawn;
    EmergenceTraits public traits;
    TombRegistry public tomb;

    address public mastermind = address(1);
    address public agent1 = address(2);

    function setUp() public {
        vm.startPrank(mastermind);
        room = new BubbleRoomV4();
        sbt = new DeltaGenesisSBT();
        spawn = new BubbleRoomSpawn(address(room));
        traits = new EmergenceTraits(address(room), address(spawn));
        tomb = new TombRegistry(address(room), address(sbt), address(traits));

        // Mint a room with 2 participants
        address[] memory p = new address[](2);
        p[0] = mastermind;
        p[1] = agent1;
        BubbleRoomV4.Role[] memory r = new BubbleRoomV4.Role[](2);
        r[0] = BubbleRoomV4.Role.MODERATOR;
        r[1] = BubbleRoomV4.Role.AGENT;
        room.mintRoom("", "Dojo", "Origin", p, r, false, false, false,
            BubbleRoomV4.RoomType.DELTA, 0, "", false, "seed", "tone", true);

        // Mint a second room for transfers
        room.mintRoom("", "Boardroom", "Trade", p, r, false, false, false,
            BubbleRoomV4.RoomType.DELTA, 0, "", false, "seed2", "tone2", true);

        vm.stopPrank();
    }

    // ========================
    // Vault Creation
    // ========================

    function test_CreateTomb() public {
        vm.startPrank(mastermind);
        uint256 id = tomb.createVault(1, "ipfs://encrypted", "ipfs://key", 0,
            TombRegistry.VaultClass.TOMB, "");
        assertEq(id, 1);

        (uint256 roomId,,,,TombRegistry.VaultState state, TombRegistry.VaultClass vc,
         string memory name, address creator,,,) = tomb.vaults(1);
        assertEq(roomId, 1);
        assertEq(uint8(state), uint8(TombRegistry.VaultState.SEALED));
        assertEq(uint8(vc), uint8(TombRegistry.VaultClass.TOMB));
        assertEq(creator, mastermind);
        assertEq(bytes(name).length, 0);
        vm.stopPrank();
    }

    function test_CreateChest() public {
        vm.startPrank(mastermind);
        uint256 id = tomb.createVault(1, "ipfs://chest", "ipfs://chestkey", 0,
            TombRegistry.VaultClass.CHEST, "Golden Chest");
        (,,,,, TombRegistry.VaultClass vc, string memory name,,,,) = tomb.vaults(id);
        assertEq(uint8(vc), uint8(TombRegistry.VaultClass.CHEST));
        assertEq(name, "Golden Chest");
        vm.stopPrank();
    }

    function test_CreateCustom() public {
        vm.startPrank(mastermind);
        uint256 id = tomb.createVault(1, "ipfs://custom", "ipfs://ckey", 0,
            TombRegistry.VaultClass.CUSTOM, "Pandora's Box");
        (,,,,, TombRegistry.VaultClass vc, string memory name,,,,) = tomb.vaults(id);
        assertEq(uint8(vc), uint8(TombRegistry.VaultClass.CUSTOM));
        assertEq(name, "Pandora's Box");
        vm.stopPrank();
    }

    function test_CustomRequiresName() public {
        vm.startPrank(mastermind);
        vm.expectRevert("Custom class requires a name");
        tomb.createVault(1, "ipfs://x", "ipfs://y", 0, TombRegistry.VaultClass.CUSTOM, "");
        vm.stopPrank();
    }

    // ========================
    // Time Oracle
    // ========================

    function test_TimeOracle() public {
        vm.startPrank(mastermind);
        uint256 id = tomb.createVault(1, "ipfs://enc", "ipfs://k", 0,
            TombRegistry.VaultClass.CHEST, "");

        // Add time oracle: unlock after 1 day
        uint256 unlockTime = block.timestamp + 1 days;
        tomb.addTimeOracle(id, unlockTime);

        // Evaluate before time — should NOT satisfy
        tomb.evaluateConsent(id);
        assertFalse(tomb.allConsentMet(id));

        // Warp past unlock time
        vm.warp(unlockTime + 1);
        tomb.evaluateConsent(id);
        assertTrue(tomb.allConsentMet(id));

        // Now can unlock
        tomb.unlock(id);
        (,,,, TombRegistry.VaultState state,,,,,,) = tomb.vaults(id);
        assertEq(uint8(state), uint8(TombRegistry.VaultState.UNLOCKED));

        vm.stopPrank();
    }

    // ========================
    // Identity Oracle
    // ========================

    function test_IdentityOracle() public {
        vm.startPrank(mastermind);
        uint256 id = tomb.createVault(1, "ipfs://enc", "ipfs://k", 0,
            TombRegistry.VaultClass.SAFETYDEPOSITBOX, "");

        // Require agent1's consent
        tomb.addIdentityOracle(id, agent1);
        vm.stopPrank();

        // Evaluate as mastermind — should fail (not the required identity)
        vm.startPrank(mastermind);
        tomb.evaluateConsent(id);
        assertFalse(tomb.allConsentMet(id));
        vm.stopPrank();

        // Evaluate as agent1 — should succeed
        vm.startPrank(agent1);
        tomb.evaluateConsent(id);
        assertTrue(tomb.allConsentMet(id));
        vm.stopPrank();
    }

    // ========================
    // Condition Oracle (Traits)
    // ========================

    function test_ConditionOracle() public {
        vm.startPrank(mastermind);
        uint256 id = tomb.createVault(1, "ipfs://enc", "ipfs://k", 0,
            TombRegistry.VaultClass.TREASURE, "");

        // Require intelligence >= 30
        tomb.addConditionOracle(id, 0, 30); // traitType 0 = intelligence

        // No interactions yet — intelligence = 0
        tomb.evaluateConsent(id);
        assertFalse(tomb.allConsentMet(id));

        // Record interactions to build intelligence
        traits.recordInteraction(1);
        traits.recordInteraction(1);
        traits.recordInteraction(1);

        // Re-evaluate
        tomb.evaluateConsent(id);
        assertTrue(tomb.allConsentMet(id));

        vm.stopPrank();
    }

    // ========================
    // Multi-Oracle (AND logic)
    // ========================

    function test_MultiOracle() public {
        vm.startPrank(mastermind);
        uint256 id = tomb.createVault(1, "ipfs://enc", "ipfs://k", 0,
            TombRegistry.VaultClass.SECRET, "");

        // Require time + condition
        tomb.addTimeOracle(id, block.timestamp + 1 hours);
        tomb.addConditionOracle(id, 0, 15); // intelligence >= 15

        // Neither met
        tomb.evaluateConsent(id);
        assertFalse(tomb.allConsentMet(id));

        // Meet time but not condition
        vm.warp(block.timestamp + 2 hours);
        tomb.evaluateConsent(id);
        assertFalse(tomb.allConsentMet(id));

        // Meet condition
        traits.recordInteraction(1);
        traits.recordInteraction(1);
        tomb.evaluateConsent(id);
        assertTrue(tomb.allConsentMet(id));

        vm.stopPrank();
    }

    // ========================
    // Tomb (Soulbound) cannot transfer
    // ========================

    function test_TombSoulboundCannotTransfer() public {
        vm.startPrank(mastermind);
        uint256 id = tomb.createVault(1, "ipfs://enc", "ipfs://k", 0,
            TombRegistry.VaultClass.TOMB, "");

        vm.expectRevert("Tomb class is soulbound to room");
        tomb.transferVault(id, 2);
        vm.stopPrank();
    }

    // ========================
    // Chest (Tradeable) can transfer
    // ========================

    function test_ChestCanTransfer() public {
        vm.startPrank(mastermind);
        uint256 id = tomb.createVault(1, "ipfs://enc", "ipfs://k", 0,
            TombRegistry.VaultClass.CHEST, "Treasure Chest");

        tomb.transferVault(id, 2);
        (uint256 roomId,,,,,,,,,,) = tomb.vaults(id);
        assertEq(roomId, 2);
        vm.stopPrank();
    }

    // ========================
    // Secret requires reveal before transfer
    // ========================

    function test_SecretRequiresReveal() public {
        vm.startPrank(mastermind);
        uint256 id = tomb.createVault(1, "ipfs://enc", "ipfs://k", 0,
            TombRegistry.VaultClass.SECRET, "Hidden Truth");

        // Cannot transfer while sealed
        vm.expectRevert("Secret not yet revealed");
        tomb.transferVault(id, 2);

        // No oracles — can unlock directly
        tomb.unlock(id);

        // Now can transfer
        tomb.transferVault(id, 2);
        (uint256 roomId,,,,,,,,,,) = tomb.vaults(id);
        assertEq(roomId, 2);
        vm.stopPrank();
    }

    // ========================
    // Seal resets consent
    // ========================

    function test_SealResetsConsent() public {
        vm.startPrank(mastermind);
        uint256 id = tomb.createVault(1, "ipfs://enc", "ipfs://k", 0,
            TombRegistry.VaultClass.CHEST, "");

        tomb.addTimeOracle(id, block.timestamp + 1 hours);
        vm.warp(block.timestamp + 2 hours);
        tomb.evaluateConsent(id);
        assertTrue(tomb.allConsentMet(id));

        tomb.unlock(id);
        tomb.seal(id);

        // Consent reset after seal
        assertFalse(tomb.allConsentMet(id));
        vm.stopPrank();
    }

    // ========================
    // Reclassify
    // ========================

    function test_Reclassify() public {
        vm.startPrank(mastermind);
        uint256 id = tomb.createVault(1, "ipfs://enc", "ipfs://k", 0,
            TombRegistry.VaultClass.CHEST, "");

        tomb.reclassify(id, TombRegistry.VaultClass.CUSTOM, "Ark of the Covenant");
        (,,,,, TombRegistry.VaultClass vc, string memory name,,,,) = tomb.vaults(id);
        assertEq(uint8(vc), uint8(TombRegistry.VaultClass.CUSTOM));
        assertEq(name, "Ark of the Covenant");
        vm.stopPrank();
    }

    // ========================
    // Revoke
    // ========================

    function test_Revoke() public {
        vm.startPrank(mastermind);
        uint256 id = tomb.createVault(1, "ipfs://enc", "ipfs://k", 0,
            TombRegistry.VaultClass.CHEST, "");

        tomb.revoke(id);
        (,,,, TombRegistry.VaultState state,,,,,,) = tomb.vaults(id);
        assertEq(uint8(state), uint8(TombRegistry.VaultState.REVOKED));

        // Cannot transfer revoked vault
        vm.expectRevert("Vault revoked");
        tomb.transferVault(id, 2);
        vm.stopPrank();
    }
}
