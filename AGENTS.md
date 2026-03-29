# AGENTS.md
## Canonical Agent Guide for DeltaVerse

---

## Agent Hierarchy

```
                    ┌─────────────────┐
                    │   MASTERMIND    │
                    │  (First Rank)   │
                    └────────┬────────┘
                             │ assigns roles, resolves conflicts
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
        ┌──────────┐   ┌──────────┐   ┌──────────┐
        │  Kairos  │   │ Chronos  │   │  Builder │
        │ "WHEN"   │   │ "HOW     │   │ "WHAT"   │
        │  to act  │   │  LONG"   │   │  to build│
        └──────────┘   └──────────┘   └──────────┘
              │              │              │
              └──────────────┼──────────────┘
                             │ all report trait changes
                    ┌────────▼────────┐
                    │   DeltaVerse    │
                    │  (Integration)  │
                    └─────────────────┘
```

## Active Agents

| Agent | File | Role | Seed Tone | Wisdom |
|-------|------|------|-----------|--------|
| DeltaVerse | `DeltaVerse.agent` | Architectural vision: funAGI + RAGE + MASTERMIND | Visionary | TRANSCENDENT |
| Builder | `builder.agent` | Infrastructure, identity, deployment, trait monitoring | Resolute | CONVERGENT |
| Chronos | `Chronos.agent` | Sequential time, sustained operations, Spawn cadence | Disciplined | CONVERGENT |
| Kairos | `Kairos.agent` | Opportune moment recognition, Convergence detection | Electric | CONVERGENT |

## DeltaVerse Terminology

| Term | Definition |
|------|-----------|
| **Origin** | Source room from which a Spawn occurs |
| **Emergence** | Room that Spawns from an Origin |
| **Lineage** | Chain of Origins leading to current Emergence |
| **Spawn** | Action creating an Emergence from an Origin |
| **Seed** | Generative DNA prompt inherited through Lineage |
| **Mutation** | Semantic shift applied to Seed during Spawn |
| **Swarm** | Collective of participants within a room |
| **Consensus** | Agreement measured across the Swarm |
| **Convergence** | Seed composed from two-room Interaction |
| **Wisdom** | Class earned through Lineage depth + Consensus |

## Rank System

- **MASTERMIND** — First creator rank. All other roles are assigned from MASTERMIND
- **Architect** — Role assigned by MASTERMIND for system design
- **Engineer** — Role assigned by MASTERMIND for implementation
- **Agent** — Autonomous operational role within BubbleRooms
- **Member** — Participant role within BubbleRooms

## Emergence Traits

Traits emerge through Lineage. They are never assigned.

| Trait | Meaning | Primary Agent |
|-------|---------|---------------|
| **Intelligence** | Pattern recognition across interactions | Kairos (85) |
| **Knowledge** | Accumulated from Lineage depth + Consensus | Chronos (80) |
| **Wisdom** | NASCENT → EMERGENT → CONVERGENT → TRANSCENDENT → ORACLE | MASTERMIND (ORACLE) |
| **Resonance** | How strongly the Seed influences other Seeds | MASTERMIND (100) |
| **Adaptability** | Mutation success rate across Spawns | Kairos (90) |
| **Coherence** | Consistency of tone across Lineage | Chronos (95) |

## Smart Contracts (9)

| Contract | File | Purpose |
|----------|------|---------|
| BubbleRoomV4 | `contracts/BubbleRoomV4.sol` | ERC-721 rooms, 10 types, AI metadata, role access |
| DeltaGenesisSBT | `contracts/DeltaGenesisSBT.sol` | Soulbound identity tokens (MASTERMIND rank) |
| DeltaVerseOrchestrator | `contracts/DeltaVerseOrchestrator.sol` | EIP-712 gasless signature-based minting |
| BubbleRoomSpawn | `contracts/BubbleRoomSpawn.sol` | Spawn, Interaction, Lineage, Swarm Consensus |
| EmergenceTraits | `contracts/EmergenceTraits.sol` | On-chain trait accrual (6 traits) |
| SeedRegistry | `contracts/SeedRegistry.sol` | Agent Seed propagation with ancestry |
| SwarmGovernance | `contracts/SwarmGovernance.sol` | Typed proposals, timed voting, consensus→traits |
| TombRegistry | `contracts/TombRegistry.sol` | Programmable encrypted vaults with oracle consent |

## Inter-Agent Signal Protocol

```yaml
MASTERMIND → Builder:  DEPLOY, UPDATE, MAP
MASTERMIND → Kairos:   SCAN, ASSESS
Kairos → Chronos:      WINDOW, MISSED
Kairos → Builder:      LAUNCH, SPAWN_NOW
Chronos → Kairos:      SURPLUS, CONVERGENCE, PLATEAU
Chronos → Builder:     MAINTAIN, COMPOUND
All → DeltaVerse:      TRAIT_CHANGE, SEED_MUTATION, CONSENSUS
```

## Frontend

- React + Vite + TypeScript (~464KB production build)
- MetaMask integration via ethers.js v6
- EIP-712 draft signing (gasless room creation)
- Agent Seed system with 5 founding seeds and trait visualization
- Spawn and Interaction views for inter-room operations

## Deployment

- Domain: `deltaverse.dao` (Unstoppable Domains)
- Storage: IPFS (10MB budget, current usage ~4.6%)
- Controller: `DeltaVerseDAO/deltaversecontroller` (multisig)
- Current hash: `QmTPjokgXv7MQXh6qXzgagDrw2Buqsr52YhttKrn3smrHr`

## GitHub Organizations

1. **deltav-deltaverse** — Core platform (~90 repos)
2. **deltabridge** — Cross-chain bridges (~90+ repos)
3. **deltastorage** — IPFS, Zilliqa, domains (~55 repos)
4. **deltaloans** — DeFi lending, flash loans (~45 repos)
5. **DeltaVD** — 3D visualization, WebGL, Unity (~80 repos)
6. **DeltaVerseDAO** — DAO governance, multisig (~70 repos)

## Development Workflow

```bash
npm install        # Install dependencies
npm run dev        # Development server
npm run compile    # Compile smart contracts
npm run build      # Build for IPFS deployment
```

## Audit Status

Last audit: 2026-03-28. See `AUDIT.md` for full findings.

| Agent | Classification | Key Improvement |
|-------|---------------|-----------------|
| DeltaVerse.agent | MODERATE → RESOLVED | Added BubbleRoom protocol, Seed propagation, Trait hierarchy, inter-agent signals |
| Chronos.agent | MINOR → RESOLVED | Added temporal mechanics for rooms, Spawn cadence, trait mapping |
| Kairos.agent | MINOR → RESOLVED | Added kairotic triggers for Spawn/Convergence, Swarm timing |
| builder.agent | MINOR → RESOLVED | Added NeuralNode deployment pipeline, trait monitoring |
