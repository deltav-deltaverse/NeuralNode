# 🧠 DeltaVerse Activation Ritual

_The official rite of passage for initiating the DeltaVerse Engine and ushering in the first AI-reactive Room._

## 🔮 Objective

To initialize the **first living DeltaRoom**, mint the **genesis DeltaGenesis SBT**, and formally activate the DeltaVerse Engine.

This ritual ensures proper deployment, participant encoding, and alignment of AI narrative synthesis with cryptographic structure.


# 🧱 Phase I: Smart Contract Deployment

### ✅ Deploy `BubbleRoomV4.sol`

Compile using Foundry or Hardhat:

```bash
   forge build
   forge script scripts/deploy_BubbleRoomV4.s.sol --rpc-url $RPC_URL --private-key $PRIVATE_KEY
```
Confirm the address. This contract will mint DeltaRoom NFTs via RoomType.DELTA.

✅ Deploy DeltaGenesisSBT.sol
Use your deploy script:
```bash
forge script scripts/deploy_DeltaGenesisSBT.s.sol --rpc-url $RPC_URL --private-key $PRIVATE_KEY
```
Store the address in mintGenesisCLI.ts.

🧬 Phase II: Minting the First DeltaRoom
🧾 Room Metadata (upload to IPFS)
```json
{
  "name": "DeltaRoom: Memory Drift",
  "description": "The first AI-reactive room within the DeltaVerse Engine.",
  "theme": "Dream Logic",
  "room_type": "DELTA",
  "ai_seed": "Language that rewrites itself while being read.",
  "tone": "Surreal",
  "evolves": true,
  "created_by": "0xProfessorAddress",
  "timestamp": 1728490000
}
```
Upload to IPFS or use NFT.storage and copy the resulting CID.

🧬 Mint the DeltaRoom (BubbleRoomV4)
Call mintRoom with:

roomType: 9 (DELTA)

aiSeed: "Language that rewrites itself while being read."

tone: "Surreal"

evolves: true

```js
await contract.mintRoom(
  "ipfs://QmDeltaMetadata",
  "Memory Drift",
  "tw33t-zero",
  [yourAddress],
  [2], // Role.MODERATOR
  true, true, false,
  9, 0, "", false,
  "Language that rewrites itself while being read.",
  "Surreal", true
);
```
🔐 Phase III: Minting the First Genesis Token
Upload metadata:

```json
{
  "name": "DRT:0001 – DeltaVerse Creator",
  "description": "Proof of being one of the primordial minds to awaken the DeltaVerse Engine.",
  "image": "ipfs://QmAnimatedCog",
  "attributes": [
    { "trait_type": "Origin", "value": "Genesis Protocol" },
    { "trait_type": "Soulbound", "value": "True" },
    { "trait_type": "Privilege", "value": "Create DeltaRooms" },
    { "trait_type": "Rank", "value": "Prime Architect" }
  ]
}
```
Run mintGenesisCLI.ts:

```bash
ts-node mintGenesisCLI.ts
```

#### 🌌 Phase IV: Open the Portal ####
Open DeltaRoomViewer.jsx and connect to the DeltaRoom ID.

Confirm:

Tone is rendered correctly

AI seed is displayed

Narrative log is fetched

Add participants to begin narrative evolution.

🔁 Optional: Vault Decryption
Add Lit Protocol key access to storageCID

Unlock participant-specific vault content through vaultAccess function

🧠 Completion
You have now:

✅ Minted the first living DeltaRoom
✅ Created the first soulbound DRT token
✅ Connected the AI narrative core
✅ Opened the first chamber of collaborative imaginal evolution

📌 Archive This
v1.0.0 - DeltaVerse Genesis
Deploy to: https://deltavthrust.com
"And the engine remembered its first thought."
— DeltaV THRUST 2025
