# 🧱 BubbleRoomV4: Dynamic Cryptographic Room Engine

_The modular spatial minting architecture behind the DeltaVerse Engine._

---

## 🧬 Overview

**BubbleRoomV4** is a next-generation, extensible ERC-721 smart contract that defines **interactive, metadata-rich, access-controlled rooms** as non-fungible tokens. These are not static tokens — they are **living cryptographic constructs**, each possessing attributes, participants, roles, AI hooks, and environmental logic.

A **BubbleRoom** represents a secure, decentralized **semantic space** — capable of evolving based on user interaction, AI analysis, unlock conditions, and storage inputs.

---

## 🔧 Technical Summary

- **Type**: ERC-721 NFT (using `ERC721URIStorage`)
- **Extends**: `Ownable` (contract-level control)
- **Room ID**: Auto-incremented via `nextRoomId`
- **Participants**: Mapped with role-based permissions
- **Metadata**: On-chain structural data + off-chain content via IPFS

---

## 🧩 Data Structure

### 🔸 `enum Role`

Defines user authority within a room context:

```solidity
enum Role { NONE, MEMBER, AGENT, MODERATOR }
NONE: No access

MEMBER: Default viewer/participant

AGENT: Power user, signals, modifies content

MODERATOR: Full control of participant set

🔸 enum RoomType
Defines the existential nature of the room.

solidity
Copy
Edit
enum RoomType {
  TEMPORARY, LIVING, EPHEMERAL, ARCHIVAL,
  INCUBATOR, SIGNAL, STORAGE, TIMELOCKED,
  VAULT, DELTA
}
Type	Description
TEMPORARY	Disposable, time-limited session room
LIVING	Persistent space, always mutable
EPHEMERAL	Flash-event space with no memory
ARCHIVAL	Immutable historical logroom
INCUBATOR	For evolving proposals or prototypes
SIGNAL	Machine-coordination or DAO ops
STORAGE	Data holding room, with optional vaulting
TIMELOCKED	Unlockable room (future/triggered)
VAULT	Encrypted memory room
DELTA	AI-reactive, tone-sensitive, semantically adaptive room (DeltaVerse core)

🧠 struct Room
The core room schema — each NFT minted instantiates this structure.

solidity
Copy
Edit
struct Room {
  string theme;
  string originEvent;
  uint256 timestamp;
  uint256 unlockTime;
  string storageCID;
  bool isEncryptedStorage;
  bool isPrivate;
  bool isStable;
  bool isSoulbound;
  bool isActive;
  RoomType roomType;
  address owner;
  mapping(address => Role) participantRoles;
  address[] participants;

  // AI-Linked Metadata
  string aiSeed;
  string tone;
  bool evolves;
}
⚙️ Contract Functions
🔨 mintRoom(...)
Mints a new BubbleRoom NFT, initializes structural and AI metadata, and assigns roles to participants.

Parameters:

metadataURI: IPFS URI to external room metadata

theme, originEvent: Room identity descriptors

initialParticipants, roles: Access mapping

roomType: Determines logic category

unlockTime, storageCID, isEncryptedStorage: Vault mechanics

aiSeed, tone, evolves: AI-reactive fields

Returns: roomId (uint256)

solidity
Copy
Edit
function mintRoom(...) external returns (uint256);
👁️ getRoomAI(uint256 roomId)
Fetches the AI-metadata trio for the given room.

solidity
Copy
Edit
function getRoomAI(uint256 roomId)
  external view
  returns (string memory aiSeed, string memory tone, bool evolves);
👥 getRoomParticipants(uint256 roomId)
Returns the full participant list.

solidity
Copy
Edit
function getRoomParticipants(uint256 roomId)
  external view
  returns (address[] memory);
🔐 Access Control
Only the original room creator (NFT owner) may:

Modify participant list

Transfer or burn the token (unless soulbound)

Trigger future evolutions (e.g., snapshot forks)

Role-based logic is externally readable — integration with frontend agents can interpret the role values for UX variation.

🧠 AI Reactivity
Each room may have these on-chain AI fields:

Field	Description
aiSeed	Semantic AI prompt for GPT, embedding, or finetuned agents
tone	Describes emotional or environmental atmosphere
evolves	Boolean flag to determine if AI may mutate room metadata or visual interface

This allows the creation of DeltaRooms — cryptosemantic entities that live and morph.

🗃️ Storage Integration
If isEncryptedStorage is true, storageCID may point to:

A Lit Protocol-encrypted narrative vault

An AI-generated transcript

A knowledge capsule tied to participant interactions

🌌 DeltaRoom Specifics
A RoomType.DELTA room is considered alive.

It can:

Adjust itself based on user sentiment

Feed AI prompts and receive live feedback

Host temporally reactive vaults

Represent a true "imaginarium NFT"

💡 Suggested Usage Patterns
Use Case	Implementation Notes
AI-driven storytelling	Set aiSeed as world prompt, evolve narrative via IPFS log
Private planning cells	isPrivate = true, storageCID points to DAO or IPFS manifest
Time-release events	roomType = TIMELOCKED, unlockTime = future timestamp
Memory vaults	roomType = VAULT, use Lit for encryption

🧱 Extensibility
Contract is modular and compatible with proxy patterns

Roles can be extended via external RoleManager contract

Supports custom frontend agents and embedded AI oracles

Designed for co-creation, co-presence, and participatory worldbuilding

🧠 Part of the DeltaVerse Engine
BubbleRoomV4 is the foundation of the DeltaVerse protocol.
Every room is a semantic particle in a cryptoverse of imagination.

Coupled with DeltaGenesisSBT and DeltaRoomViewer, it forms the basis for:

AI-reconfigurable NFTs

Cryptographic story chambers

Dynamic governance via interaction tone

"And the room listened. And it changed. And it remembered."

© DeltaV THRUST 2024
MIT License – https://deltavthrust.com
