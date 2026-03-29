import React, { useState, useEffect } from 'react';
import { Contract } from 'ethers';
import { useWallet } from '../wallet/WalletContext';
import BubbleRoomABI from '../abis/BubbleRoomV4.json';
import SpawnABI from '../abis/BubbleRoomSpawn.json';
import { ROOM_TYPES, ROLE_MAP } from '../engine/deltaRoomEngine';
import { AGENT_SEEDS, spawnSeed, type AgentSeed } from '../engine/agentSeed';

interface Props {
  bubbleRoomAddress: string;
  spawnAddress: string;
  originRoomId?: number;
}

export default function SpawnRoom({ bubbleRoomAddress, spawnAddress, originRoomId }: Props) {
  const { signer, address } = useWallet();
  const [originId, setParentId] = useState(originRoomId?.toString() || '');
  const [originSeed, setParentSeed] = useState<string>('');
  const [seedMutation, setSeedMutation] = useState('');
  const [theme, setTheme] = useState('');
  const [tone, setTone] = useState('');
  const [roomType, setRoomType] = useState('DELTA');
  const [evolves, setEvolves] = useState(true);
  const [spawning, setSpawning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [spawnResult, setSpawnResult] = useState<number | null>(null);
  const [selectedAgentSeed, setSelectedAgentSeed] = useState<string>('');

  // Fetch parent room's AI seed when originId changes
  useEffect(() => {
    if (!signer || !originId || !bubbleRoomAddress) return;
    const contract = new Contract(bubbleRoomAddress, BubbleRoomABI, signer);
    (async () => {
      try {
        const [aiSeed] = await contract.getRoomAI(Number(originId));
        setParentSeed(aiSeed);
      } catch {
        setParentSeed('');
      }
    })();
  }, [originId, signer, bubbleRoomAddress]);

  const applyAgentSeed = (agentKey: string) => {
    const seed = AGENT_SEEDS[agentKey];
    if (!seed) return;
    setSelectedAgentSeed(agentKey);
    setSeedMutation(seed.prompt);
    setTone(seed.tone);
  };

  const handleSpawn = async () => {
    if (!signer || !address || !originId || !spawnAddress) return;
    setSpawning(true);
    setError(null);
    setSpawnResult(null);

    try {
      const spawnContract = new Contract(spawnAddress, SpawnABI, signer);
      const roomTypeIndex = ROOM_TYPES.indexOf(roomType as typeof ROOM_TYPES[number]);

      const tx = await spawnContract.spawnFromRoom(
        Number(originId),
        '',          // metadataURI (can be set later via IPFS)
        theme,
        `Emergence from Origin #${originId}`,
        [address],
        [ROLE_MAP['MODERATOR']],
        false,       // isPrivate
        roomTypeIndex >= 0 ? roomTypeIndex : 9, // default DELTA
        seedMutation,
        tone,
        evolves,
      );

      const receipt = await tx.wait();
      // Parse RoomSpawned event for child room ID
      const spawnEvent = receipt.logs?.find(
        (log: { fragment?: { name: string } }) => log.fragment?.name === 'RoomSpawned'
      );
      if (spawnEvent) {
        setSpawnResult(Number(spawnEvent.args?.[1]));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Spawn failed');
    }
    setSpawning(false);
  };

  if (!address) {
    return <p className="connect-prompt">Connect wallet to spawn BubbleRooms.</p>;
  }

  const previewSeed = originSeed
    ? `${originSeed} >> ${seedMutation}`
    : seedMutation;

  return (
    <div className="spawn-room">
      <h2>Spawn BubbleRoom</h2>
      <p className="spawn-desc">
        Spawn an Emergence from an Origin BubbleRoom. The Emergence inherits and
        mutates the Origin's seed, extending the Lineage of evolving semantic spaces.
      </p>

      <div className="form-field">
        <label>Origin Room ID</label>
        <input
          type="number"
          value={originId}
          onChange={(e) => setParentId(e.target.value)}
          placeholder="Enter origin room ID"
          min="1"
        />
      </div>

      {originSeed && (
        <div className="parent-seed-display">
          <label>Parent AI Seed</label>
          <p className="ai-seed">{originSeed}</p>
        </div>
      )}

      <div className="form-field">
        <label>Agent Seed (inject founding agent DNA)</label>
        <div className="agent-seed-grid">
          {Object.entries(AGENT_SEEDS).map(([key, seed]) => (
            <button
              key={key}
              className={`agent-seed-btn ${selectedAgentSeed === key ? 'selected' : ''}`}
              onClick={() => applyAgentSeed(key)}
              title={seed.prompt}
            >
              <strong>{key}</strong>
              <span className="seed-tone">{seed.tone}</span>
              <span className="seed-class">{seed.wisdomClass}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="form-field">
        <label>Seed Mutation</label>
        <textarea
          value={seedMutation}
          onChange={(e) => setSeedMutation(e.target.value)}
          placeholder="The semantic shift to apply to the parent seed..."
          rows={3}
        />
      </div>

      <div className="form-field">
        <label>Theme</label>
        <input value={theme} onChange={(e) => setTheme(e.target.value)} placeholder="Spawned narrative thread" />
      </div>

      <div className="form-field">
        <label>Tone</label>
        <input value={tone} onChange={(e) => setTone(e.target.value)} placeholder="Electric" />
      </div>

      <div className="form-field">
        <label>Room Type</label>
        <select value={roomType} onChange={(e) => setRoomType(e.target.value)}>
          {ROOM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div className="form-field checkbox">
        <label>
          <input type="checkbox" checked={evolves} onChange={(e) => setEvolves(e.target.checked)} />
          Evolves (autonomous AI expansion)
        </label>
      </div>

      {previewSeed && (
        <div className="seed-preview">
          <label>Emergence Seed</label>
          <p className="ai-seed">{previewSeed}</p>
        </div>
      )}

      <button className="btn-spawn" disabled={spawning || !originId || !seedMutation} onClick={handleSpawn}>
        {spawning ? 'Spawning...' : 'Spawn Emergence'}
      </button>

      {spawnResult && (
        <p className="success-msg">
          Room #{spawnResult} spawned from Room #{originId}
        </p>
      )}
      {error && <p className="room-error">{error}</p>}
    </div>
  );
}
