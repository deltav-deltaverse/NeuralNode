import React, { useState, useCallback } from 'react';
import { WalletProvider, useWallet } from './wallet/WalletContext';
import WalletConnect from './components/WalletConnect';
import DeltaRoomViewer from './components/DeltaRoomViewer';
import CreateRoom from './components/CreateRoom';
import DraftList from './components/DraftList';
import SpawnRoom from './components/SpawnRoom';
import RoomInteraction from './components/RoomInteraction';
import TraitViewer from './components/TraitViewer';
import LineageTree from './components/LineageTree';
import GovernancePanel from './components/GovernancePanel';
import SeedBrowser from './components/SeedBrowser';
import { type DeltaRoomDraft } from './engine/deltaRoomEngine';
import { AGENT_SEEDS } from './engine/agentSeed';
import './styles/app.css';

type View = 'home' | 'explore' | 'create' | 'spawn' | 'interact' | 'traits' | 'seeds' | 'governance' | 'drafts' | 'agents';

// Contract addresses - update after deployment
const BUBBLE_ROOM_ADDRESS = import.meta.env.VITE_BUBBLE_ROOM_ADDRESS || '';
const ORCHESTRATOR_ADDRESS = import.meta.env.VITE_ORCHESTRATOR_ADDRESS || '';
const SPAWN_ADDRESS = import.meta.env.VITE_SPAWN_ADDRESS || '';
const TRAITS_ADDRESS = import.meta.env.VITE_TRAITS_ADDRESS || '';
const SEED_REGISTRY_ADDRESS = import.meta.env.VITE_SEED_REGISTRY_ADDRESS || '';
const GOVERNANCE_ADDRESS = import.meta.env.VITE_GOVERNANCE_ADDRESS || '';

