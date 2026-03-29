import React, { useEffect, useState } from 'react';
import { Contract } from 'ethers';
import { useWallet } from '../wallet/WalletContext';
import BubbleRoomABI from '../abis/BubbleRoomV4.json';
import OrchestratorABI from '../abis/DeltaVerseOrchestrator.json';
import { type DeltaRoomDraft, ROLE_MAP } from '../engine/deltaRoomEngine';

interface RoomData {
  theme?: string;
  aiSeed: string;
  tone: string;
  evolves: boolean;
  participants: string[];
  roomType?: string;
  storageCID?: string;
  unlockTime?: number;
}

interface Props {
  roomId?: number;
  draft?: DeltaRoomDraft;
  bubbleRoomAddress: string;
  orchestratorAddress: string;
  onMinted?: () => void;
}

export default function DeltaRoomViewer({
  roomId,
  draft,
  bubbleRoomAddress,
  orchestratorAddress,
  onMinted,
}: Props) {
  const { signer, provider } = useWallet();
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [minting, setMinting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isDraft = !!draft;

  useEffect(() => {
    if (isDraft && draft) {
      setRoomData({
        theme: draft.theme,
        aiSeed: draft.aiSeed,
        tone: draft.tone,
        evolves: draft.evolves,
        participants: draft.participants,
        roomType: draft.roomType,
        storageCID: draft.storageCID,
        unlockTime: draft.unlockTime,
      });
      return;
    }

    if (!signer || !roomId || !bubbleRoomAddress) return;

    const contract = new Contract(bubbleRoomAddress, BubbleRoomABI, signer);

    (async () => {
      try {
        const [aiSeed, tone, evolves] = await contract.getRoomAI(roomId);
        const members = await contract.getRoomParticipants(roomId);
        setRoomData({ aiSeed, tone, evolves, participants: members });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load room');
      }
    })();
  }, [roomId, draft, signer, isDraft, bubbleRoomAddress]);

  const mintDraftToChain = async () => {
    if (!draft || !signer || !orchestratorAddress) return;
    setMinting(true);
    setError(null);

    try {
      const orchestrator = new Contract(orchestratorAddress, OrchestratorABI, signer);
      const roles = draft.roles.map((r) => ROLE_MAP[r.toUpperCase()] ?? 0);

      const tx = await orchestrator.mintFromSignature(
        draft.metadataURI || '',
        draft.theme,
        draft.originEvent,
        draft.participants,
        roles,
        false,
        false,
        false,
        9, // DELTA
        draft.unlockTime,
        draft.storageCID,
        false,
        draft.aiSeed,
        draft.tone,
        draft.evolves,
        draft.signature || '0x',
      );
      await tx.wait();
      onMinted?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Mint failed');
    }
    setMinting(false);
  };

  if (!roomData) {
    return <div className="room-loading">Loading DeltaRoom...</div>;
  }

  const toneClass = roomData.tone?.toLowerCase().replace(/\s+/g, '-') || 'default';

  return (
    <div className={`delta-room tone-${toneClass}`}>
      <h2>
        DeltaRoom {isDraft ? <span className="draft-badge">DRAFT</span> : `#${roomId}`}
      </h2>

      {roomData.theme && (
        <div className="room-field">
          <label>Theme</label>
          <span>{roomData.theme}</span>
        </div>
      )}

      <div className="room-field">
        <label>AI Seed</label>
        <span className="ai-seed">{roomData.aiSeed || 'None'}</span>
      </div>

      <div className="room-field">
        <label>Tone</label>
        <span className="tone-value">{roomData.tone || 'Neutral'}</span>
      </div>

      <div className="room-field">
        <label>Evolves</label>
        <span>{roomData.evolves ? 'Yes' : 'No'}</span>
      </div>

      <div className="room-field">
        <label>Participants</label>
        <span>{roomData.participants.length}</span>
      </div>

      {roomData.participants.length > 0 && (
        <ul className="participant-list">
          {roomData.participants.map((addr, i) => (
            <li key={i} title={addr}>
              {addr.slice(0, 6)}...{addr.slice(-4)}
            </li>
          ))}
        </ul>
      )}

      {isDraft && (
        <button className="btn-mint" disabled={minting} onClick={mintDraftToChain}>
          {minting ? 'Minting...' : 'Mint to Chain'}
        </button>
      )}

      {error && <p className="room-error">{error}</p>}
    </div>
  );
}
