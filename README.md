# 🧠 DeltaRoomViewer

**DeltaRoomViewer.jsx** is a React component designed to visualize and interact with a DeltaRoom NFT from the DeltaVerse protocol, powered by the `BubbleRoomV4` smart contract.

It enables:

- Live viewing of DeltaRoom AI metadata (`ai_seed`, `tone`, `evolves`)
- Participant list rendering
- Optional access to narrative logs (IPFS-hosted)
- Vault decryption access (via Lit Protocol – stubbed)

## 🧬 Props

```jsx
<DeltaRoomViewer
  roomId={1}
  provider={ethersProvider} // Injected by Metamask/Web3Modal/etc
/>
```
🧾 Required Contracts
BubbleRoomV4 deployed and ABI available

IPFS hash stored in room metadata pointing to narrative logs

💡 Future Features
Vault content rendering (Lit Protocol encrypted blobs)

AI reactivity layer: user interaction causes live tone shift

Visual orb avatar interface for DeltaRoom mood

📁 Files
DeltaRoomViewer.jsx

DeltaRoomViewer.css

abi4.json – ABI for BubbleRoomV4

🛠 Install
```bash
npm install ethers lit-js-sdk
```
🧠 Professor Codephreak was here
