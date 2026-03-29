import React, { useState, useEffect } from 'react';
import { Contract } from 'ethers';
import { useWallet } from '../wallet/WalletContext';
import TombABI from '../abis/TombRegistry.json';

const VAULT_CLASSES = ['TOMB', 'CHEST', 'SAFETYDEPOSITBOX', 'TREASURE', 'SECRET', 'CUSTOM'] as const;
const VAULT_STATES = ['SEALED', 'UNLOCKED', 'EXPIRED', 'REVOKED'] as const;
const ORACLE_TYPES = ['TIME', 'IDENTITY', 'SWARM', 'CONDITION', 'PROGRAMMABLE'] as const;
const TRAIT_NAMES = ['intelligence', 'knowledge', 'resonance', 'adaptability', 'coherence'] as const;

const CLASS_DESC: Record<string, string> = {
  TOMB: 'Soulbound to room. Non-tradeable permanent archive.',
  CHEST: 'Tradeable. Portable encrypted container.',
  SAFETYDEPOSITBOX: 'Conditional trade. Requires oracle consent to move.',
  TREASURE: 'Discoverable. Found by participants meeting conditions.',
  SECRET: 'Hidden until revealed. Transferable after unlock.',
  CUSTOM: 'User-defined classification with custom name.',
};

interface VaultData {
  id: number;
  roomId: number;
  storageCID: string;
  keyCID: string;
  keyRoomId: number;
  state: number;
  vaultClass: number;
  customName: string;
  creator: string;
  created: number;
  oracleCount: number;
  allConsentMet: boolean;
}

interface Props {
  tombAddress: string;
}

