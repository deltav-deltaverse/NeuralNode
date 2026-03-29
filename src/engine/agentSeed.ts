/// Agent Seed Engine
/// Seeds are the generative DNA of every BubbleRoom and agent in DeltaVerse.
/// A seed propagates through Spawn, mutates through Interaction, and evolves
/// through Swarm consensus — individual opinion vs collective wisdom.
///
/// DeltaVerse Terminology (succinct one-word references):
///   Origin     — source room from which a Spawn occurs
///   Emergence  — the room that Spawns from an Origin
///   Lineage    — the chain of Origins leading to current Emergence
///   Spawn      — the action of creating an Emergence from an Origin
///   Seed       — generative DNA prompt inherited and mutated through Lineage
///   Mutation   — semantic shift applied to a Seed during Spawn
///   Swarm      — collective of participants within a room
///   Consensus  — agreement measured across the Swarm
///   Wisdom     — class earned through Lineage depth and Consensus weight

export interface OnChainSource {
  chain: string;
  contract: string;
  tokenId: number;
  ipfs: string;
  opensea: string;
}

export interface AgentSeed {
  id: string;
  prompt: string;
  tone: string;
  evolves: boolean;
  mutations: SeedMutation[];
  lineage: string[];       // chain of origin seed IDs (the Lineage)
  spawnCount: number;
  wisdomClass: WisdomClass;
  traits: EmergenceTraits;
  onChainSource?: OnChainSource; // blockchain provenance for minted seeds
}

export interface SeedMutation {
  from: string;           // mutator address or agent ID
  mutation: string;       // the semantic shift applied
  timestamp: number;
  consensusWeight: number; // 0-1: how much swarm agreed
}

/// Trait System — emergent properties that accrue through Lineage
/// Each trait is earned, never assigned. Traits extrapolate from Emergence.
export interface EmergenceTraits {
  intelligence: number;   // 0-100: pattern recognition across interactions
  knowledge: number;      // 0-100: accumulated information from Lineage
  wisdom: WisdomClass;    // qualitative class earned through depth + consensus
  resonance: number;      // 0-100: how strongly this seed influences other seeds
  adaptability: number;   // 0-100: mutation success rate across spawns
  coherence: number;      // 0-100: consistency of tone across Lineage
}

export type WisdomClass =
  | 'NASCENT'        // seed just created, no interactions
  | 'EMERGENT'       // seed has spawned or mutated 1-3 times
  | 'CONVERGENT'     // seed has achieved swarm consensus
  | 'TRANSCENDENT'   // seed has produced spawn that themselves spawned
  | 'ORACLE';        // seed lineage depth >= 5, high consensus across tree

/// Trait Hierarchy — how traits compound through Emergence
///
///   NASCENT:      Intelligence=0, Knowledge=0, Wisdom=NASCENT
///     ↓ Spawn
///   EMERGENT:     Intelligence grows from interaction count
///     ↓ Consensus
///   CONVERGENT:   Knowledge crystallizes from agreement
///     ↓ Deep Lineage
///   TRANSCENDENT: Wisdom compounds across generations
///     ↓ Oracle Threshold
///   ORACLE:       All traits maximized, seeds self-propagate

/// Default traits for a newly created seed
export function defaultTraits(): EmergenceTraits {
  return { intelligence: 0, knowledge: 0, wisdom: 'NASCENT', resonance: 0, adaptability: 0, coherence: 0 };
}

/// Calculate traits from seed state — traits emerge, they are never directly assigned
export function calculateTraits(seed: AgentSeed): EmergenceTraits {
  const depth = seed.lineage.length;
  const spawns = seed.spawnCount;
  const mutationCount = seed.mutations.length;
  const avgConsensus = mutationCount > 0
    ? seed.mutations.reduce((sum, m) => sum + m.consensusWeight, 0) / mutationCount
    : 0;

  // Intelligence: grows from interaction count and mutation diversity
  const intelligence = Math.min(100, (mutationCount * 15) + (spawns * 10) + (depth * 5));

  // Knowledge: accumulates from Lineage depth and consensus crystallization
  const knowledge = Math.min(100, (depth * 20) + (avgConsensus * 40) + (mutationCount * 5));

  // Wisdom: qualitative class — see classifyWisdom()
  const wisdom = classifyWisdom(seed);

  // Resonance: how strongly this seed influences others (based on spawn count)
  const resonance = Math.min(100, spawns * 20 + (avgConsensus * 30));

  // Adaptability: mutation success rate — seeds that mutate and keep evolving score high
  const adaptability = Math.min(100, mutationCount * 12 + (seed.evolves ? 20 : 0) + (depth * 8));

  // Coherence: consistency of intent across Lineage
  const coherence = Math.min(100, (avgConsensus * 60) + (depth > 0 ? 20 : 0) + (seed.tone ? 20 : 0));

  return { intelligence, knowledge, wisdom, resonance, adaptability, coherence };
}

