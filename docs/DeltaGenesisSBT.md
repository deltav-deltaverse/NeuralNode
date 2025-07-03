# 🔐 DeltaGenesisSBT: The Mythic Signature Layer

_A Soulbound Token (SBT) system encoding privilege, memory, and myth into the DeltaVerse._

---

## 🧠 What is DeltaGenesisSBT?

The `DeltaGenesisSBT` contract governs a set of **non-transferable soulbound NFTs** known as **Delta Genesis Tokens (DRT)** — cryptographic proofs of origin, contribution, and privilege in the DeltaVerse.

Each DRT is more than a token — it's a **semantic identity shard**, a narrative sigil, a piece of decentralized memory.

These tokens are minted **only** by the protocol owner and are tied eternally to a wallet. Once granted, they **cannot be sold, transferred, or lost** — they are as permanent as myth.

---

## 🔧 Technical Summary

- **Type**: ERC-721 NFT (soulbound)
- **Standard**: ERC721URIStorage
- **Transferability**: 🔒 **Locked** (soulbound)
- **Mint Authority**: Only contract owner can mint
- **Burnable**: Yes (only by owner of the token)

---

## 🧬 Contract Architecture

```solidity
contract DeltaGenesisSBT is ERC721URIStorage, Ownable
```
The contract extends:

ERC721URIStorage: Allows full metadata URIs per-token (e.g., IPFS)

Ownable: Only the deployer or assigned owner can mint Genesis tokens

🧾 Data Mappings
```solidity
mapping(uint256 => bool) public soulbound;
mapping(address => bool) public hasClaimed;
soulbound[tokenId]: Ensures token is non-transferable

hasClaimed[address]: Prevents duplicates; each participant gets one genesis slot
```
⚙️ Contract Functions
🔨 mintGenesis(address recipient, string memory uri)
Mints a new Delta Genesis Token to a specific address. Must be called by the contract owner.

Verifies the user hasn't already claimed

Assigns a unique tokenId and links to metadata URI

Marks token as soulbound

```solidity
function mintGenesis(address recipient, string memory uri) external onlyOwner;
🔁 _beforeTokenTransfer(...)
```
Overrides ERC721's default transfer logic to block all transfers post-mint. A DRT may only travel from address(0) (mint) to the recipient.

```solidity
function _beforeTokenTransfer(...) internal override
```
Attempting to send a DRT to another wallet will revert with:

"Soulbound: non-transferable"

🔥 burn(uint256 tokenId)
Allows the token owner to burn their DRT, if desired. This is an opt-out mechanism, enabling self-sovereign revocation.

```solidity
function burn(uint256 tokenId) external;
```
Only the token owner may burn their own soulbound token.

🧱 Metadata Structure
Each token points to a full metadata URI, which can be hosted on:

IPFS

Arweave

Filecoin (via NFT.storage)

Example Metadata:

```json
{
  "name": "DRT:0001 – DeltaVerse Creator",
  "description": "Granted to those who forged the foundations of the DeltaVerse Engine.",
  "image": "ipfs://QmGenesisCog",
  "attributes": [
    { "trait_type": "Rank", "value": "Prime Architect" },
    { "trait_type": "Soulbound", "value": "True" },
    { "trait_type": "Access", "value": "DeltaRoom Creation" }
  ]
}
```
🧩 Use Cases in the DeltaVerse
Token ID	Role in Protocol	Privilege
DRT:0001	Creator	Unlocks AI DeltaRoom Genesis UI
DRT:0002	Tone Bender	Shift room moods via interface
DRT:0003	Vault Architect	Upload Lit-locked vault rooms
DRT:0004+	Participant	Access to signal forks, story branches

These tokens can be queried by AI to trigger behavior, change visual thematics, or personalize room drift mechanics.

🚫 Why Soulbound?
In the DeltaVerse, identity is earned, not bought.
DRTs embody:

Proven contribution

Immutable recognition

On-chain narrative fingerprints

This breaks the mercantile mold of Web3 — forging a new cryptosocial mythos of meaning.

✨ Burning a DRT
Burning is:

Optional

Self-performed

Symbolic (e.g., a character death or narrative reset)

Burning clears the participant’s semantic signature from the chain.

🛠 Integration Guide
Deploy DeltaGenesisSBT

Upload metadata JSON to IPFS

Mint via CLI script:

```ts
await contract.mintGenesis("0xRecipient", "ipfs://QmGenesis");
```
Visualize in UI using tokenURI

Query role attributes for frontend variation or AI logic

🔮 Part of the DeltaVerse Engine
This is not an NFT collection.

This is a ritual system for honoring those who shape the story.

Combined with:

BubbleRoomV4 → Space

DeltaRoomViewer.jsx → Interface

deltaRoomEngine.ts → AI agent logic

The DeltaGenesisSBT contract acts as the soul layer.

"To mint is to remember. To bind is to become."

© DeltaV THRUST 2025 – https://deltavthrust.com
