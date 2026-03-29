import React, { useState } from 'react';
import { useWallet } from '../wallet/WalletContext';
import {
  createDefaultDraft,
  createAndSignDraft,
  storeDraft,
  ROOM_TYPES,
  type DeltaRoomDraft,
} from '../engine/deltaRoomEngine';

interface Props {
  orchestratorAddress: string;
  onDraftCreated?: (draft: DeltaRoomDraft) => void;
}

export default function CreateRoom({ orchestratorAddress, onDraftCreated }: Props) {
  const { signer, address, chainId } = useWallet();
  const [theme, setTheme] = useState('');
  const [originEvent, setOriginEvent] = useState('');
  const [roomType, setRoomType] = useState('DELTA');
  const [aiSeed, setAiSeed] = useState('');
  const [tone, setTone] = useState('');
  const [evolves, setEvolves] = useState(true);
  const [signing, setSigning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleCreate = async () => {
    if (!signer || !address) return;
    setSigning(true);
    setError(null);
    setSuccess(false);

    try {
      const draft = createDefaultDraft(address);
      draft.theme = theme;
      draft.originEvent = originEvent;
      draft.roomType = roomType;
      draft.aiSeed = aiSeed;
      draft.tone = tone;
      draft.evolves = evolves;

      const signed = await createAndSignDraft(
        signer,
        draft,
        orchestratorAddress,
        chainId || 137,
      );

      storeDraft(signed);
      setSuccess(true);
      onDraftCreated?.(signed);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signing failed');
    }
    setSigning(false);
  };

  if (!address) {
    return <p className="connect-prompt">Connect your wallet to create a BubbleRoom.</p>;
  }

  return (
    <div className="create-room">
      <h2>Create BubbleRoom Draft</h2>

      <div className="form-field">
        <label>Theme</label>
        <input value={theme} onChange={(e) => setTheme(e.target.value)} placeholder="Memory Drift" />
      </div>

      <div className="form-field">
        <label>Origin Event</label>
        <input value={originEvent} onChange={(e) => setOriginEvent(e.target.value)} placeholder="AI Awakening" />
      </div>

      <div className="form-field">
        <label>Room Type</label>
        <select value={roomType} onChange={(e) => setRoomType(e.target.value)}>
          {ROOM_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className="form-field">
        <label>AI Seed</label>
        <textarea
          value={aiSeed}
          onChange={(e) => setAiSeed(e.target.value)}
          placeholder="Ghosts speaking in logic circuits"
          rows={3}
        />
      </div>

      <div className="form-field">
        <label>Tone</label>
        <input value={tone} onChange={(e) => setTone(e.target.value)} placeholder="Surreal" />
      </div>

      <div className="form-field checkbox">
        <label>
          <input type="checkbox" checked={evolves} onChange={(e) => setEvolves(e.target.checked)} />
          Evolves (AI-reactive)
        </label>
      </div>

      <button className="btn-sign" disabled={signing || !theme} onClick={handleCreate}>
        {signing ? 'Signing Draft...' : 'Sign & Save Draft (Gasless)'}
      </button>

      {success && <p className="success-msg">Draft created and signed. Ready to mint.</p>}
      {error && <p className="room-error">{error}</p>}
    </div>
  );
}
