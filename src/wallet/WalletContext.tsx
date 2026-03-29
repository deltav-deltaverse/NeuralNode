import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  connectMetaMask,
  switchChain,
  onAccountsChanged,
  onChainChanged,
  initialState,
  type WalletState,
} from './provider';

interface WalletContextValue extends WalletState {
  connect: () => Promise<void>;
  disconnect: () => void;
  switchNetwork: (chainId: number) => Promise<void>;
  error: string | null;
}

const WalletContext = createContext<WalletContextValue>({
  ...initialState,
  connect: async () => {},
  disconnect: () => {},
  switchNetwork: async () => {},
  error: null,
});

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<WalletState>(initialState);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async () => {
    try {
      setError(null);
      const walletState = await connectMetaMask();
      setState(walletState);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Connection failed';
      setError(msg);
    }
  }, []);

  const disconnect = useCallback(() => {
    setState(initialState);
    setError(null);
  }, []);

  const switchNetwork = useCallback(async (chainId: number) => {
    try {
      setError(null);
      await switchChain(chainId);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Network switch failed';
      setError(msg);
    }
  }, []);

  useEffect(() => {
    const unsub1 = onAccountsChanged((accounts) => {
      if (accounts.length === 0) {
        setState(initialState);
      } else {
        setState((prev) => ({ ...prev, address: accounts[0] }));
      }
    });
    const unsub2 = onChainChanged(() => {
      if (state.connected) connect();
    });
    return () => { unsub1(); unsub2(); };
  }, [state.connected, connect]);

  return (
    <WalletContext.Provider value={{ ...state, connect, disconnect, switchNetwork, error }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  return useContext(WalletContext);
}