export default function VaultManager({ tombAddress }: Props) {
  const { signer, address } = useWallet();

  // Create vault form
  const [roomId, setRoomId] = useState('');
  const [storageCID, setStorageCID] = useState('');
  const [keyCID, setKeyCID] = useState('');
  const [keyRoomId, setKeyRoomId] = useState('0');
  const [vaultClass, setVaultClass] = useState(0);
  const [customName, setCustomName] = useState('');
  const [creating, setCreating] = useState(false);

  // Oracle form
  const [oracleVaultId, setOracleVaultId] = useState('');
  const [oracleType, setOracleType] = useState(0);
  const [timeParam, setTimeParam] = useState('');
  const [identityParam, setIdentityParam] = useState('');
  const [traitType, setTraitType] = useState(0);
  const [traitThreshold, setTraitThreshold] = useState('');
  const [addingOracle, setAddingOracle] = useState(false);

  // Inspect
  const [inspectId, setInspectId] = useState('');
  const [vault, setVault] = useState<VaultData | null>(null);

  // Actions
  const [acting, setActing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getContract = () => {
    if (!signer || !tombAddress) return null;
    return new Contract(tombAddress, TombABI, signer);
  };

  const loadVault = async () => {
    const c = getContract();
    if (!c || !inspectId) return;
    setError(null);
    try {
      const v = await c.vaults(Number(inspectId));
      if (!v.exists) { setError('Vault does not exist'); setVault(null); return; }
      const oc = await c.getOracleCount(Number(inspectId));
      const consent = await c.allConsentMet(Number(inspectId));
      setVault({
        id: Number(inspectId),
        roomId: Number(v.roomId),
        storageCID: v.storageCID,
        keyCID: v.keyCID,
        keyRoomId: Number(v.keyRoomId),
        state: Number(v.state),
        vaultClass: Number(v.vaultClass),
        customName: v.customName,
        creator: v.creator,
        created: Number(v.created),
        oracleCount: Number(oc),
        allConsentMet: consent,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Load failed');
    }
  };

  const handleCreate = async () => {
    const c = getContract();
    if (!c || !roomId || !storageCID) return;
    setCreating(true); setError(null); setResult(null);
    try {
      const tx = await c.createVault(Number(roomId), storageCID, keyCID, Number(keyRoomId), vaultClass, customName);
      await tx.wait();
      setResult('Vault created.');
    } catch (e) { setError(e instanceof Error ? e.message : 'Create failed'); }
    setCreating(false);
  };

  const handleAddOracle = async () => {
    const c = getContract();
    if (!c || !oracleVaultId) return;
    setAddingOracle(true); setError(null); setResult(null);
    try {
      let tx;
      if (oracleType === 0) { // TIME
        tx = await c.addTimeOracle(Number(oracleVaultId), Number(timeParam));
      } else if (oracleType === 1) { // IDENTITY
        tx = await c.addIdentityOracle(Number(oracleVaultId), identityParam);
      } else if (oracleType === 3) { // CONDITION
        tx = await c.addConditionOracle(Number(oracleVaultId), traitType, Number(traitThreshold));
      }
      if (tx) await tx.wait();
      setResult('Oracle added.');
    } catch (e) { setError(e instanceof Error ? e.message : 'Failed'); }
    setAddingOracle(false);
  };

  const handleAction = async (action: string, vaultId: number, extraParam?: number) => {
    const c = getContract();
    if (!c) return;
    setActing(true); setError(null); setResult(null);
    try {
      let tx;
      if (action === 'evaluate') tx = await c.evaluateConsent(vaultId);
      else if (action === 'unlock') tx = await c.unlock(vaultId);
      else if (action === 'seal') tx = await c.seal(vaultId);
      else if (action === 'revoke') tx = await c.revoke(vaultId);
      else if (action === 'transfer' && extraParam) tx = await c.transferVault(vaultId, extraParam);
      if (tx) await tx.wait();
      setResult(`${action} complete.`);
      loadVault();
    } catch (e) { setError(e instanceof Error ? e.message : `${action} failed`); }
    setActing(false);
  };

  if (!address) return <p className="connect-prompt">Connect wallet to manage Vaults.</p>;

  return (
    <div className="vault-manager">
      <h2>Vault Manager</h2>
      <p className="view-desc">
        Programmable encrypted volumes with oracle consent. Inspired by <a href="https://dyne.org/tomb/" target="_blank" rel="noopener noreferrer">dyne.org/tomb</a>.
        Key separation: encrypted volume in one room, key file stored separately.
      </p>

      {/* Create */}
      <div className="vault-section">
        <h3>Create Vault</h3>
        <div className="vault-form">
          <div className="form-row">
            <div className="form-field">
              <label>Room ID</label>
              <input type="number" value={roomId} onChange={(e) => setRoomId(e.target.value)} min="1" />
            </div>
            <div className="form-field">
              <label>Class</label>
              <select value={vaultClass} onChange={(e) => setVaultClass(Number(e.target.value))}>
                {VAULT_CLASSES.map((c, i) => <option key={c} value={i}>{c}</option>)}
              </select>
            </div>
          </div>
          <p className="class-desc">{CLASS_DESC[VAULT_CLASSES[vaultClass]]}</p>
          {vaultClass === 5 && (
            <div className="form-field">
              <label>Custom Name</label>
              <input value={customName} onChange={(e) => setCustomName(e.target.value)} placeholder="Pandora's Box" />
            </div>
          )}
          <div className="form-field">
            <label>Storage CID (encrypted volume)</label>
            <input value={storageCID} onChange={(e) => setStorageCID(e.target.value)} placeholder="ipfs://Qm..." />
          </div>
          <div className="form-row">
            <div className="form-field">
              <label>Key CID (separate location)</label>
              <input value={keyCID} onChange={(e) => setKeyCID(e.target.value)} placeholder="ipfs://Qm..." />
            </div>
            <div className="form-field">
              <label>Key Room ID (0 = off-chain)</label>
              <input type="number" value={keyRoomId} onChange={(e) => setKeyRoomId(e.target.value)} min="0" />
            </div>
          </div>
          <button className="btn-govern" disabled={creating || !roomId || !storageCID} onClick={handleCreate}>
            {creating ? 'Creating...' : 'Create Vault'}
          </button>
        </div>
      </div>

      {/* Add Oracle */}
      <div className="vault-section">
        <h3>Add Oracle Consent</h3>
        <div className="vault-form">
          <div className="form-row">
            <div className="form-field">
              <label>Vault ID</label>
              <input type="number" value={oracleVaultId} onChange={(e) => setOracleVaultId(e.target.value)} min="1" />
            </div>
            <div className="form-field">
              <label>Oracle Type</label>
              <select value={oracleType} onChange={(e) => setOracleType(Number(e.target.value))}>
                <option value={0}>TIME</option>
                <option value={1}>IDENTITY</option>
                <option value={3}>CONDITION</option>
              </select>
            </div>
          </div>
          {oracleType === 0 && (
            <div className="form-field">
              <label>Unlock Timestamp (Unix)</label>
              <input type="number" value={timeParam} onChange={(e) => setTimeParam(e.target.value)}
                placeholder={String(Math.floor(Date.now() / 1000) + 86400)} />
            </div>
          )}
          {oracleType === 1 && (
            <div className="form-field">
              <label>Required Address</label>
              <input value={identityParam} onChange={(e) => setIdentityParam(e.target.value)} placeholder="0x..." />
            </div>
          )}
          {oracleType === 3 && (
            <div className="form-row">
              <div className="form-field">
                <label>Trait</label>
                <select value={traitType} onChange={(e) => setTraitType(Number(e.target.value))}>
                  {TRAIT_NAMES.map((t, i) => <option key={t} value={i}>{t}</option>)}
                </select>
              </div>
              <div className="form-field">
                <label>Threshold (0-100)</label>
                <input type="number" value={traitThreshold} onChange={(e) => setTraitThreshold(e.target.value)} min="0" max="100" />
              </div>
            </div>
          )}
          <button className="btn-govern" disabled={addingOracle || !oracleVaultId} onClick={handleAddOracle}>
            {addingOracle ? 'Adding...' : 'Add Oracle'}
          </button>
        </div>
      </div>

      {/* Inspect */}
      <div className="vault-section">
        <h3>Inspect Vault</h3>
        <div className="input-with-btn">
          <input type="number" value={inspectId} onChange={(e) => setInspectId(e.target.value)} min="1" placeholder="Vault ID" />
          <button onClick={loadVault} disabled={!inspectId}>Load</button>
        </div>

        {vault && (
          <div className="vault-detail">
            <div className="vault-detail-header">
              <h4>{vault.customName || VAULT_CLASSES[vault.vaultClass]} #{vault.id}</h4>
              <span className={`vault-state state-${VAULT_STATES[vault.state].toLowerCase()}`}>
                {VAULT_STATES[vault.state]}
              </span>
            </div>
            <div className="vault-detail-grid">
              <div><label>Class</label><span>{VAULT_CLASSES[vault.vaultClass]}</span></div>
              <div><label>Room</label><span>#{vault.roomId}</span></div>
              <div><label>Key Room</label><span>{vault.keyRoomId === 0 ? 'Off-chain' : `#${vault.keyRoomId}`}</span></div>
              <div><label>Oracles</label><span>{vault.oracleCount}</span></div>
              <div><label>Consent</label>
                <span className={vault.allConsentMet ? 'consent-met' : 'consent-pending'}>
                  {vault.allConsentMet ? 'ALL MET' : 'PENDING'}
                </span>
              </div>
              <div><label>Creator</label><span className="mono">{vault.creator.slice(0, 6)}...{vault.creator.slice(-4)}</span></div>
            </div>
            <div className="vault-cids">
              <div><label>Storage CID</label><span className="mono">{vault.storageCID}</span></div>
              <div><label>Key CID</label><span className="mono">{vault.keyCID}</span></div>
            </div>
            <div className="vault-actions-row">
              <button disabled={acting} onClick={() => handleAction('evaluate', vault.id)}>Evaluate</button>
              <button disabled={acting || vault.state !== 0} onClick={() => handleAction('unlock', vault.id)}>Unlock</button>
              <button disabled={acting || vault.state !== 1} onClick={() => handleAction('seal', vault.id)}>Seal</button>
              <button disabled={acting} className="btn-delete" onClick={() => handleAction('revoke', vault.id)}>Revoke</button>
            </div>
          </div>
        )}
      </div>

      {result && <p className="success-msg">{result}</p>}
      {error && <p className="room-error">{error}</p>}
    </div>
  );
}
