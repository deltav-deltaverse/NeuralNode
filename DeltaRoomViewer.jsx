import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import abi from '../abi/BubbleRoomV4.json'; // ABI for BubbleRoomV4
// Orchestrator ABI import assumed as orchestratorAbi

const CONTRACT_ADDRESS = '0xYourBubbleRoomV4Address';
const ORCHESTRATOR_ADDRESS = '0xYourOrchestratorAddress';

const DeltaRoomViewer = ({ roomId, draft, provider }) => {
  const [roomData, setRoomData] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [isDraft, setIsDraft] = useState(!!draft);
  const [minting, setMinting] = useState(false);

  let signer, contract, orchestrator;
  if (provider && !isDraft) {
    signer = provider.getSigner();
    contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
  }
  if (provider) {
    signer = provider.getSigner();
    // You should provide orchestrator ABI (for demo, use relevant fragment)
    const orchestratorAbi = [
      "function mintFromSignature(string,string,string,address[],uint8[],bool,bool,bool,uint8,uint256,string,bool,string,string,bool,bytes)"
    ];
    orchestrator = new ethers.Contract(ORCHESTRATOR_ADDRESS, orchestratorAbi, signer);
  }

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

  const mintDraftToChain = async () => {
    if (!draft || !provider) return alert("No draft or provider!");
    setMinting(true);
    // Map roles for Solidity contract (Role: NONE=0, MEMBER=1, AGENT=2, MODERATOR=3)
    const roleMap = { NONE: 0, MEMBER: 1, AGENT: 2, MODERATOR: 3 };
    const roles = draft.roles.map(r => roleMap[r.toUpperCase()] ?? 0);

    try {
      // Use 9 for RoomType.DELTA in BubbleRoomV4
      const tx = await orchestrator.mintFromSignature(
        draft.metadataURI || "", // or IPFS metadata URI if uploaded
        draft.theme,
        draft.originEvent,
        draft.participants,
        roles,
        false, // isPrivate
        false, // isStable
        false, // isSoulbound
        9,     // roomType: DELTA
        draft.unlockTime,
        draft.storageCID,
        false, // isEncryptedStorage
        draft.aiSeed,
        draft.tone,
        draft.evolves,
        draft.signature
      );
      await tx.wait();
      alert("Room minted to chain!");
      setIsDraft(false);
      // Optionally: Refresh to on-chain state
    } catch (e) {
      alert("Mint failed: " + (e?.message || e));
    }
    setMinting(false);
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
        <button disabled={minting} onClick={mintDraftToChain}>
          {minting ? "Minting..." : "Mint to Chain"}
        </button>
      )}
    </div>
  );
};

export default DeltaRoomViewer;
