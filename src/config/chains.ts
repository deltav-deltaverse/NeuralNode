export interface ChainConfig {
  chainId: number;
  name: string;
  rpcUrl: string;
  blockExplorer: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  contracts: {
    bubbleRoom?: string;
    orchestrator?: string;
    genesisSBT?: string;
  };
}

export const SUPPORTED_CHAINS: Record<number, ChainConfig> = {
  137: {
    chainId: 137,
    name: 'Polygon',
    rpcUrl: 'https://polygon-rpc.com',
    blockExplorer: 'https://polygonscan.com',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
    contracts: {
      bubbleRoom: '',
      orchestrator: '',
      genesisSBT: '',
    },
  },
  1: {
    chainId: 1,
    name: 'Ethereum',
    rpcUrl: 'https://eth.llamarpc.com',
    blockExplorer: 'https://etherscan.io',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    contracts: {
      bubbleRoom: '',
      orchestrator: '',
      genesisSBT: '',
    },
  },
  80002: {
    chainId: 80002,
    name: 'Polygon Amoy',
    rpcUrl: 'https://rpc-amoy.polygon.technology',
    blockExplorer: 'https://amoy.polygonscan.com',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
    contracts: {
      bubbleRoom: '',
      orchestrator: '',
      genesisSBT: '',
    },
  },
};

export const DEFAULT_CHAIN_ID = 137;