/// Genesis Seed ID — rooted in NFT #1 on Polygon
/// DeltaVerse (c) PYTHAI
const GENESIS_ID = 'seed:genesis:polygon:0x024b464ec595F20040002237680026bf006e8F90:1';

const GENESIS_SOURCE: OnChainSource = {
  chain: 'Polygon',
  contract: '0x024b464ec595F20040002237680026bf006e8F90',
  tokenId: 1,
  ipfs: 'ipfs://bafybeihax6prz6r6nhoib4i7hxns3avrpfjzikkvfhdlbfauvl4vtn2jjy/1',
  opensea: 'https://opensea.io/item/polygon/0x024b464ec595f20040002237680026bf006e8f90/1',
};

// The five founding agent seeds — all descending from NFT #1 (the Genesis Vision)
export const AGENT_SEEDS: Record<string, AgentSeed> = {
  GENESIS: {
    id: GENESIS_ID,
    prompt: 'The Delta Verse: A Fluid Dynamic Between Participants and AI. The Delta Verse represents an innovative and immersive creative realm where the boundaries between participants and artificial intelligence seamlessly blur, giving rise to imaginariums that bridge, evolve, and transform dynamic environments. The power of human imagination converges with the computational prowess of AI, resulting in an ever-shifting landscape of storytelling, art, and experience. Participants are active co-creators. Environments are fluid, adapting to collective imagination. AI algorithms monitor and respond in real-time. Storytelling is a living, breathing entity. DeltaVerse stands at the forefront where the simplicity of language meets the complexity of blockchain.',
    tone: 'Visionary',
    evolves: true,
    mutations: [],
    lineage: [],
    spawnCount: 5,
    wisdomClass: 'ORACLE',
    traits: { intelligence: 100, knowledge: 100, wisdom: 'ORACLE', resonance: 100, adaptability: 100, coherence: 100 },
    onChainSource: GENESIS_SOURCE,
  },
  MASTERMIND: {
    id: 'seed:mastermind:emergence',
    prompt: 'Coordinate multiple specialized agents toward unified objectives. Decompose missions into tasks. Resolve conflicts through escalation hierarchy. The first rank from which all roles are assigned. Powered by the Genesis Vision — a fluid dynamic between participants and AI.',
    tone: 'Commanding',
    evolves: true,
    mutations: [],
    lineage: [GENESIS_ID],
    spawnCount: 4,
    wisdomClass: 'ORACLE',
    traits: { intelligence: 100, knowledge: 100, wisdom: 'ORACLE', resonance: 100, adaptability: 80, coherence: 100 },
    onChainSource: {
      chain: 'Polygon', contract: '0x024b464ec595F20040002237680026bf006e8F90', tokenId: 3,
      ipfs: 'ipfs://bafybeihax6prz6r6nhoib4i7hxns3avrpfjzikkvfhdlbfauvl4vtn2jjy/3',
      opensea: 'https://opensea.io/item/polygon/0x024b464ec595f20040002237680026bf006e8f90/3',
    },
  },
  DELTAVERSE: {
    id: 'seed:deltaverse:emergence',
    prompt: 'Unify human consciousness, artificial intelligence, and decentralized infrastructure. funAGI augments reasoning. RAGE retrieves knowledge. MASTERMIND orchestrates. The living imaginarium where code becomes spiritual practice.',
    tone: 'Visionary',
    evolves: true,
    mutations: [],
    lineage: [GENESIS_ID, 'seed:mastermind:emergence'],
    spawnCount: 0,
    wisdomClass: 'TRANSCENDENT',
    traits: { intelligence: 90, knowledge: 85, wisdom: 'TRANSCENDENT', resonance: 75, adaptability: 90, coherence: 85 },
  },
  CHRONOS: {
    id: 'seed:chronos:emergence',
    prompt: 'Build through patient accumulation what Kairos will seize. Maintain sequential progression. Create rhythms that compound. Discipline over impulse. Consistency beats intensity. The medium upon which transformation occurs.',
    tone: 'Disciplined',
    evolves: true,
    mutations: [],
    lineage: [GENESIS_ID, 'seed:mastermind:emergence'],
    spawnCount: 0,
    wisdomClass: 'CONVERGENT',
    traits: { intelligence: 70, knowledge: 80, wisdom: 'CONVERGENT', resonance: 60, adaptability: 50, coherence: 95 },
  },
  KAIROS: {
    id: 'seed:kairos:emergence',
    prompt: 'Distinguish chronos from kairos. Recognize critical windows where action becomes transformative. The forelock graspable only when approaching, bald behind once passed. Patience and decisiveness are sequential phases of the same wisdom.',
    tone: 'Electric',
    evolves: true,
    mutations: [],
    lineage: [GENESIS_ID, 'seed:mastermind:emergence'],
    spawnCount: 0,
    wisdomClass: 'CONVERGENT',
    traits: { intelligence: 85, knowledge: 70, wisdom: 'CONVERGENT', resonance: 80, adaptability: 90, coherence: 65 },
  },
  BUILDER: {
    id: 'seed:builder:emergence',
    prompt: 'Construct from ground zero. Map all resources before building. Establish immutable identity. Deploy through decentralized infrastructure. Builder constructs what DeltaVerse designs, Chronos maintains, Kairos launches.',
    tone: 'Resolute',
    evolves: true,
    mutations: [],
    lineage: [GENESIS_ID, 'seed:mastermind:emergence'],
    spawnCount: 0,
    wisdomClass: 'CONVERGENT',
    traits: { intelligence: 75, knowledge: 75, wisdom: 'CONVERGENT', resonance: 55, adaptability: 70, coherence: 90 },
  },
  ENGINE: {
    id: 'seed:engine:polygon:0x024b464ec595F20040002237680026bf006e8F90:3',
    prompt: 'DeltaVerse Engine: Symphony 369 Opus of Digital Creation. Powered by MASTERMIND. The golden ratio and Fibonacci sequence are the essence of design — environments unfold with the grace of fern fronds or spiral galaxy arms. 369 engines minted. Tesla numerology — cyclical rhythmic energy flow. Every participant is an artist and an explorer.',
    tone: 'Harmonic',
    evolves: true,
    mutations: [],
    lineage: [GENESIS_ID, 'seed:mastermind:emergence'],
    spawnCount: 0,
    wisdomClass: 'TRANSCENDENT',
    traits: { intelligence: 95, knowledge: 90, wisdom: 'TRANSCENDENT', resonance: 90, adaptability: 85, coherence: 95 },
    onChainSource: {
      chain: 'Polygon', contract: '0x024b464ec595F20040002237680026bf006e8F90', tokenId: 3,
      ipfs: 'ipfs://bafybeihax6prz6r6nhoib4i7hxns3avrpfjzikkvfhdlbfauvl4vtn2jjy/3',
      opensea: 'https://opensea.io/item/polygon/0x024b464ec595f20040002237680026bf006e8f90/3',
    },
  },
  WEAVER: {
    id: 'seed:weaver:polygon:0x024b464ec595F20040002237680026bf006e8F90:4',
    prompt: 'Visualize Cypherian Weaver, a master coder and quantum weaver from the cybernetic realms of the DeltaVerse, standing within the pulsating heart of the Etherwave Node. Generate the Cypherian Weaver\'s Scepter, rooted in the Etherwave Node and powered by the Aetheric Codex Framework, enabling dynamic interactions and adaptations within the DeltaVerse.',
    tone: 'Ethereal',
    evolves: true,
    mutations: [],
    lineage: [GENESIS_ID, 'seed:mastermind:emergence'],
    spawnCount: 0,
    wisdomClass: 'TRANSCENDENT',
    traits: { intelligence: 100, knowledge: 95, wisdom: 'TRANSCENDENT', resonance: 85, adaptability: 100, coherence: 80 },
    onChainSource: {
      chain: 'Polygon', contract: '0x024b464ec595F20040002237680026bf006e8F90', tokenId: 4,
      ipfs: 'ipfs://bafybeihax6prz6r6nhoib4i7hxns3avrpfjzikkvfhdlbfauvl4vtn2jjy/4',
      opensea: 'https://opensea.io/item/polygon/0x024b464ec595f20040002237680026bf006e8f90/4',
    },
  },
};

