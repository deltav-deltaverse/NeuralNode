# 👥 Multiplicity in the DeltaVerse

**How multiple participants interact inside a living cryptographic construct.**

In the DeltaVerse, a BubbleRoom is not a simple token.  
It is a **multi-actor, tone-reactive, AI-symbiotic semantic chamber** capable of evolving its behavior, mood, and access patterns in response to human and machine interaction.

This document outlines how that multiplicity unfolds.

---

## 🧱 On-Chain Participant Structure

Each `BubbleRoomV4` NFT contains:

```solidity
mapping(address => Role) participantRoles;
address[] participants;
```
Roles are defined as:

```solidity
enum Role { NONE, MEMBER, AGENT, MODERATOR }
Role	Power Level	Capabilities
NONE	🚫	Cannot see or interact
MEMBER	🟢	View content, read logs
AGENT	🟠	Propose changes, alter tone, submit prompts
MODERATOR	🔴	Full control of participants, storage, and AI drift
```
🔄 Interaction Lifecycle
MODERATOR mints a new room with initial participants

AGENT interacts with AI (via prompt, emotional tone, signal)

MEMBER observes tone, story evolution, and vaults (if accessible)

Viewer UI reacts in real time using DeltaRoomViewer.jsx

🧠 Tone & AI Drift
Key metadata fields:

aiSeed → AI prompt seed

tone → Emotional + environmental vector

evolves → If true, room adapts over time

These values are mutable (by permission) and fed to:

AI models

Front-end rendering logic

Narrative vault generation

Each row represents a flow of authority, action, or data into the shared interface.

💻 Frontend Synchronization
DeltaRoomViewer.jsx pulls:
```txt
getRoomAI(roomId) → aiSeed, tone, evolves

getRoomParticipants(roomId) → List of users

[Role logic] → UI adapts based on connected wallet

The React UI renders:

Environment tone shift

Live prompt inputs (from AGENT)

Vault access (Lit or DRT-based)

Real-time participant counters and roles
```
🔐 Vault Access via Multiplicity
Optionally, use:

DRT tokens to gate room entry or feature sets

Lit Protocol to grant decryption rights based on role or DRT

Example:

Only DRT:0003 owners can open the room's story vault

Only MODERATOR can write to IPFS logs or commit prompt updates

🔮 Summary
You are not a user.
You are a participant node inside a semantic object.
Together, participants shape the story, influence the AI, and mutate the metadata of an NFT in real time.

Every room is a living network — with humans and machines converging on a cryptographic memory seed.

"The more who enter, the deeper the room becomes."
— DeltaV THRUST



---

## ✅ `DeltaRoomViewer.jsx` — Updated

Here’s how to add participant role detection and live UI adaptation:

```jsx
// Inside DeltaRoomViewer.jsx

const [participantRole, setParticipantRole] = useState("UNKNOWN");

const fetchUserRole = async () => {
  const addr = await signer.getAddress();
  const tokenId = roomId;
  const roleData = await contract.participantRoles(tokenId, addr); // you'd need a public getter
  const roleNames = ["NONE", "MEMBER", "AGENT", "MODERATOR"];
  setParticipantRole(roleNames[parseInt(roleData)]);
};

useEffect(() => {
  fetchRoom();
  fetchUserRole();
}, []);
```
In your UI:

<h4>🧾 Your Role: {participantRole}</h4>
You can also use participantRole to conditionally render vaults, input fields, etc.
