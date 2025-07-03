import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { LitJsSdk } from 'lit-js-sdk'; // Optional for vault decrypt
import abi from '../abi/abi4.json'; // ABI from BubbleRoomV4
import './DeltaRoomViewer.css';

const CONTRACT_ADDRESS = '0xYourBubbleRoomV4Address';

const DeltaRoomViewer = ({ roomId, provider }) => {
  const [roomData, setRoomData] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [vaultAccess, setVaultAccess] = useState(false);
  const [narrative, setNarrative] = useState("Loading...");

  const signer = provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

  const fetchRoom = async () => {
    try {
      const aiMeta = await contract.getRoomAI(roomId);
      const members = await contract.getRoomParticipants(roomId);

      setRoomData({
        aiSeed: aiMeta[0],
        tone: aiMeta[1],
        evolves: aiMeta[2],
      });

      setParticipants(members);

      // Optional: fetch narrative log from IPFS
      const logURI = `https://ipfs.io/ipfs/QmNarrativeCID`; // You'd get this from metadataCID
      const response = await fetch(logURI);
      const json = await response.json();
      setNarrative(json.story || "No narrative log found.");
    } catch (err) {
      console.error(err);
    }
  };

  const requestVaultAccess = async () => {
    // OPTIONAL: integrate Lit protocol to decrypt room vault
    setVaultAccess(true); // Simulate granted
  };

  useEffect(() => {
    fetchRoom();
  }, []);

  if (!roomData) return <div className="room-loading">Loading DeltaRoom...</div>;

  return (
    <div className={`delta-room ${roomData.tone.toLowerCase()}`}>
      <h2>🧠 DeltaRoom #{roomId}</h2>
      <p><strong>AI Seed:</strong> {roomData.aiSeed}</p>
      <p><strong>Tone:</strong> {roomData.tone}</p>
      <p><strong>Evolves:</strong> {roomData.evolves ? "Yes" : "No"}</p>
      <p><strong>Participants:</strong> {participants.length}</p>

      <div className="narrative-log">
        <h3>📜 Narrative Drift Log</h3>
        <pre>{narrative}</pre>
      </div>

      {vaultAccess ? (
        <div className="vault-data">🔐 Vault accessed. Contents decrypted.</div>
      ) : (
        <button onClick={requestVaultAccess}>Request Vault Access</button>
      )}
    </div>
  );
};

export default DeltaRoomViewer;
