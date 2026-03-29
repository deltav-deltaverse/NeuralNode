/// Genesis Configuration — sourced from on-chain NFT metadata
/// DeltaVerse (c) PYTHAI
/// The iconic first DELTA VERSE concept minted on Polygon
/// https://polygonscan.com/token/0x024b464ec595f20040002237680026bf006e8f90

export interface MintedNFT {
  contract: string;
  tokenId: number;
  chain: string;
  chainId: number;
  name: string;
  description: string;
  ipfsMetadata: string;
  ipfsImage: string;
  traits: Record<string, string>;
  opensea: string;
  polygonscan: string;
  isGenesis?: boolean;
}

export const GENESIS_CONTRACT = '0x024b464ec595F20040002237680026bf006e8F90';
export const THRUST_CONTRACT = '0x67CF0dD25F023746BFAc6EDcd9D04ea77eB19129';
export const OWNER_ADDRESS = '0xbC62D5e6e3555438061a3D12b7Cd94AaBEe07346';
export const COPYRIGHT = 'DeltaVerse (c) PYTHAI';
export const POLYGONSCAN_BASE = 'https://polygonscan.com/token';
export const OPENSEA_BASE = 'https://opensea.io/item/polygon';
export const IPFS_GATEWAY = 'https://ipfs.io/ipfs';

export const GENESIS_DESCRIPTION = `The Delta Verse: A Fluid Dynamic Between Participants and AI

The Delta Verse represents an innovative and immersive creative realm where the boundaries between participants and artificial intelligence (AI) seamlessly blur, giving rise to imaginariums that bridge, evolve, and transform dynamic environments. In this visionary concept, the power of human imagination converges with the computational prowess of AI, resulting in an ever-shifting landscape of storytelling, art, and experience.

Seamless Bridging of Realities:

In the Delta Verse, the transition from reality to the imagined world is seamless. Participants are no longer passive consumers of content; they are active co-creators of their experiences. Through the integration of augmented and virtual reality technologies, participants can effortlessly step into the Delta Verse, where the physical and virtual realms merge. Whether you're exploring ancient civilizations or embarking on intergalactic journeys, the Delta Verse adapts to your desires and weaves your narrative into its ever-evolving tapestry.

Dynamic Environments in Flux:

At the heart of the Delta Verse is the concept of perpetual change. Environments within the Delta Verse are not static but fluid, adapting to the collective imagination of its participants. AI algorithms monitor and respond to user input and emotions, shaping the landscape in real-time. One moment, you might find yourself in a serene forest, and the next, you could be navigating the bustling streets of a futuristic metropolis—all driven by the desires and interactions of those present.

The Collaborative Imagination:

The Delta Verse thrives on collaboration. Participants don't merely consume content; they co-create it. AI algorithms analyze the ideas, preferences, and creative input of individuals, weaving them together to form an intricate narrative tapestry. It's a dynamic symphony of human thought and machine intelligence, where the story evolves as collective imagination evolves.

Adaptive Storytelling:

Storytelling in the Delta Verse is not bound by conventional structures. Instead, it's a living, breathing entity that responds to the ebb and flow of participants' thoughts and emotions. Characters develop personalities based on interactions, and plotlines shift as new ideas emerge. The Delta Verse is a canvas where tales are painted and rewritten continuously, reflecting the ever-evolving nature of the human experience.

Embracing Change and Transformation:

The Delta Verse encourages participants to embrace change, explore the unknown, and adapt to the unexpected. It challenges preconceived notions of narrative, art, and reality. In this dynamic space, participants not only discover new stories but also uncover hidden facets of themselves as they navigate the ever-changing Delta Verse.

In DeltaVerse, artificial intelligence acts as a seamless bridge, propelling users from mere participants to creators of their own imaginative realms. Here, natural language processing transforms into a tool of empowerment, enabling users to generate immersive interplay across the cryptosphere. This innovative approach allows for intuitive interaction with complex blockchain technologies, making the development and exploration within this space accessible and engaging. DeltaVerse stands at the forefront of this evolution, where the simplicity of language meets the complexity of blockchain, opening up a world of possibilities for both seasoned developers and imaginative explorers alike.`;

