import React, { useState } from 'react';
import { AETHERIC_CODEX, encodeBinary, decodeBinary } from '../engine/binaryCodex';

export default function BinaryCodex() {
  const [inputText, setInputText] = useState('');
  const [inputBinary, setInputBinary] = useState('');
  const [encodedResult, setEncodedResult] = useState('');
  const [decodedResult, setDecodedResult] = useState('');

  return (
    <div className="binary-codex">
      <h3>Aetheric Codex Framework</h3>
      <p className="codex-desc">
        Binary-encoded executable seeds minted on-chain in NFT #4 (Cypherian Weaver).
        Machine-readable instructions embedded in the Etherwave Node.
      </p>

      <div className="codex-nfts">
        <div className="codex-card">
          <h4>{AETHERIC_CODEX.engine.name}</h4>
          <div className="codex-meta">
            <span>NFT #{AETHERIC_CODEX.engine.nft}</span>
            <span>Supply: {AETHERIC_CODEX.engine.supply}</span>
            <span>{AETHERIC_CODEX.engine.principle}</span>
          </div>
          <div className="codex-powers">
            {AETHERIC_CODEX.engine.powers.map((p) => (
              <span key={p} className="codex-power">{p}</span>
            ))}
          </div>
        </div>

        <div className="codex-card codex-weaver">
          <h4>{AETHERIC_CODEX.weaver.name}</h4>
          <div className="codex-meta">
            <span>NFT #{AETHERIC_CODEX.weaver.nft}</span>
            <span>Artifact: {AETHERIC_CODEX.weaver.artifact}</span>
            <span>Node: {AETHERIC_CODEX.weaver.node}</span>
          </div>
          <div className="codex-powers">
            {AETHERIC_CODEX.weaver.powers.map((p) => (
              <span key={p} className="codex-power">{p}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="binary-seeds">
        <h4>Binary-Encoded Seeds (on-chain)</h4>
        {AETHERIC_CODEX.binarySeeds.map((seed, i) => (
          <div key={i} className="binary-seed-entry">
            <div className="binary-action">{seed.action}</div>
            <div className="binary-decoded">{seed.decoded}</div>
            <details className="binary-raw">
              <summary>View binary</summary>
              <code>{seed.binary}</code>
            </details>
          </div>
        ))}
      </div>

      <div className="codex-tools">
        <h4>Binary Encoder/Decoder</h4>
        <div className="codex-tool-row">
          <div className="form-field">
            <label>Text → Binary</label>
            <input value={inputText} onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter text to encode..." />
            <button onClick={() => setEncodedResult(encodeBinary(inputText))} disabled={!inputText}>
              Encode
            </button>
            {encodedResult && <code className="codex-output">{encodedResult}</code>}
          </div>
          <div className="form-field">
            <label>Binary → Text</label>
            <input value={inputBinary} onChange={(e) => setInputBinary(e.target.value)}
              placeholder="01001000 01101001..." />
            <button onClick={() => setDecodedResult(decodeBinary(inputBinary))} disabled={!inputBinary}>
              Decode
            </button>
            {decodedResult && <p className="codex-output-text">{decodedResult}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
