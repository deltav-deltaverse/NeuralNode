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

    function mintFromSignature(
        string memory metadataURI,
        string memory theme,
        string memory originEvent,
        address[] memory participants,
        uint8[] memory roles,
        bool isPrivate,
        bool isStable,
        bool isSoulbound,
        uint8 roomType,
        uint256 unlockTime,
        string memory storageCID,
        bool isEncryptedStorage,
        string memory aiSeed,
        string memory tone,
        bool evolves,
        bytes memory sig
    ) public {
        // Create EIP-191/EIP-712-like digest; in full prod, use EIP-712 utils (not shown for brevity)
        bytes32 hash = keccak256(abi.encodePacked(
            metadataURI,
            theme,
            originEvent,
            keccak256(abi.encodePacked(participants)),
            keccak256(abi.encodePacked(roles)),
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
        ));
        address signer = hash.toEthSignedMessageHash().recover(sig);
        require(signer == participants[0], "Invalid creator signature");

        // Convert roles to BubbleRoomV4.Role[]
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
            BubbleRoomV4.RoomType(roomType),
            unlockTime,
            storageCID,
            isEncryptedStorage,
            aiSeed,
            tone,
            evolves
        );
    }
}
