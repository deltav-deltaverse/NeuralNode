import { BrowserProvider, JsonRpcSigner } from 'ethers';
import { SUPPORTED_CHAINS, DEFAULT_CHAIN_ID, type ChainConfig } from '../config/chains';

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, handler: (...args: unknown[]) => void) => void;
      removeListener: (event: string, handler: (...args: unknown[]) => void) => void;
    };
  }
}

export interface WalletState {
  connected: boolean;
  address: string | null;
  chainId: number | null;
  provider: BrowserProvider | null;
  signer: JsonRpcSigner | null;
  chainConfig: ChainConfig | null;
}

const initialState: WalletState = {
  connected: false,
  address: null,
  chainId: null,
  provider: null,
  signer: null,
  chainConfig: null,
};

export async function connectMetaMask(): Promise<WalletState> {
  if (!window.ethereum) {
    throw new Error('MetaMask not detected. Please install MetaMask.');
  }

  const provider = new BrowserProvider(window.ethereum);
  const accounts = (await provider.send('eth_requestAccounts', [])) as string[];

  if (accounts.length === 0) {
    throw new Error('No accounts found. Please unlock MetaMask.');
  }

  const network = await provider.getNetwork();
  const chainId = Number(network.chainId);
  const signer = await provider.getSigner();
  const chainConfig = SUPPORTED_CHAINS[chainId] || null;

  return {
    connected: true,
    address: accounts[0],
    chainId,
    provider,
    signer,
    chainConfig,
  };
}

export async function switchChain(chainId: number): Promise<void> {
  if (!window.ethereum) throw new Error('MetaMask not detected');

  const chain = SUPPORTED_CHAINS[chainId];
  if (!chain) throw new Error(`Chain ${chainId} not supported`);

  const hexChainId = '0x' + chainId.toString(16);

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: hexChainId }],
    });
  } catch (err: unknown) {
    const error = err as { code?: number };
    if (error.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: hexChainId,
            chainName: chain.name,
            rpcUrls: [chain.rpcUrl],
            blockExplorerUrls: [chain.blockExplorer],
            nativeCurrency: chain.nativeCurrency,
          },
        ],
      });
    } else {
      throw err;
    }
  }
}

export function onAccountsChanged(handler: (accounts: string[]) => void): () => void {
  if (!window.ethereum) return () => {};
  const listener = (...args: unknown[]) => handler(args[0] as string[]);
  window.ethereum.on('accountsChanged', listener);
  return () => window.ethereum?.removeListener('accountsChanged', listener);
}

export function onChainChanged(handler: (chainId: number) => void): () => void {
  if (!window.ethereum) return () => {};
  const listener = (...args: unknown[]) => handler(Number(args[0] as string));
  window.ethereum.on('chainChanged', listener);
  return () => window.ethereum?.removeListener('chainChanged', listener);
}

export { initialState };
