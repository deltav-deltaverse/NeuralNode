import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import abi from '../abi/BubbleRoomV4.json'; // Replace with ABI path

const CONTRACT_ADDRESS = '0xYourBubbleRoomV4Address';

const DeltaRoomViewer = ({ roomId, draft, provider }) => {
  const [roomData, setRoomData] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [isDraft, setIsDraft] = useState(!!draft);

  // Contract setup
  let signer, contract;
  if (provider && !isDraft) {
    signer = provider.getSigner();
    contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
  }

  // Load onchain room or draft
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
      setParticipants(draft.participants);
    } else if (contract && roomId) {
      // On-chain
      (async () => {
        const [aiSeed, tone, evolves] = await contract.getRoomAI(roomId);
        const members = await contract.getRoomParticipants(roomId);
        setRoomData({
          aiSeed, tone, evolves,
          participants: members,
        });
        setParticipants(members);
      })();
    }
  }, [roomId, draft, contract, isDraft]);

  // Mint draft to chain
  const mintDraftToChain = async () => {
    if (!draft || !signer) return alert("No draft or provider!");
    // This is where you call DeltaVerseOrchestrator.mintFromSignature()
    alert("Mint from signature not implemented in demo!");
    // Example: 
    // const orchestrator = new ethers.Contract('0xOrchestrator', orchestratorAbi, signer);
    // const tx = await orchestrator.mintFromSignature(ethers.utils.toUtf8Bytes(JSON.stringify(draft)), draft.signature);
    // await tx.wait();
  };

  if (!roomData) return <div className="room-loading">Loading DeltaRoom...</div>;

  return (
    <div className={`delta-room ${roomData.tone?.toLowerCase() || "default"}`}>
      <h2>🧠 DeltaRoom {isDraft ? <span>(DRAFT)</span> : `#${roomId}`}</h2>
      <p><strong>Theme:</strong> {roomData.theme}</p>
      <p><strong>AI Seed:</strong> {roomData.aiSeed}</p>
      <p><strong>Tone:</strong> {roomData.tone}</p>
      <p><strong>Evolves:</strong> {roomData.evolves ? "Yes" : "No"}</p>
      <p><strong>Participants:</strong> {(roomData.participants || []).length}</p>
      {isDraft && (
        <button onClick={mintDraftToChain}>Mint to Chain</button>
      )}
      {/* Render more controls as needed */}
    </div>
  );
};

export default DeltaRoomViewer;