function AppContent() {
  const { connected } = useWallet();
  const [view, setView] = useState<View>('home');
  const [roomId, setRoomId] = useState('');
  const [selectedDraft, setSelectedDraft] = useState<DeltaRoomDraft | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  return (
    <div className="deltaverse-app">
      <header className="app-header">
        <div className="logo" onClick={() => setView('home')}>
          <h1>DeltaVerse</h1>
          <span className="tagline">BubbleRooms</span>
        </div>
        <nav className="app-nav">
          <button className={view === 'home' ? 'active' : ''} onClick={() => setView('home')}>Home</button>
          <button className={view === 'explore' ? 'active' : ''} onClick={() => setView('explore')}>Explore</button>
          <button className={view === 'create' ? 'active' : ''} onClick={() => setView('create')}>Create</button>
          <button className={view === 'spawn' ? 'active' : ''} onClick={() => setView('spawn')}>Spawn</button>
          <button className={view === 'interact' ? 'active' : ''} onClick={() => setView('interact')}>Interact</button>
          <button className={view === 'traits' ? 'active' : ''} onClick={() => setView('traits')}>Traits</button>
          <button className={view === 'seeds' ? 'active' : ''} onClick={() => setView('seeds')}>Seeds</button>
          <button className={view === 'governance' ? 'active' : ''} onClick={() => setView('governance')}>Govern</button>
          <button className={view === 'drafts' ? 'active' : ''} onClick={() => setView('drafts')}>Drafts</button>
          <button className={view === 'agents' ? 'active' : ''} onClick={() => setView('agents')}>Agents</button>
        </nav>
        <WalletConnect />
      </header>

      <main className="app-main">
        {view === 'home' && (
          <div className="home-view">
            <div className="hero">
              <h2>The Living Imaginarium</h2>
              <p>
                DeltaVerse is a decentralized, AI-symbiotic metaverse architecture powered by
                NFTs, smart contracts, narrative evolution, and participant-driven worldbuilding.
              </p>
              <p>
                At its heart lies the <strong>BubbleRoomV4</strong> engine — minting interactive,
                tone-responsive spaces — and the <strong>DeltaGenesisSBT</strong> soulbound tokens —
                cryptographic proof of mythic participation.
              </p>
            </div>
            <div className="room-types-grid">
              {[
                { type: 'DELTA', desc: 'AI-reactive, tone-sensitive, semantically adaptive' },
                { type: 'VAULT', desc: 'Encrypted memory spheres with AI-generated content' },
                { type: 'LIVING', desc: 'Persistent community narrative epicenters' },
                { type: 'SIGNAL', desc: 'Machine-coordination nodes for agent logic' },
                { type: 'TIMELOCKED', desc: 'Unlocks in the future for rituals and reveals' },
                { type: 'EPHEMERAL', desc: 'Momentary co-creation bursts that vanish after impact' },
              ].map(({ type, desc }) => (
                <div key={type} className={`room-type-card type-${type.toLowerCase()}`}>
                  <h3>{type}</h3>
                  <p>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'explore' && (
          <div className="explore-view">
            <h2>Explore BubbleRooms</h2>
            <div className="room-search">
              <input
                type="number"
                placeholder="Enter Room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                min="1"
              />
            </div>
            {roomId && Number(roomId) > 0 && connected && (
              <DeltaRoomViewer
                roomId={Number(roomId)}
                bubbleRoomAddress={BUBBLE_ROOM_ADDRESS}
                orchestratorAddress={ORCHESTRATOR_ADDRESS}
              />
            )}
            {!connected && <p className="connect-prompt">Connect wallet to explore rooms on-chain.</p>}
          </div>
        )}

        {view === 'create' && (
          <div className="create-view">
            <CreateRoom
              orchestratorAddress={ORCHESTRATOR_ADDRESS}
              onDraftCreated={(draft) => {
                setSelectedDraft(draft);
                setView('drafts');
                refresh();
              }}
            />
          </div>
        )}

        {view === 'spawn' && (
          <div className="spawn-view">
            <SpawnRoom
              bubbleRoomAddress={BUBBLE_ROOM_ADDRESS}
              spawnAddress={SPAWN_ADDRESS}
            />
          </div>
        )}

        {view === 'interact' && (
          <div className="interact-view">
            <RoomInteraction
              bubbleRoomAddress={BUBBLE_ROOM_ADDRESS}
              spawnAddress={SPAWN_ADDRESS}
            />
          </div>
        )}

        {view === 'traits' && (
          <div className="traits-view">
            <h2>Emergence Traits</h2>
            <p className="view-desc">
              Traits emerge through Lineage. Intelligence, Knowledge, Wisdom, Resonance,
              Adaptability, Coherence — earned, never assigned.
            </p>
            <div className="traits-layout">
              <div className="traits-inspect">
                <div className="form-field">
                  <label>Room ID</label>
                  <input type="number" value={roomId} onChange={(e) => setRoomId(e.target.value)}
                    placeholder="Enter room ID" min="1" />
                </div>
                {roomId && Number(roomId) > 0 && connected && (
                  <TraitViewer roomId={Number(roomId)} traitsAddress={TRAITS_ADDRESS} />
                )}
              </div>
              <div className="lineage-inspect">
                {roomId && Number(roomId) > 0 && connected && (
                  <LineageTree
                    rootRoomId={Number(roomId)}
                    bubbleRoomAddress={BUBBLE_ROOM_ADDRESS}
                    spawnAddress={SPAWN_ADDRESS}
                  />
                )}
              </div>
            </div>
            {!connected && <p className="connect-prompt">Connect wallet to view room traits.</p>}
          </div>
        )}

        {view === 'seeds' && (
          <div className="seeds-view">
            <SeedBrowser seedRegistryAddress={SEED_REGISTRY_ADDRESS} />
          </div>
        )}

        {view === 'governance' && (
          <div className="governance-view">
            <GovernancePanel governanceAddress={GOVERNANCE_ADDRESS} />
          </div>
        )}

        {view === 'drafts' && (
          <div className="drafts-view">
            <h2>Your Drafts</h2>
            {selectedDraft && (
              <DeltaRoomViewer
                draft={selectedDraft}
                bubbleRoomAddress={BUBBLE_ROOM_ADDRESS}
                orchestratorAddress={ORCHESTRATOR_ADDRESS}
                onMinted={() => {
                  setSelectedDraft(null);
                  refresh();
                }}
              />
            )}
            <DraftList
              key={refreshKey}
              onSelect={setSelectedDraft}
              onRefresh={refresh}
            />
          </div>
        )}

        {view === 'agents' && (
          <div className="agents-view">
            <h2>DeltaVerse Agent Network</h2>
            <div className="agent-grid">
              <div className="agent-card">
                <h3>DeltaVerse</h3>
                <p className="agent-role">Architectural Vision</p>
                <p>funAGI + RAGE + MASTERMIND integration layer. The Trinity that powers consciousness, retrieval, and orchestration.</p>
              </div>
              <div className="agent-card">
                <h3>Builder</h3>
                <p className="agent-role">Infrastructure Constructor</p>
                <p>Ground zero deployment, identity management, resource mapping across 6 GitHub organizations (~430+ repos).</p>
              </div>
              <div className="agent-card">
                <h3>Chronos</h3>
                <p className="agent-role">Sequential Time Keeper</p>
                <p>Sustained operations, rhythm, compounding. Builds capacity through patient accumulation.</p>
              </div>
              <div className="agent-card">
                <h3>Kairos</h3>
                <p className="agent-role">Temporal Strategist</p>
                <p>Recognizes opportune moments. Distinguishes chronos from kairos. Acts when conditions converge.</p>
              </div>
            </div>
            <div className="agent-seeds-section">
              <h3>Agent Seeds</h3>
              <p className="seeds-desc">
                Seeds are the generative DNA of every agent. They propagate through spawn,
                mutate through interaction, and evolve through swarm consensus.
              </p>
              {Object.entries(AGENT_SEEDS).map(([key, seed]) => (
                <div key={key} className="seed-card">
                  <div className="seed-header">
                    <strong>{key}</strong>
                    <span className={`wisdom-badge wisdom-${seed.wisdomClass.toLowerCase()}`}>
                      {seed.wisdomClass}
                    </span>
                  </div>
                  <p className="seed-prompt">{seed.prompt}</p>
                  <div className="trait-bars">
                    {Object.entries(seed.traits).filter(([k]) => k !== 'wisdom').map(([trait, value]) => (
                      <div key={trait} className="trait-row">
                        <span className="trait-name">{trait}</span>
                        <div className="trait-bar">
                          <div className="trait-fill" style={{ width: `${value}%` }} />
                        </div>
                        <span className="trait-value">{value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="seed-meta">
                    <span>Tone: {seed.tone}</span>
                    <span>Evolves: {seed.evolves ? 'Yes' : 'No'}</span>
                    {seed.lineage.length > 0 && (
                      <span>Lineage: {seed.lineage.length} deep</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="ecosystem-info">
              <h3>Ecosystem</h3>
              <ul>
                <li><strong>deltav-deltaverse</strong> — Core: AI agents, 3D, NFT, Unity, LayerZero</li>
                <li><strong>deltabridge</strong> — Cross-chain bridges, DEX, IBC, OmniBridge</li>
                <li><strong>deltastorage</strong> — IPFS, Zilliqa, domains, decentralized web</li>
                <li><strong>deltaloans</strong> — DeFi lending, flash loans, Aave, vaults</li>
                <li><strong>DeltaVD</strong> — Cesium, WebGL, Three.js, Unreal, glTF</li>
                <li><strong>DeltaVerseDAO</strong> — DAO governance, multisig, voting</li>
              </ul>
              <p className="thrust-info">
                THRUST Token: <code>0x969F60Bfe17962E0f061B434596545C7b6Cd6Fc4</code>
              </p>
            </div>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <span>&copy; DeltaV THRUST 2025 — Professor Codephreak</span>
        <span className="footer-links">
          <a href="https://github.com/deltav-deltaverse" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://medium.com/@deltaverse" target="_blank" rel="noopener noreferrer">Medium</a>
          <a href="https://unstoppabledomains.com/d/deltaverse.dao" target="_blank" rel="noopener noreferrer">deltaverse.dao</a>
        </span>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <WalletProvider>
      <AppContent />
    </WalletProvider>
  );
}