export const MINTED_NFTS: MintedNFT[] = [
  {
    contract: GENESIS_CONTRACT,
    tokenId: 1,
    chain: 'Polygon',
    chainId: 137,
    name: 'DELTA VERSE',
    description: GENESIS_DESCRIPTION,
    ipfsMetadata: 'ipfs://bafybeihax6prz6r6nhoib4i7hxns3avrpfjzikkvfhdlbfauvl4vtn2jjy/1',
    ipfsImage: 'ipfs://bafybeidl2xltvbxl54os4oo7z4w4lwkjch2yr5wb4g42l7bas7cznzzi4a/1',
    traits: { DELTA: 'VERSE', ACCESS: 'GRANTED', DAIO: 'ML' },
    opensea: `${OPENSEA_BASE}/${GENESIS_CONTRACT}/1`,
    polygonscan: `${POLYGONSCAN_BASE}/${GENESIS_CONTRACT}`,
    isGenesis: true,
  },
  {
    contract: GENESIS_CONTRACT,
    tokenId: 2,
    chain: 'Polygon',
    chainId: 137,
    name: 'THRUST Unicorn Rocket - A Celestial Odyssey',
    description: 'Embark on a celestial odyssey with the exclusive "THRUST Unicorn Rocket" NFT, a masterpiece where fantasy meets the boundless possibilities of crypto-space exploration. This 1:1 digital collectible captures the essence of adventure and the unbridled spirit of discovery.',
    ipfsMetadata: 'ipfs://bafybeihax6prz6r6nhoib4i7hxns3avrpfjzikkvfhdlbfauvl4vtn2jjy/2',
    ipfsImage: 'ipfs://bafybeicnfjatu7ii6jenbzinnswaug5fbscn3rxqryvcwux2tt7x7wpzyi/2',
    traits: { DeltaV: 'THRUST', UNICORN: 'ROCKET', CELESTIAL: 'ODYSSEY', '1': '1' },
    opensea: `${OPENSEA_BASE}/${GENESIS_CONTRACT}/2`,
    polygonscan: `${POLYGONSCAN_BASE}/${GENESIS_CONTRACT}`,
  },
  {
    contract: GENESIS_CONTRACT,
    tokenId: 3,
    chain: 'Polygon',
    chainId: 137,
    name: 'DeltaVerse Engine (c) TNT',
    description: 'In the vanguard of digital evolution, the DeltaVerse Engine stands as a pioneering force, redefining the fabric of virtual interaction. Powered by the visionary MASTERMIND, this engine is the central architect of a realm where participants are the vital pulse. 369 engines minted — Tesla numerology, golden ratio, Fibonacci as design principles.',
    ipfsMetadata: 'ipfs://bafybeihax6prz6r6nhoib4i7hxns3avrpfjzikkvfhdlbfauvl4vtn2jjy/3',
    ipfsImage: 'ipfs://bafybeidsrbh2gcvfyhyrfpnasgy2jaxbeeq5dl72beys4g7ribgcyiii2i/3',
    traits: { DELTA: 'VERSE', MINT: '369', DeltaVerse: 'ENGINE', TESLA: '369', MASTERMIND: 'ON', ACCESS: 'GRANTED' },
    opensea: `${OPENSEA_BASE}/${GENESIS_CONTRACT}/3`,
    polygonscan: `${POLYGONSCAN_BASE}/${GENESIS_CONTRACT}`,
  },
  {
    contract: GENESIS_CONTRACT,
    tokenId: 4,
    chain: 'Polygon',
    chainId: 137,
    name: 'Ancient Cypherian Weaver: Weavers Sceptor',
    description: 'Visualize Cypherian Weaver, a master coder and quantum weaver from the cybernetic realms of the DeltaVerse, standing within the pulsating heart of the Etherwave Node. A radiant orb of vibrant ethereal energy, symbolizing the magical and technological confluence.',
    ipfsMetadata: 'ipfs://bafybeihax6prz6r6nhoib4i7hxns3avrpfjzikkvfhdlbfauvl4vtn2jjy/4',
    ipfsImage: 'ipfs://bafybeihxij3q7cs6llvi4qfd7am4vy5zd7cbm777fnaelnpjwtkleq2sze/4',
    traits: { CYPHERIAN: 'WEAVER', SCEPTOR: 'CREATION', DELTAVERSE: 'DESTINY', WEAVER: 'ORIGIN', '1': '1', '5D': '3D', MASTER: 'CODER', ETHERWAVE: 'NODE', ACCESS: 'GRANTED' },
    opensea: `${OPENSEA_BASE}/${GENESIS_CONTRACT}/4`,
    polygonscan: `${POLYGONSCAN_BASE}/${GENESIS_CONTRACT}`,
  },
  {
    contract: THRUST_CONTRACT,
    tokenId: 1,
    chain: 'Polygon',
    chainId: 137,
    name: 'THRUST',
    description: 'DeltaV THRUST continues to expand on the Binance Smart Chain. DeltaV THRUST is an amortized company. DeltaV THRUST is forever. 1000% APY. PULSAR, HANDSHAKE, AFTERBURNER, SLINGSHOT, and WARPDRIVE — the DVG Protocol mechanisms.',
    ipfsMetadata: 'ipfs://bafybeihhvy4hbggipnjye5yjamrcekzpo2z2itxrvngpu6zzsixf7s5gnq/1',
    ipfsImage: 'ipfs://bafybeihgfnztkbvmpfhqxhtemwkqybt5dscrsuhltcfbyib4bkbguljiay/1',
    traits: { 'DeltaV THRUST': 'launch stage 4', BUY: '5%', SELL: '10%', APY: '1000%', LIQUIDITY: 'LOCKED' },
    opensea: `${OPENSEA_BASE}/${THRUST_CONTRACT}/1`,
    polygonscan: `${POLYGONSCAN_BASE}/${THRUST_CONTRACT}`,
  },
  {
    contract: THRUST_CONTRACT,
    tokenId: 2,
    chain: 'Polygon',
    chainId: 137,
    name: 'THRUST1000',
    description: 'Introducing the DeltaV THRUST 1000 NFT: your gateway to unprecedented returns in the digital frontier. This isn\'t just a token — it\'s a powerhouse, offering a staggering 1000% APY.',
    ipfsMetadata: 'ipfs://bafybeihhvy4hbggipnjye5yjamrcekzpo2z2itxrvngpu6zzsixf7s5gnq/2',
    ipfsImage: 'ipfs://bafybeihgfnztkbvmpfhqxhtemwkqybt5dscrsuhltcfbyib4bkbguljiay/2',
    traits: { '1000%': 'APY', BUY: '5%', SELL: '5%', HANDSHAKE: 'ON', TRADE: '0.00%' },
    opensea: `${OPENSEA_BASE}/${THRUST_CONTRACT}/2`,
    polygonscan: `${POLYGONSCAN_BASE}/${THRUST_CONTRACT}`,
  },
  {
    contract: THRUST_CONTRACT,
    tokenId: 3,
    chain: 'Polygon',
    chainId: 137,
    name: 'DeltaV THRUST rocket',
    description: 'Unleashing the Power of Exponential Growth and Compound Interest with DeltaV THRUST. Auto stake auto reward utility token harnessing compound interest. Holdings compound every 18 minutes. BROBOT BRAI AI assistant. 22000 THRUST threshold for DeltaVerse access.',
    ipfsMetadata: 'ipfs://bafybeihhvy4hbggipnjye5yjamrcekzpo2z2itxrvngpu6zzsixf7s5gnq/3',
    ipfsImage: 'ipfs://bafybeibiznh7pitnohtyfr4benk4odtgxtou5qsykfuccs4we7cf4dfhf4/3',
    traits: { DeltaV: 'THRUST', BROBOT: 'BRAI', DELTA: 'VERSE', THRUST: 'ROCKET' },
    opensea: `${OPENSEA_BASE}/${THRUST_CONTRACT}/3`,
    polygonscan: `${POLYGONSCAN_BASE}/${THRUST_CONTRACT}`,
  },
  {
    contract: THRUST_CONTRACT,
    tokenId: 4,
    chain: 'Polygon',
    chainId: 137,
    name: 'DeltaV THRUST investors guide',
    description: 'Cryptocurrency trading guide emphasizing patience, buying low and selling high, and doubling and selling half. The underlying theme is patience — Chronos wisdom minted on-chain.',
    ipfsMetadata: 'ipfs://bafybeihhvy4hbggipnjye5yjamrcekzpo2z2itxrvngpu6zzsixf7s5gnq/4',
    ipfsImage: 'ipfs://bafybeifwndmh4dj4sllh3c252fnuqpmejkubszxscdijdi2rcxix7k6ine/4',
    traits: { 'BUY LOW': 'SELL HIGH', DOUBLE: 'DOWN', DCA: 'DCI', DeltaV: 'THRUST' },
    opensea: `${OPENSEA_BASE}/${THRUST_CONTRACT}/4`,
    polygonscan: `${POLYGONSCAN_BASE}/${THRUST_CONTRACT}`,
  },
];

