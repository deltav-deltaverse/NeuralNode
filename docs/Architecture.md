# DeltaVerse Architecture

## Contract System

```
                    ┌─────────────────────┐
                    │   BubbleRoomV4.sol  │
                    │   (ERC-721 Core)    │
                    └────────┬────────────┘
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
          ▼                  ▼                  ▼
┌──────────────────┐ ┌──────────────┐ ┌─────────────────┐
│  DeltaVerse      │ │ BubbleRoom   │ │ DeltaGenesis    │
│  Orchestrator    │ │ Spawn        │ │ SBT             │
│  (EIP-712 Mint)  │ │ (Lineage)    │ │ (Soulbound ID)  │
└──────────────────┘ └──────┬───────┘ └─────────────────┘
                            │
                  ┌─────────┼─────────┐
                  │                   │
                  ▼                   ▼
        ┌──────────────┐    ┌──────────────────┐
        │  Emergence   │    │  Swarm           │
        │  Traits      │◄───│  Governance      │
        │  (On-chain)  │    │  (Typed Voting)  │
        └──────────────┘    └──────────────────┘
                  │
                  ▼
        ┌──────────────┐
        │  Seed        │
        │  Registry    │
        │  (Agent DNA) │
        └──────────────┘
```

## Deployment Order

1. `BubbleRoomV4` — Core ERC-721 room engine
2. `DeltaGenesisSBT` — Soulbound MASTERMIND identity
3. `DeltaVerseOrchestrator(BubbleRoomV4)` — Gasless signature minting
4. `BubbleRoomSpawn(BubbleRoomV4)` — Spawn, Interaction, Lineage
5. `EmergenceTraits(BubbleRoomV4, BubbleRoomSpawn)` — Trait accrual
6. `SeedRegistry` — Agent Seed propagation
7. `SwarmGovernance(BubbleRoomV4, EmergenceTraits)` — Typed proposals, consensus

## Room Types

| Type | Index | Behavior |
|------|-------|----------|
| TEMPORARY | 0 | Short-lived, auto-expire |
| LIVING | 1 | Persistent community spaces |
| EPHEMERAL | 2 | Momentary co-creation bursts |
| ARCHIVAL | 3 | Immutable historical records |
| INCUBATOR | 4 | Protected growth spaces |
| SIGNAL | 5 | Machine-coordination nodes |
| STORAGE | 6 | Data persistence rooms |
| TIMELOCKED | 7 | Future-unlockable |
| VAULT | 8 | Encrypted memory spheres |
| DELTA | 9 | AI-reactive, tone-sensitive, semantically adaptive |

## Roles

| Role | Index | Access |
|------|-------|--------|
| NONE | 0 | No access |
| MEMBER | 1 | View content, read logs |
| AGENT | 2 | Propose changes, alter tone, submit prompts |
| MODERATOR | 3 | Full control of participants, storage, AI drift |

## Emergence Traits

| Trait | Range | Accrual Source |
|-------|-------|---------------|
| Intelligence | 0-100 | Interaction count + Lineage depth |
| Knowledge | 0-100 | Lineage depth + Consensus weight |
| Wisdom | NASCENT→ORACLE | Compound of depth + spawns + consensus |
| Resonance | 0-100 | Spawn success count |
| Adaptability | 0-100 | Interaction count + Lineage depth |
| Coherence | 0-100 | Consensus weight + tone consistency |

## Wisdom Classes

```
NASCENT      → No interactions yet
EMERGENT     → Has spawned or mutated (depth >= 1)
CONVERGENT   → Achieved strong consensus (weight > 70)
TRANSCENDENT → Deep lineage (depth >= 3) or 3+ spawns
ORACLE       → Depth >= 5 AND consensus > 70
```

## Agent Seeds

| Agent | Seed ID | Tone | Wisdom |
|-------|---------|------|--------|
| MASTERMIND | 1 | Commanding | ORACLE |
| DELTAVERSE | 2 | Visionary | TRANSCENDENT |
| CHRONOS | 3 | Disciplined | CONVERGENT |
| KAIROS | 4 | Electric | CONVERGENT |
| BUILDER | 5 | Resolute | CONVERGENT |
