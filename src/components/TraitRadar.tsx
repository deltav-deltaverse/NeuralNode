import React from 'react';

interface TraitData {
  intelligence: number;
  knowledge: number;
  resonance: number;
  adaptability: number;
  coherence: number;
}

interface Props {
  traits: TraitData;
  size?: number;
  label?: string;
  wisdomClass?: string;
}

const TRAIT_KEYS: (keyof TraitData)[] = [
  'intelligence', 'knowledge', 'resonance', 'adaptability', 'coherence',
];

const TRAIT_COLORS: Record<string, string> = {
  intelligence: '#4a7dff',
  knowledge: '#00d4ff',
  resonance: '#ff6a3d',
  adaptability: '#9d4edd',
  coherence: '#00cc88',
};

export default function TraitRadar({ traits, size = 200, label, wisdomClass }: Props) {
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.38;
  const n = TRAIT_KEYS.length;
  const angleStep = (2 * Math.PI) / n;

  // Grid rings at 25, 50, 75, 100
  const rings = [25, 50, 75, 100];

  // Calculate points for the trait polygon
  const points = TRAIT_KEYS.map((key, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const r = (traits[key] / 100) * maxR;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });

  const polygonPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + ' Z';

  // Axis endpoints
  const axes = TRAIT_KEYS.map((_, i) => {
    const angle = i * angleStep - Math.PI / 2;
    return {
      x: cx + maxR * Math.cos(angle),
      y: cy + maxR * Math.sin(angle),
    };
  });

  // Label positions (slightly beyond axes)
  const labels = TRAIT_KEYS.map((key, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const lr = maxR + 18;
    return {
      x: cx + lr * Math.cos(angle),
      y: cy + lr * Math.sin(angle),
      key,
      value: traits[key],
    };
  });

  return (
    <div className="trait-radar-container">
      {label && (
        <div className="radar-header">
          <span className="radar-label">{label}</span>
          {wisdomClass && (
            <span className={`wisdom-badge wisdom-${wisdomClass.toLowerCase()}`}>
              {wisdomClass}
            </span>
          )}
        </div>
      )}
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="trait-radar">
        {/* Grid rings */}
        {rings.map((ring) => (
          <polygon
            key={ring}
            points={TRAIT_KEYS.map((_, i) => {
              const angle = i * angleStep - Math.PI / 2;
              const r = (ring / 100) * maxR;
              return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
            }).join(' ')}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
          />
        ))}

        {/* Axes */}
        {axes.map((a, i) => (
          <line key={i} x1={cx} y1={cy} x2={a.x} y2={a.y}
            stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
        ))}

        {/* Trait polygon */}
        <path d={polygonPath} fill="rgba(0,212,255,0.15)" stroke="#00d4ff" strokeWidth="2" />

        {/* Trait dots */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4"
            fill={TRAIT_COLORS[TRAIT_KEYS[i]]} stroke="#0a0a0f" strokeWidth="1.5" />
        ))}

        {/* Labels */}
        {labels.map((l) => (
          <text key={l.key} x={l.x} y={l.y}
            textAnchor="middle" dominantBaseline="middle"
            fill="rgba(255,255,255,0.6)" fontSize="8" fontFamily="monospace">
            {l.key.slice(0, 5).toUpperCase()} {l.value}
          </text>
        ))}
      </svg>
    </div>
  );
}
