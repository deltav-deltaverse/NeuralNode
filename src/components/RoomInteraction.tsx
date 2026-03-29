import React, { useState, useEffect } from 'react';
import { Contract } from 'ethers';
import { useWallet } from '../wallet/WalletContext';
import SpawnABI from '../abis/BubbleRoomSpawn.json';
import BubbleRoomABI from '../abis/BubbleRoomV4.json';
import { composeSeedFromInteraction, defaultTraits, type AgentSeed } from '../engine/agentSeed';

interface Props {
  bubbleRoomAddress: string;
  spawnAddress: string;
}

interface RoomSeedData {
  aiSeed: string;
  tone: string;
  evolves: boolean;
}

export default function RoomInteraction({ bubbleRoomAddress, spawnAddress }: Props) {
  const { signer, address } = useWallet();
  const [roomA, setRoomA] = useState('');
  const [roomB, setRoomB] = useState('');
  const [seedA, setSeedA] = useState<RoomSeedData | null>(null);
  const [seedB, setSeedB] = useState<RoomSeedData | null>(null);
  const [interactionContext, setInteractionContext] = useState('');
  const [composedSeed, setComposedSeed] = useState<string>('');
  const [history, setHistory] = useState<string[]>([]);
  const [lineageTree, setSpawnTree] = useState<string[]>([]);
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch room seeds
  useEffect(() => {
    if (!signer || !bubbleRoomAddress) return;
    const contract = new Contract(bubbleRoomAddress, BubbleRoomABI, signer);

    if (roomA && Number(roomA) > 0) {
      contract.getRoomAI(Number(roomA)).then(
        ([aiSeed, tone, evolves]: [string, string, boolean]) => setSeedA({ aiSeed, tone, evolves }),
        () => setSeedA(null),
      );
    }
    if (roomB && Number(roomB) > 0) {
      contract.getRoomAI(Number(roomB)).then(
        ([aiSeed, tone, evolves]: [string, string, boolean]) => setSeedB({ aiSeed, tone, evolves }),
        () => setSeedB(null),
      );
    }
  }, [roomA, roomB, signer, bubbleRoomAddress]);

  // Compose seed preview when both rooms and context are set
  useEffect(() => {
    if (!seedA || !seedB || !interactionContext) {
      setComposedSeed('');
      return;
    }
    const agentA: AgentSeed = {
      id: `room:${roomA}`, prompt: seedA.aiSeed, tone: seedA.tone,
      evolves: seedA.evolves, mutations: [], lineage: [], spawnCount: 0, wisdomClass: 'EMERGENT', traits: defaultTraits(),
    };
    const agentB: AgentSeed = {
      id: `room:${roomB}`, prompt: seedB.aiSeed, tone: seedB.tone,
      evolves: seedB.evolves, mutations: [], lineage: [], spawnCount: 0, wisdomClass: 'EMERGENT', traits: defaultTraits(),
    };
    const composed = composeSeedFromInteraction(agentA, agentB, interactionContext);
    setComposedSeed(composed.prompt);
  }, [seedA, seedB, interactionContext, roomA, roomB]);

  // Fetch interaction history and spawn tree
  useEffect(() => {
    if (!signer || !spawnAddress || !roomA) return;
    const spawn = new Contract(spawnAddress, SpawnABI, signer);

    if (roomA && roomB) {
      spawn.getInteractionHistory(Number(roomA), Number(roomB))
        .then((h: string[]) => setHistory(h))
        .catch(() => setHistory([]));
    }

    spawn.getLineageTree(Number(roomA))
      .then((tree: bigint[]) => setSpawnTree(tree.map(String)))
      .catch(() => setSpawnTree([]));
  }, [roomA, roomB, signer, spawnAddress]);

  const handleRecordInteraction = async () => {
    if (!signer || !spawnAddress || !roomA || !roomB || !interactionContext) return;
    setRecording(true);
    setError(null);

    try {
      const spawn = new Contract(spawnAddress, SpawnABI, signer);
      // In production, upload interactionContext to IPFS and use CID
      const tx = await spawn.recordInteraction(
        Number(roomA),
        Number(roomB),
        interactionContext, // would be IPFS CID in production
      );
      await tx.wait();
      setHistory((prev) => [...prev, interactionContext]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to record');
    }
    setRecording(false);
  };

  if (!address) {
    return <p className="connect-prompt">Connect wallet to interact between BubbleRooms.</p>;
  }

  return (
    <div className="room-interaction">
      <h2>Room-to-Room Interaction</h2>
      <p className="interaction-desc">
        Link two BubbleRooms through Interaction. Their Seeds compose into a new
        semantic entity — the Convergence creates Wisdom greater than either Origin alone.
      </p>

      <div className="interaction-pair">
        <div className="form-field">
          <label>Room A</label>
          <input type="number" value={roomA} onChange={(e) => setRoomA(e.target.value)} placeholder="Room ID" min="1" />
          {seedA && <p className="ai-seed-inline">{seedA.aiSeed}</p>}
        </div>

        <div className="interaction-arrow">&#x2194;</div>

        <div className="form-field">
          <label>Room B</label>
          <input type="number" value={roomB} onChange={(e) => setRoomB(e.target.value)} placeholder="Room ID" min="1" />
          {seedB && <p className="ai-seed-inline">{seedB.aiSeed}</p>}
        </div>
      </div>

      <div className="form-field">
        <label>Interaction Context</label>
        <textarea
          value={interactionContext}
          onChange={(e) => setInteractionContext(e.target.value)}
          placeholder="Describe how these rooms interact... The seeds merge, creating a new understanding."
          rows={4}
        />
      </div>

      {composedSeed && (
        <div className="composed-seed-preview">
          <label>Composed Interaction Seed</label>
          <pre className="ai-seed">{composedSeed}</pre>
        </div>
      )}

      <button
        className="btn-interact"
        disabled={recording || !roomA || !roomB || !interactionContext}
        onClick={handleRecordInteraction}
      >
        {recording ? 'Recording...' : 'Record Interaction On-Chain'}
      </button>

      {lineageTree.length > 0 && (
        <div className="lineage-display">
          <h3>Lineage (Origin #{roomA})</h3>
          <div className="lineage-nodes">
            {lineageTree.map((childId) => (
              <span key={childId} className="lineage-node">#{childId}</span>
            ))}
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="interaction-history">
          <h3>Interaction History</h3>
          {history.map((entry, i) => (
            <div key={i} className="history-entry">
              <span className="history-index">#{i + 1}</span>
              <span>{entry}</span>
            </div>
          ))}
        </div>
      )}

      {error && <p className="room-error">{error}</p>}
    </div>
  );
}
