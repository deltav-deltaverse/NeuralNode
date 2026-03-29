# DeltaVerse Architecture

## DeltaVerse (c) PYTHAI

## Contract System

```
                    ┌─────────────────────┐
                    │   BubbleRoomV4.sol  │
                    │   (ERC-721 Core)    │
                    └────────┬────────────┘
                             │
      ┌──────────────────────┼──────────────────────┐
      │                      │                      │
      ▼                      ▼                      ▼
┌────────────────┐  ┌──────────────┐  ┌─────────────────┐
│  DeltaVerse    │  │ BubbleRoom   │  │ DeltaGenesis    │
│  Orchestrator  │  │ Spawn        │  │ SBT             │
│  (EIP-712)     │  │ (Lineage)    │  │ (Soulbound ID)  │
└────────────────┘  └──────┬───────┘  └─────────────────┘
                           │
                ┌──────────┼──────────┐
                │          │          │
                ▼          ▼          ▼
      ┌────────────┐ ┌──────────┐ ┌──────────────┐
      │ Emergence  │ │  Swarm   │ │    Tomb      │
      │ Traits     │ │Governance│ │  Registry    │
      │ (On-chain) │ │ (Voting) │ │  (Vaults)   │
      └──────┬─────┘ └────┬─────┘ └──────┬───────┘
             │             │              │
             └─────────────┼──────────────┘
                           │
                  ┌────────▼────────┐
                  │  Seed Registry  │
                  │  (Agent DNA)    │
                  └─────────────────┘
```

## Deployment Order (9 contracts)

1. `BubbleRoomV4` — Core ERC-721 room engine
2. `DeltaGenesisSBT` — Soulbound MASTERMIND identity
3. `DeltaVerseOrchestrator(BubbleRoomV4)` — Gasless signature minting
4. `BubbleRoomSpawn(BubbleRoomV4)` — Spawn, Interaction, Lineage
5. `EmergenceTraits(BubbleRoomV4, BubbleRoomSpawn)` — Trait accrual
6. `SeedRegistry` — Agent Seed propagation (Genesis = NFT #1)
7. `SwarmGovernance(BubbleRoomV4, EmergenceTraits)` — Typed proposals, consensus
8. `TombRegistry(BubbleRoomV4, DeltaGenesisSBT, EmergenceTraits)` — Programmable encrypted vaults
9. Register 6 seeds: Genesis + MASTERMIND + DELTAVERSE + CHRONOS + KAIROS + BUILDER

## Genesis Provenance

NFT #1 on Polygon (`0x024b464ec595F20040002237680026bf006e8F90`, Token 1) is the root Origin.
All seeds descend from it. Verify: https://opensea.io/item/polygon/0x024b464ec595f20040002237680026bf006e8f90/1

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
| Wisdom | NASCENT-ORACLE | Compound of depth + spawns + consensus |
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

## Programmable Encrypted Vaults (TombRegistry)

Inspired by [dyne.org/tomb](https://dyne.org/tomb) — LUKS encrypted volumes with key separation.

### Vault Classes

| Class | Tradeable | Behavior |
|-------|-----------|----------|
| TOMB | No (soulbound) | Permanent archive, locked to room forever |
| CHEST | Yes (free) | Portable encrypted container, transfers freely |
| SAFETYDEPOSITBOX | Conditional | Requires all oracle consent to transfer |
| TREASURE | Discoverable | Found by participants meeting conditions |
| SECRET | After reveal | Hidden until unlocked, then transferable |
| CUSTOM | User-defined | Any custom name |

### Oracle Consent System

All oracles must be satisfied (AND logic) to unlock a vault.

| Oracle | Trigger | Source |
|--------|---------|--------|
| TIME | `block.timestamp >= unlockTime` | time.oracle |
| IDENTITY | Caller is required address or SBT holder | identity.oracle |
| SWARM | Governance proposal resolved favorably | SwarmGovernance |
| CONDITION | Room EmergenceTraits meet threshold | EmergenceTraits |

### Key Separation (Tomb Principle)

```
storageCID  → IPFS CID of encrypted LUKS volume (created with tomb)
keyCID      → IPFS CID of key file (stored in DIFFERENT room or off-chain)
keyRoomId   → Room where key lives (0 = self-custody)
```

### Vault Lifecycle

```
CREATE (sealed) → ADD ORACLES → EVALUATE CONSENT → UNLOCK → USE → SEAL (resets) → repeat
                                                                  → REVOKE (permanent)
                                                                  → TRANSFER (if class allows)
                                                                  → RECLASSIFY (creator only)
```

## Agent Seeds

All seeds descend from NFT #1 (Genesis Vision).

| Agent | Seed ID | Tone | Wisdom | On-chain Source |
|-------|---------|------|--------|-----------------|
| GENESIS | 1 | Visionary | ORACLE | Polygon 0x024b...8F90 Token 1 |
| MASTERMIND | 2 | Commanding | ORACLE | Polygon 0x024b...8F90 Token 3 |
| DELTAVERSE | 3 | Visionary | TRANSCENDENT | — |
| CHRONOS | 4 | Disciplined | CONVERGENT | — |
| KAIROS | 5 | Electric | CONVERGENT | — |
| BUILDER | 6 | Resolute | CONVERGENT | — |

## Frontend (12 Views, 516KB build)

| View | Purpose |
|------|---------|
| Home | Genesis vision from NFT #1, room type cards |
| Explore | Room lookup by ID with AI metadata |
| Create | EIP-712 gasless draft signing |
| Spawn | Origin→Emergence with Agent Seed injection |
| Interact | Room-to-room Convergence, composed seeds |
| Traits | SVG radar chart + trait bars + Lineage tree |
| Seeds | Browse, create, spawn seeds with ancestry chains |
| Govern | Typed proposals, FOR/AGAINST voting, resolve |
| Vaults | Create/inspect/unlock/seal/revoke encrypted vaults with oracles |
| Vision | All 8 minted NFTs as .prompt with blockchain verify links |
| Drafts | Local draft management, mint-to-chain |
| Agents | 6 founding seeds with trait visualization |

## Test Suite (44 tests)

| Suite | Tests | Type |
|-------|-------|------|
| DeltaVerse.t.sol | 17 | Unit |
| Fuzz.t.sol | 9 | Fuzz (256 runs each) |
| Invariant.t.sol | 4 | Invariant (128K calls each) |
| Tomb.t.sol | 14 | Tomb vault classes, oracles, transfers |

```bash
forge test -vv
```
