import React from 'react';
import { useWallet } from '../wallet/WalletContext';
import { SUPPORTED_CHAINS } from '../config/chains';

function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function WalletConnect() {
  const { connected, address, chainId, chainConfig, connect, disconnect, switchNetwork, error } = useWallet();

  if (!connected) {
    return (
      <div className="wallet-connect">
        <button className="btn-connect" onClick={connect}>
          Connect MetaMask
        </button>
        {error && <p className="wallet-error">{error}</p>}
      </div>
    );
  }

  return (
    <div className="wallet-connected">
      <div className="wallet-info">
        <span className="wallet-address">{truncateAddress(address!)}</span>
        <span className="wallet-chain">
          {chainConfig?.name || `Chain ${chainId}`}
        </span>
      </div>
      <div className="wallet-actions">
        <select
          value={chainId || ''}
          onChange={(e) => switchNetwork(Number(e.target.value))}
        >
          {Object.values(SUPPORTED_CHAINS).map((chain) => (
            <option key={chain.chainId} value={chain.chainId}>
              {chain.name}
            </option>
          ))}
        </select>
        <button className="btn-disconnect" onClick={disconnect}>
          Disconnect
        </button>
      </div>
      {error && <p className="wallet-error">{error}</p>}
    </div>
  );
}
