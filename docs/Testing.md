# DeltaVerse Test Suite

## Framework

Foundry (forge test)

## Test Files

### `test/DeltaVerse.t.sol` — 17 Unit Tests

| Test | Contract | What it verifies |
|------|----------|-----------------|
| test_MintRoom | BubbleRoomV4 | Room minting, AI metadata, participant list |
| test_MintRoom_RoleMismatchReverts | BubbleRoomV4 | Rejects mismatched participant/role arrays |
| test_MintGenesisSBT | DeltaGenesisSBT | SBT minting, ownership, claim flag |
| test_SBT_NonTransferable | DeltaGenesisSBT | Soulbound transfer prevention |
| test_SBT_DoubleClaim | DeltaGenesisSBT | Double-claim prevention |
| test_SpawnFromRoom | BubbleRoomSpawn | Spawn with composed seed, lineage tree, ownership transfer |
| test_SpawnFromRoom_NonParticipantReverts | BubbleRoomSpawn | Non-participant spawn rejection |
| test_GenesisSeed | SeedRegistry | Genesis seed creation, fields verification |
| test_SpawnSeed | SeedRegistry | Seed spawning, composed prompt, lineage depth |
| test_SeedMutation | SeedRegistry | Mutable seed prompt update |
| test_SeedMutation_NonEvolvableReverts | SeedRegistry | Non-evolvable mutation rejection |
| test_DeepLineage | SeedRegistry | 5-level spawn chain, ancestor traversal |
| test_CreateProposal | SwarmGovernance | Proposal creation with typed enum |
| test_VoteAndResolve | SwarmGovernance | Voting + auto-resolution at full participation |
| test_VoteDoubleVoteReverts | SwarmGovernance | Double-vote prevention |
| test_ResolveAfterDeadline | SwarmGovernance | Time-warped deadline resolution |
| test_TraitAccrual | EmergenceTraits | Interaction/spawn/consensus → trait increase |

### `test/Fuzz.t.sol` — 9 Fuzz Tests (256 runs each)

| Test | Fuzzed Inputs |
|------|---------------|
| testFuzz_MintRoom_AnyThemeAndSeed | string theme, string aiSeed, string tone |
| testFuzz_MintRoom_AllRoomTypes | uint8 roomType (mod 10) |
| testFuzz_MintRoom_MultipleParticipants | uint8 count (1-10) |
| testFuzz_MintGenesis_UniqueAddresses | address recipient |
| testFuzz_CreateAndSpawnSeed | string prompt, string mutation, string tone |
| testFuzz_SpawnChainDepth | uint8 depth (1-8) |
| testFuzz_TraitsBounded | uint8 interactions, uint8 spawns, uint16 weight |
| testFuzz_VotingPeriod | uint256 period (1h-30d) |
| testFuzz_VotingPeriod_OutOfRange_Reverts | uint256 period (out of range) |

### `test/Invariant.t.sol` — 4 Invariant Tests (128,000 calls each)

| Invariant | What it guarantees |
|-----------|--------------------|
| invariant_roomIdSequential | nextRoomId always >= totalRooms + 1 |
| invariant_seedIdSequential | nextSeedId always >= totalSeeds + 1 |
| invariant_traitsBounded | All traits remain 0-100, wisdom 0-4 |
| invariant_genesisOriginZero | First seed always has originSeedId == 0 |

### `test/Tomb.t.sol` — 14 Tomb/Vault Tests

| Test | What it verifies |
|------|-----------------|
| test_CreateTomb | TOMB class creation, soulbound, sealed state |
| test_CreateChest | CHEST class with custom name |
| test_CreateCustom | CUSTOM class requires name |
| test_CustomRequiresName | Revert if CUSTOM has no name |
| test_TimeOracle | Time-based consent, warp past unlock |
| test_IdentityOracle | Address-based consent, wrong caller fails |
| test_ConditionOracle | Trait threshold consent via EmergenceTraits |
| test_MultiOracle | AND logic: time + condition both required |
| test_TombSoulboundCannotTransfer | TOMB class rejects transfer |
| test_ChestCanTransfer | CHEST transfers between rooms |
| test_SecretRequiresReveal | SECRET must unlock before transfer |
| test_SealResetsConsent | Sealing resets all oracle consent |
| test_Reclassify | Change vault class and custom name |
| test_Revoke | Permanent revocation, cannot transfer after |

## Running Tests

```bash
forge test -vv                                  # All 44 tests
forge test --match-path test/DeltaVerse.t.sol   # Unit tests
forge test --match-path test/Fuzz.t.sol         # Fuzz tests
forge test --match-path test/Invariant.t.sol    # Invariant tests
forge test --match-path test/Tomb.t.sol         # Tomb/vault tests
forge snapshot                                  # Gas snapshots
```