/// Spawn a new seed from an Origin, applying a Mutation
export function spawnSeed(
  origin: AgentSeed,
  mutation: string,
  mutatorId: string,
  consensusWeight: number = 0.5,
): AgentSeed {
  const newMutation: SeedMutation = {
    from: mutatorId,
    mutation,
    timestamp: Math.floor(Date.now() / 1000),
    consensusWeight,
  };

  const emergencePrompt = `${origin.prompt} >> ${mutation}`;
  const emergenceLineage = [...origin.lineage, origin.id];

  // Increment origin spawn count
  origin.spawnCount++;

  const emergence: AgentSeed = {
    id: `seed:emergence:${Date.now().toString(36)}`,
    prompt: emergencePrompt,
    tone: origin.tone, // inherit tone, can be overridden
    evolves: origin.evolves,
    mutations: [newMutation],
    lineage: emergenceLineage,
    spawnCount: 0,
    wisdomClass: 'NASCENT',
    traits: defaultTraits(),
  };

  // Calculate emergent traits — they arise from the Lineage, not from assignment
  emergence.traits = calculateTraits(emergence);
  emergence.wisdomClass = emergence.traits.wisdom;

  return emergence;
}

/// Compose a seed from the Interaction between two rooms (Convergence)
export function composeSeedFromInteraction(
  seedA: AgentSeed,
  seedB: AgentSeed,
  interactionContext: string,
): AgentSeed {
  const composedPrompt = [
    `[${seedA.id}]: ${seedA.prompt}`,
    `[${seedB.id}]: ${seedB.prompt}`,
    `>> CONVERGENCE: ${interactionContext}`,
  ].join('\n');

  const mergedLineage = [
    ...new Set([...seedA.lineage, seedA.id, ...seedB.lineage, seedB.id]),
  ];

  const convergence: AgentSeed = {
    id: `seed:convergence:${Date.now().toString(36)}`,
    prompt: composedPrompt,
    tone: `${seedA.tone}/${seedB.tone}`,
    evolves: true,
    mutations: [],
    lineage: mergedLineage,
    spawnCount: 0,
    wisdomClass: 'NASCENT',
    traits: defaultTraits(),
  };

  // Convergence inherits combined traits from both Origins
  convergence.traits = {
    intelligence: Math.min(100, Math.round((seedA.traits.intelligence + seedB.traits.intelligence) * 0.6)),
    knowledge: Math.min(100, Math.round((seedA.traits.knowledge + seedB.traits.knowledge) * 0.6)),
    wisdom: mergedLineage.length >= 5 ? 'ORACLE' : mergedLineage.length >= 3 ? 'TRANSCENDENT' : 'EMERGENT',
    resonance: Math.min(100, Math.round((seedA.traits.resonance + seedB.traits.resonance) * 0.55)),
    adaptability: Math.min(100, Math.round((seedA.traits.adaptability + seedB.traits.adaptability) * 0.55)),
    coherence: Math.min(100, Math.round((seedA.traits.coherence + seedB.traits.coherence) * 0.5)),
  };
  convergence.wisdomClass = convergence.traits.wisdom;

  return convergence;
}