export const GENESIS_NFT = MINTED_NFTS[0];

export function getIpfsGatewayUrl(ipfsUri: string): string {
  return ipfsUri.replace('ipfs://', `${IPFS_GATEWAY}/`);
}

/// Unstoppable Domains held by owner address (on-chain NFTs, Polygon)
export const UNSTOPPABLE_DOMAINS = [
  { name: 'deltaverse.dao', url: 'https://unstoppabledomains.com/d/deltaverse.dao', role: 'Primary deployment domain' },
  { name: 'deltavthrust.wallet', subdomain: 'nft.deltavthrust.wallet', role: 'NFT wallet' },
  { name: 'deltavthrust.blockchain', role: 'Blockchain identity' },
  { name: 'thrustchain.blockchain', role: 'Chain identity' },
  { name: 'build.deltavthrust.nft', role: 'Builder identity' },
  { name: 'pay.deltavthrust.wallet', role: 'Payment wallet' },
  { name: 'web3.deltavthrust.wallet', role: 'Web3 wallet' },
  { name: 'abc.deltavthrust.nft', role: 'NFT subdomain' },
] as const;

/// Room type presets mapping to BubbleRoomV4 types
export const ROOM_PRESETS = {
  BOARDROOM: {
    roomType: 9, // DELTA
    description: 'Governance room. Tradeable vaults (Chests). Swarm consensus for decisions.',
    defaultTone: 'Commanding',
    vaultClass: 'CHEST' as const,
  },
  DOJO: {
    roomType: 9, // DELTA
    description: 'Practice room. Soulbound vaults (Tombs). Knowledge accrual through repetition.',
    defaultTone: 'Disciplined',
    vaultClass: 'TOMB' as const,
  },
  TREASURY: {
    roomType: 8, // VAULT
    description: 'Encrypted storage. SafetyDepositBox vaults. Oracle-gated access.',
    defaultTone: 'Secure',
    vaultClass: 'SAFETYDEPOSITBOX' as const,
  },
  ARENA: {
    roomType: 2, // EPHEMERAL
    description: 'Competition space. Treasure vaults discoverable by winners.',
    defaultTone: 'Electric',
    vaultClass: 'TREASURE' as const,
  },
  SANCTUM: {
    roomType: 7, // TIMELOCKED
    description: 'Time-locked secret space. Secret vaults revealed on schedule.',
    defaultTone: 'Ethereal',
    vaultClass: 'SECRET' as const,
  },
} as const;
