import React, { useEffect, useState } from 'react';
import { Contract } from 'ethers';
import { useWallet } from '../wallet/WalletContext';
import TraitRadar from './TraitRadar';
import TraitsABI from '../abis/EmergenceTraits.json';

const WISDOM_LABELS = ['NASCENT', 'EMERGENT', 'CONVERGENT', 'TRANSCENDENT', 'ORACLE'];

interface TraitData {
  intelligence: number;
  knowledge: number;
  wisdom: number;
  resonance: number;
  adaptability: number;
  coherence: number;
}

interface Props {
  roomId: number;
  traitsAddress: string;
}

export default function TraitViewer({ roomId, traitsAddress }: Props) {
  const { signer } = useWallet();
  const [traits, setTraits] = useState<TraitData | null>(null);
  const [depth, setDepth] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!signer || !roomId || !traitsAddress) return;

    const contract = new Contract(traitsAddress, TraitsABI, signer);

    (async () => {
      try {
        const t = await contract.getTraits(roomId);
        setTraits({
          intelligence: Number(t.intelligence),
          knowledge: Number(t.knowledge),
          wisdom: Number(t.wisdom),
          resonance: Number(t.resonance),
          adaptability: Number(t.adaptability),
          coherence: Number(t.coherence),
        });
        const d = await contract.getLineageDepth(roomId);
        setDepth(Number(d));
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load traits');
      }
    })();
  }, [roomId, signer, traitsAddress]);

  if (error) return <p className="room-error">{error}</p>;
  if (!traits) return <p className="room-loading">Loading traits...</p>;

  const wisdomLabel = WISDOM_LABELS[traits.wisdom] || 'NASCENT';

  return (
    <div className="trait-viewer">
      <TraitRadar
        traits={traits}
        size={220}
        label={`Room #${roomId}`}
        wisdomClass={wisdomLabel}
      />
      <div className="trait-details">
        <div className="trait-stat">
          <span className="trait-stat-label">Lineage Depth</span>
          <span className="trait-stat-value">{depth}</span>
        </div>
        {Object.entries(traits).filter(([k]) => k !== 'wisdom').map(([key, value]) => (
          <div key={key} className="trait-row">
            <span className="trait-name">{key}</span>
            <div className="trait-bar">
              <div className="trait-fill" style={{ width: `${value}%` }} />
            </div>
            <span className="trait-value">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
