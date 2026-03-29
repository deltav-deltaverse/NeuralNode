import React, { useState } from 'react';
import { Contract } from 'ethers';
import { useWallet } from '../wallet/WalletContext';
import SeedABI from '../abis/SeedRegistry.json';

interface SeedData {
  id: number;
  prompt: string;
  tone: string;
  evolves: boolean;
  originSeedId: number;
  spawnCount: number;
  timestamp: number;
  creator: string;
}

interface Props {
  seedRegistryAddress: string;
}

export default function SeedBrowser({ seedRegistryAddress }: Props) {
  const { signer, address } = useWallet();
  const [seedId, setSeedId] = useState('');
  const [seed, setSeed] = useState<SeedData | null>(null);
  const [lineage, setLineage] = useState<number[]>([]);
  const [ancestors, setAncestors] = useState<number[]>([]);
  const [depth, setDepth] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const [newPrompt, setNewPrompt] = useState('');
  const [newTone, setNewTone] = useState('');
  const [mutation, setMutation] = useState('');
  const [acting, setActing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const getContract = () => {
    if (!signer || !seedRegistryAddress) return null;
    return new Contract(seedRegistryAddress, SeedABI, signer);
  };

  const loadSeed = async () => {
    const reg = getContract();
    if (!reg || !seedId) return;
    setError(null);
    setSeed(null);

    try {
      const s = await reg.seeds(Number(seedId));
      if (!s.exists) { setError('Seed does not exist'); return; }

      setSeed({
        id: Number(seedId),
        prompt: s.prompt,
        tone: s.tone,
        evolves: s.evolves,
        originSeedId: Number(s.originSeedId),
        spawnCount: Number(s.spawnCount),
        timestamp: Number(s.timestamp),
        creator: s.creator,
      });

      const lin: bigint[] = await reg.getLineage(Number(seedId));
      setLineage(lin.map(Number));

      const anc: bigint[] = await reg.getAncestors(Number(seedId));
      setAncestors(anc.map(Number));

      const d = await reg.getLineageDepth(Number(seedId));
      setDepth(Number(d));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Load failed');
    }
  };

  const handleCreateGenesis = async () => {
    const reg = getContract();
    if (!reg || !newPrompt) return;
    setActing(true);
    setError(null);
    setResult(null);
    try {
      const tx = await reg.createGenesisSeed(newPrompt, newTone, true);
      const receipt = await tx.wait();
      setResult(`Genesis seed created. TX: ${receipt.hash.slice(0, 12)}...`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed');
    }
    setActing(false);
  };

  const handleSpawn = async () => {
    const reg = getContract();
    if (!reg || !seedId || !mutation) return;
    setActing(true);
    setError(null);
    setResult(null);
    try {
      const tx = await reg.spawnSeed(Number(seedId), mutation, '');
      const receipt = await tx.wait();
      setResult(`Emergence spawned. TX: ${receipt.hash.slice(0, 12)}...`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Spawn failed');
    }
    setActing(false);
  };

  if (!address) return <p className="connect-prompt">Connect wallet to browse Seeds.</p>;

  return (
    <div className="seed-browser">
      <h2>Seed Registry</h2>

      <div className="seed-lookup">
        <div className="form-field">
          <label>Seed ID</label>
          <div className="input-with-btn">
            <input type="number" value={seedId} onChange={(e) => setSeedId(e.target.value)} min="1" placeholder="Enter seed ID" />
            <button onClick={loadSeed} disabled={!seedId}>Load</button>
          </div>
        </div>
      </div>

      {seed && (
        <div className="seed-detail">
          <div className="seed-detail-header">
            <h3>Seed #{seed.id}</h3>
            <span className={`seed-type-badge ${seed.originSeedId === 0 ? 'genesis' : 'emergence'}`}>
              {seed.originSeedId === 0 ? 'GENESIS' : 'EMERGENCE'}
            </span>
          </div>

          <div className="seed-detail-field">
            <label>Prompt</label>
            <p className="ai-seed">{seed.prompt}</p>
          </div>

          <div className="seed-detail-row">
            <div><label>Tone</label><span>{seed.tone}</span></div>
            <div><label>Evolves</label><span>{seed.evolves ? 'Yes' : 'No'}</span></div>
            <div><label>Spawns</label><span>{seed.spawnCount}</span></div>
            <div><label>Depth</label><span>{depth}</span></div>
          </div>

          {seed.originSeedId > 0 && (
            <div className="seed-detail-field">
              <label>Origin Seed</label>
              <span className="lineage-link" onClick={() => { setSeedId(String(seed.originSeedId)); loadSeed(); }}>
                #{seed.originSeedId}
              </span>
            </div>
          )}

          {ancestors.length > 0 && (
            <div className="seed-detail-field">
              <label>Ancestors (Lineage chain)</label>
              <div className="lineage-chain">
                {ancestors.map((a, i) => (
                  <React.Fragment key={a}>
                    <span className="lineage-link" onClick={() => setSeedId(String(a))}>#{a}</span>
                    {i < ancestors.length - 1 && <span className="lineage-arrow">&larr;</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          {lineage.length > 0 && (
            <div className="seed-detail-field">
              <label>Emergences ({lineage.length})</label>
              <div className="lineage-nodes">
                {lineage.map((id) => (
                  <span key={id} className="lineage-node" onClick={() => setSeedId(String(id))}>
                    #{id}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="seed-action">
            <h4>Spawn from this Seed</h4>
            <div className="form-field">
              <label>Mutation</label>
              <textarea value={mutation} onChange={(e) => setMutation(e.target.value)}
                placeholder="The semantic shift..." rows={2} />
            </div>
            <button className="btn-spawn" disabled={acting || !mutation} onClick={handleSpawn}>
              {acting ? 'Spawning...' : 'Spawn Emergence'}
            </button>
          </div>
        </div>
      )}

      <div className="seed-create">
        <h3>Create Genesis Seed</h3>
        <div className="form-field">
          <label>Prompt</label>
          <textarea value={newPrompt} onChange={(e) => setNewPrompt(e.target.value)}
            placeholder="The generative DNA of this seed..." rows={3} />
        </div>
        <div className="form-field">
          <label>Tone</label>
          <input value={newTone} onChange={(e) => setNewTone(e.target.value)} placeholder="Commanding" />
        </div>
        <button className="btn-sign" disabled={acting || !newPrompt} onClick={handleCreateGenesis}>
          {acting ? 'Creating...' : 'Create Genesis Seed'}
        </button>
      </div>

      {result && <p className="success-msg">{result}</p>}
      {error && <p className="room-error">{error}</p>}
    </div>
  );
}
