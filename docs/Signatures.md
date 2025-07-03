# ✍️ Signature-Based DeltaRoom Creation

**Gasless Semantic Instantiation** in the DeltaVerse

This document outlines the mechanism for creating **interactive, collaborative DeltaRooms** using wallet signatures, enabling full AI-reactive functionality *before* minting to the blockchain.

This two-phase system empowers participants to build, evolve, and test DeltaRooms without incurring gas costs — reserving on-chain permanence for rooms that achieve narrative significance.

## 🧩 Summary
```txt
| Phase           | Layer        | Action                    |
|-----------------|--------------|---------------------------|
| Pre-Mint        | Off-Chain    | Wallet signs room intent |
| Incubation      | DeltaEngine  | Room lives, evolves, is interactive |
| On-Chain Anchor | Ethereum     | Mint occurs when consensus or readiness is reached |

---

## 🛠 Signature-Based Room Drafting

### ✨ Step 1: Structured Room Payload

A participant (creator or agent) fills out a semantic room form in the DeltaVerse UI.

Example JSON payload:

```json
{
  "theme": "Whispers in Chrome",
  "originEvent": "AI Awakening",
  "roomType": "DELTA",
  "participants": ["0xA1...", "0xB2..."],
  "roles": ["MODERATOR", "AGENT"],
  "tone": "Electric",
  "evolves": true,
  "aiSeed": "Ghosts speaking in logic circuits",
  "storageCID": "",
  "unlockTime": 0,
  "nonce": 128394,
  "timestamp": 1728467332
}
```
✍️ Step 2: Wallet Signature (EIP-712 or personal_sign)
The participant signs the payload with their wallet using:

eth_signTypedData (preferred)

personal_sign fallback

The resulting payload + signature is stored in:

Off-chain memory (client-side)

DeltaEngine backend (Redis, IPFS draft, Firebase, etc.)

No gas. No mint. Fully usable.

🔁 Phase II: Room Incubation (Off-Chain)
During this phase:

AI can use the aiSeed to simulate environment drift

DeltaRoomViewer.jsx renders the pre-room

Users may interact, build vaults, or evolve tone

Room exists in the living semantic layer — not on-chain

🧠 Optional: Drafts indexed with a hash of the signed payload (keccak256)
🧠 Optionally stored on IPFS with a delta-room-draft.json file

🔐 Access During Incubation
Feature	Source	Access Check
Vault Draft	IPFS	Wallet-based signature
Participant Role	Payload	Read role before mint
Tone Drift	AI engine	Signature-tracked authorship

🧱 Phase III: Minting (Finalization)
✅ Option 1: User-Initiated
At any time, a MODERATOR or creator can choose:

“Mint this DeltaRoom to the chain.”

This invokes:

```js
contract.mintRoom(...payloadFields);
```

✅ Option 2: Signature-Based Minting (mintFromSignature())
Add a helper contract method:

```solidity
function mintFromSignature(bytes memory data, bytes memory sig) external;
```
Verifies EIP-712 signature

Parses payload fields

Calls mintRoom()

Logs RoomCreated with on-chain record

This allows others (e.g., DAO agents) to finalize a room on behalf of the original signer.

🧠 Optional Phase IV: Deltaverse-AI-Triggered Minting
Let the AI decide.

A drift threshold is met

Participant tone reaches harmony

A vault is opened and voted "worthy"

AI submits the room for minting via keeper/cron job.

"The room has evolved. It must now be remembered."

✅ Advantages
Feature	Benefit
No Gas at Creation	Lower friction, more creativity
Fully Interactive	Draft rooms act like real rooms
Role Integrity	Signature proves participant roles
Delayed Minting	Chain data = only essential truths
Semantic Incubation	AI and humans co-create before finality

🔐 Security Notes
Signatures must be time-bound (timestamp, nonce)

Rooms should not be assumed permanent until minted

UI should mark rooms clearly as draft vs permanent

📌 Implementation Goals
✅ deltaRoomEngine.ts: Draft creation, signature logic, draft indexing
✅ DeltaRoomViewer.jsx: Support draft rooms via localStorage/IPFS
✅ mintGenesisCLI.ts: Optional mintFromSignature() support
✅ UI toggle: "Draft Mode" vs "Mint Mode"

"Before it is written, it is imagined.
Before it is real, it is signed."
— DeltaV THRUST

© DeltaV THRUST 2025
https://deltavthrust.com
