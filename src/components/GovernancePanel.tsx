import React, { useState } from 'react';
import { Contract } from 'ethers';
import { useWallet } from '../wallet/WalletContext';
import GovernanceABI from '../abis/SwarmGovernance.json';

const PROPOSAL_TYPES = ['SPAWN', 'MUTATE', 'INTERACT', 'GOVERN', 'CUSTOM'] as const;

interface Props {
  governanceAddress: string;
}

export default function GovernancePanel({ governanceAddress }: Props) {
  const { signer, address } = useWallet();
  const [roomId, setRoomId] = useState('');
  const [proposalType, setProposalType] = useState(0);
  const [description, setDescription] = useState('');
  const [votingHours, setVotingHours] = useState(24);
  const [creating, setCreating] = useState(false);

  const [voteProposalId, setVoteProposalId] = useState('');
  const [voting, setVoting] = useState(false);

  const [resolveId, setResolveId] = useState('');
  const [resolving, setResolving] = useState(false);

  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getContract = () => {
    if (!signer || !governanceAddress) return null;
    return new Contract(governanceAddress, GovernanceABI, signer);
  };

  const handleCreate = async () => {
    const gov = getContract();
    if (!gov || !roomId) return;
    setCreating(true);
    setError(null);
    setResult(null);
    try {
      const period = votingHours * 3600;
      const tx = await gov.createProposal(
        Number(roomId), proposalType, description, '', period,
      );
      const receipt = await tx.wait();
      setResult(`Proposal created. TX: ${receipt.hash.slice(0, 12)}...`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed');
    }
    setCreating(false);
  };

  const handleVote = async (inFavor: boolean) => {
    const gov = getContract();
    if (!gov || !voteProposalId) return;
    setVoting(true);
    setError(null);
    setResult(null);
    try {
      const tx = await gov.vote(Number(voteProposalId), inFavor);
      await tx.wait();
      setResult(`Vote recorded: ${inFavor ? 'FOR' : 'AGAINST'}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Vote failed');
    }
    setVoting(false);
  };

  const handleResolve = async () => {
    const gov = getContract();
    if (!gov || !resolveId) return;
    setResolving(true);
    setError(null);
    setResult(null);
    try {
      const tx = await gov.resolve(Number(resolveId));
      await tx.wait();
      setResult('Proposal resolved.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Resolve failed');
    }
    setResolving(false);
  };

  if (!address) return <p className="connect-prompt">Connect wallet for Swarm Governance.</p>;

  return (
    <div className="governance-panel">
      <h2>Swarm Governance</h2>

      <div className="gov-section">
        <h3>Create Proposal</h3>
        <div className="gov-form">
          <div className="form-field">
            <label>Room ID</label>
            <input type="number" value={roomId} onChange={(e) => setRoomId(e.target.value)} min="1" />
          </div>
          <div className="form-field">
            <label>Type</label>
            <select value={proposalType} onChange={(e) => setProposalType(Number(e.target.value))}>
              {PROPOSAL_TYPES.map((t, i) => <option key={t} value={i}>{t}</option>)}
            </select>
          </div>
          <div className="form-field">
            <label>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder="Propose to the Swarm..." rows={2} />
          </div>
          <div className="form-field">
            <label>Voting Period (hours)</label>
            <input type="number" value={votingHours} onChange={(e) => setVotingHours(Number(e.target.value))}
              min="1" max="720" />
          </div>
          <button className="btn-govern" disabled={creating || !roomId || !description} onClick={handleCreate}>
            {creating ? 'Creating...' : 'Create Proposal'}
          </button>
        </div>
      </div>

      <div className="gov-section">
        <h3>Vote</h3>
        <div className="gov-form gov-inline">
          <div className="form-field">
            <label>Proposal ID</label>
            <input type="number" value={voteProposalId} onChange={(e) => setVoteProposalId(e.target.value)} min="1" />
          </div>
          <div className="vote-buttons">
            <button className="btn-vote-for" disabled={voting || !voteProposalId}
              onClick={() => handleVote(true)}>FOR</button>
            <button className="btn-vote-against" disabled={voting || !voteProposalId}
              onClick={() => handleVote(false)}>AGAINST</button>
          </div>
        </div>
      </div>

      <div className="gov-section">
        <h3>Resolve</h3>
        <div className="gov-form gov-inline">
          <div className="form-field">
            <label>Proposal ID</label>
            <input type="number" value={resolveId} onChange={(e) => setResolveId(e.target.value)} min="1" />
          </div>
          <button className="btn-resolve" disabled={resolving || !resolveId} onClick={handleResolve}>
            {resolving ? 'Resolving...' : 'Resolve'}
          </button>
        </div>
      </div>

      {result && <p className="success-msg">{result}</p>}
      {error && <p className="room-error">{error}</p>}
    </div>
  );
}
