# DeltaVerse

DeltaVerse (c) PYTHAI

Decentralised Cryptoverse MetaDAO — AI-reactive BubbleRooms powered by NeuralNode.

## What This Is

DeltaVerse is a decentralized, AI-symbiotic metaverse architecture. BubbleRooms are living semantic NFTs that evolve through Seed propagation, Swarm Consensus, and emergent trait accrual.

This is not a static virtual world. Rooms Spawn Emergences, Seeds mutate through Lineage, and Intelligence, Knowledge, and Wisdom accrue on-chain through participation.

## Contracts (Foundry / Solidity 0.8.24)

| Contract | Purpose |
|----------|---------|
| `BubbleRoomV4` | ERC-721 rooms — 10 types, AI metadata (aiSeed, tone, evolves), role-based access |
| `DeltaGenesisSBT` | Soulbound identity tokens — MASTERMIND rank, non-transferable |
| `DeltaVerseOrchestrator` | EIP-712 gasless signature-based minting |
| `BubbleRoomSpawn` | Origin→Emergence spawn, room Interaction, Lineage tracking |
| `EmergenceTraits` | On-chain trait accrual — Intelligence, Knowledge, Wisdom, Resonance, Adaptability, Coherence |
| `SeedRegistry` | Agent Seed propagation — genesis, spawn, mutate, lineage ancestry |
| `SwarmGovernance` | Typed proposals (SPAWN/MUTATE/INTERACT/GOVERN/CUSTOM), timed voting, consensus→trait feedback |
| `TombRegistry` | Programmable encrypted vaults — TOMB/CHEST/SAFETYDEPOSITBOX/TREASURE/SECRET/CUSTOM with oracle consent |

## Frontend (React + Vite + TypeScript)

| View | Function |
|------|----------|
| Explore | View BubbleRoom AI metadata by ID |
| Create | EIP-712 gasless draft signing |
| Spawn | Origin→Emergence with Agent Seed injection |
| Interact | Room-to-room Convergence, composed seeds |
| Traits | SVG radar chart + trait bars + Lineage tree visualization |
| Seeds | Browse, create, spawn, and inspect Seeds with ancestry chains |
| Govern | Typed proposals, FOR/AGAINST voting, deadline resolution |
| Vaults | Create/manage encrypted vaults with oracle consent (dyne.org/tomb) |
| Vision | All 8 minted NFTs as .prompt with blockchain verify links |
| Agents | 6 founding agent seeds with trait visualization |

MetaMask integration via ethers.js v6. Production build: **516KB** (5.1% of 10MB IPFS budget).

## Agent System

| Agent | Seed Tone | Wisdom | Role |
|-------|-----------|--------|------|
| MASTERMIND | Commanding | ORACLE | First rank, assigns all roles |
| DELTAVERSE | Visionary | TRANSCENDENT | funAGI + RAGE + MASTERMIND integration |
| CHRONOS | Disciplined | CONVERGENT | Sustained operations, Spawn cadence |
| KAIROS | Electric | CONVERGENT | Opportune moment recognition, Convergence detection |
| BUILDER | Resolute | CONVERGENT | Infrastructure, deployment, trait monitoring |

## DeltaVerse Terminology

| Term | Definition |
|------|-----------|
| Origin | Source room from which a Spawn occurs |
| Emergence | Room that Spawns from an Origin |
| Lineage | Chain of Origins leading to current Emergence |
| Spawn | Action creating an Emergence from an Origin |
| Seed | Generative DNA prompt inherited through Lineage |
| Mutation | Semantic shift applied to Seed during Spawn |
| Swarm | Collective of participants within a room |
| Consensus | Agreement measured across the Swarm |
| Convergence | Seed composed from two-room Interaction |
| Wisdom | Class earned through Lineage depth + Consensus |

## Vault System (dyne.org/tomb)

Programmable encrypted volumes with oracle consent and key separation.

| Class | Tradeable | Use |
|-------|-----------|-----|
| TOMB | Soulbound | Permanent archive, locked to room |
| CHEST | Free | Portable container between rooms |
| SAFETYDEPOSITBOX | Conditional | Oracle consent required to transfer |
| TREASURE | Discoverable | Found by meeting trait conditions |
| SECRET | After reveal | Hidden until unlocked |
| CUSTOM | User-defined | Any name (Pandora's Box, etc.) |

Oracles: TIME, IDENTITY, SWARM, CONDITION — all must be satisfied (AND logic).

## Tests (44/44 pass)

- 17 unit tests — all contracts
- 9 fuzz tests — 256 runs each
- 4 invariant tests — 128,000 calls each
- 14 tomb/vault tests — all classes, oracles, transfers

```bash
forge test -vv
```

## Quick Start

```bash
# Install
npm install

# Compile contracts
forge build

# Run tests
forge test -vv

# Dev server
npm run dev

# Build for IPFS
npm run build
```

## Deploy

```bash
forge script script/Deploy.s.sol --rpc-url $RPC_URL --private-key $PRIVATE_KEY --broadcast
```

Registers all 5 founding agent seeds on deployment.

## Deployment Target

- Domain: `deltaverse.dao` via Unstoppable Domains
- Storage: IPFS (10MB budget)
- Controller: `DeltaVerseDAO/deltaversecontroller` (multisig)
- THRUST Token: `0x969F60Bfe17962E0f061B434596545C7b6Cd6Fc4`

## Ecosystem

- [deltav-deltaverse](https://github.com/deltav-deltaverse) — Core platform
- [deltabridge](https://github.com/deltabridge) — Cross-chain bridges
- [deltastorage](https://github.com/deltastorage) — IPFS, Zilliqa, domains
- [deltaloans](https://github.com/deltaloans) — DeFi lending
- [DeltaVD](https://github.com/DeltaVD) — 3D visualization
- [DeltaVerseDAO](https://github.com/DeltaVerseDAO) — Governance

## License

MIT

---

*Professor Codephreak (Gregory L) — MASTERMIND*
*DeltaV THRUST 2025*
*https://deltavthrust.com*
