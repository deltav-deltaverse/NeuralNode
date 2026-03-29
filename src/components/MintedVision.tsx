import React, { useState } from 'react';
import { MINTED_NFTS, COPYRIGHT, getIpfsGatewayUrl, type MintedNFT } from '../config/genesis';

export default function MintedVision() {
  return (
    <div className="minted-vision">
      <h2>The Minted Vision</h2>
      <p className="vision-copyright">{COPYRIGHT}</p>
      <p className="vision-desc">
        Every NFT description is a .prompt — generative DNA minted on-chain.
        NFT #1 is the Genesis from which all Seeds, Rooms, and Agents descend.
      </p>

      <div className="nft-gallery">
        {MINTED_NFTS.map((nft) => (
          <NFTCard key={`${nft.contract}-${nft.tokenId}`} nft={nft} />
        ))}
      </div>
    </div>
  );
}

function NFTCard({ nft }: { nft: MintedNFT }) {
  const [expanded, setExpanded] = useState(false);
  const imageUrl = getIpfsGatewayUrl(nft.ipfsImage);
  const descPreview = nft.description.length > 200
    ? nft.description.slice(0, 200) + '...'
    : nft.description;

  return (
    <div className={`nft-card ${nft.isGenesis ? 'nft-genesis' : ''}`}>
      {nft.isGenesis && <div className="genesis-badge">GENESIS</div>}

      <div className="nft-image-container">
        <img
          src={imageUrl}
          alt={nft.name}
          className="nft-image"
          loading="lazy"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      </div>

      <div className="nft-info">
        <h3 className="nft-name">{nft.name}</h3>
        <div className="nft-meta">
          <span className="nft-chain">{nft.chain}</span>
          <span className="nft-token-id">#{nft.tokenId}</span>
          <span className="nft-contract" title={nft.contract}>
            {nft.contract.slice(0, 6)}...{nft.contract.slice(-4)}
          </span>
        </div>

        <div className="nft-description">
          <p>{expanded ? nft.description : descPreview}</p>
          {nft.description.length > 200 && (
            <button className="expand-btn" onClick={() => setExpanded(!expanded)}>
              {expanded ? 'Collapse' : 'Read full .prompt'}
            </button>
          )}
        </div>

        <div className="nft-traits">
          {Object.entries(nft.traits).map(([key, value]) => (
            <span key={key} className="nft-trait">
              {key}:{value}
            </span>
          ))}
        </div>

        <div className="nft-verify">
          <a href={nft.opensea} target="_blank" rel="noopener noreferrer" className="verify-link">
            OpenSea
          </a>
          <a href={nft.polygonscan} target="_blank" rel="noopener noreferrer" className="verify-link">
            Polygonscan
          </a>
          <a href={getIpfsGatewayUrl(nft.ipfsMetadata)} target="_blank" rel="noopener noreferrer" className="verify-link">
            IPFS Metadata
          </a>
        </div>
      </div>
    </div>
  );
}