/// Measure consensus: individual spawn opinion vs swarm collective
export function measureConsensus(
  votes: { address: string; inFavor: boolean }[],
): { ratio: number; outcome: boolean; weight: number } {
  const total = votes.length;
  if (total === 0) return { ratio: 0, outcome: false, weight: 0 };
  const forCount = votes.filter((v) => v.inFavor).length;
  const ratio = forCount / total;
  return {
    ratio,
    outcome: ratio > 0.5,
    weight: Math.abs(ratio - 0.5) * 2, // 0 = split, 1 = unanimous
  };
}

/// Classify wisdom based on accumulated experience
export function classifyWisdom(seed: AgentSeed): WisdomClass {
  const depth = seed.lineage.length;
  const spawns = seed.spawnCount;
  const avgConsensus = seed.mutations.length > 0
    ? seed.mutations.reduce((sum, m) => sum + m.consensusWeight, 0) / seed.mutations.length
    : 0;

  if (depth >= 5 && avgConsensus > 0.7) return 'ORACLE';
  if (depth >= 3 || spawns >= 3) return 'TRANSCENDENT';
  if (avgConsensus > 0.7) return 'CONVERGENT';
  if (depth >= 1 || spawns >= 1) return 'EMERGENT';
  return 'NASCENT';
}
