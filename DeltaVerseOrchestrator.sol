// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./BubbleRoomV4.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract DeltaVerseOrchestrator {
    using ECDSA for bytes32;
    BubbleRoomV4 public bubbleRoom;

    constructor(address bubbleRoomAddress) {
        bubbleRoom = BubbleRoomV4(bubbleRoomAddress);
    }

    // NOTE: This is a basic demo and expects trusted data. Production implementation must do full EIP-712 verification.
    function mintFromSignature(
        string memory metadataURI,
        string memory theme,
        string memory originEvent,
        address[] memory participants,
        uint8[] memory roles, // Pass as uint8 for Role enum
        bool isPrivate,
        bool isStable,
        bool isSoulbound,
        BubbleRoomV4.RoomType roomType,
        uint256 unlockTime,
        string memory storageCID,
        bool isEncryptedStorage,
        string memory aiSeed,
        string memory tone,
        bool evolves,
        bytes memory sig
    ) public {
        // For production: Recover signer from sig and check against participants[0] or creator role
        // bytes32 hash = keccak256(...); // Build EIP-712 digest
        // address signer = hash.recover(sig);
        // require(signer == participants[0], "Signature does not match creator");

        // For now, allow any caller
        // Convert roles from uint8[] to BubbleRoomV4.Role[]
        BubbleRoomV4.Role[] memory roleEnums = new BubbleRoomV4.Role[](roles.length);
        for (uint256 i = 0; i < roles.length; i++) {
            roleEnums[i] = BubbleRoomV4.Role(roles[i]);
        }

        bubbleRoom.mintRoom(
            metadataURI,
            theme,
            originEvent,
            participants,
            roleEnums,
            isPrivate,
            isStable,
            isSoulbound,
            roomType,
            unlockTime,
            storageCID,
            isEncryptedStorage,
            aiSeed,
            tone,
            evolves
        );
    }
}
