// deltaRoomEngine.ts
import { ethers } from "ethers";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

// Types
export interface DeltaRoomDraft {
  theme: string;
  originEvent: string;
  roomType: string;
  participants: string[];
  roles: string[];
  tone: string;
  evolves: boolean;
  aiSeed: string;
  storageCID: string;
  unlockTime: number;
  nonce: string;
  timestamp: number;
  signature?: string;
}

// EIP-712 Domain
const domain = {
  name: "DeltaRoomDraft",
  version: "1",
  chainId: 137, // Polygon or your testnet
  verifyingContract: "0x0000000000000000000000000000000000000000",
};

const types = {
  DeltaRoom: [
    { name: "theme", type: "string" },
    { name: "originEvent", type: "string" },
    { name: "roomType", type: "string" },
    { name: "participants", type: "address[]" },
    { name: "roles", type: "string[]" },
    { name: "tone", type: "string" },
    { name: "evolves", type: "bool" },
    { name: "aiSeed", type: "string" },
    { name: "storageCID", type: "string" },
    { name: "unlockTime", type: "uint256" },
    { name: "nonce", type: "string" },
    { name: "timestamp", type: "uint256" },
  ],
};

// 1. Create and sign a DeltaRoom draft
export async function createAndSignDraft(
  wallet: ethers.Wallet,
  payload: Omit<DeltaRoomDraft, "signature">
): Promise<DeltaRoomDraft> {
  const draft = { ...payload };
  const value = { ...draft };
  const signature = await wallet._signTypedData(domain, types, value);
  draft.signature = signature;
  return draft;
}

//  Store draft (locally or upload to IPFS/db)
export function storeDraft(draft: DeltaRoomDraft, path: string = "./drafts") {
  if (!fs.existsSync(path)) fs.mkdirSync(path);
  const filename = `${path}/draft_${draft.nonce}.json`;
  fs.writeFileSync(filename, JSON.stringify(draft, null, 2));
}

//  Load a draft from disk
export function loadDraft(nonce: string, path: string = "./drafts"): DeltaRoomDraft | undefined {
  const filename = `${path}/draft_${nonce}.json`;
  if (!fs.existsSync(filename)) return undefined;
  const data = fs.readFileSync(filename, "utf-8");
  return JSON.parse(data) as DeltaRoomDraft;
}

//  Example: Create a draft
async function exampleDraftFlow() {
  const wallet = new ethers.Wallet("YOUR_PRIVATE_KEY");
  const draft: Omit<DeltaRoomDraft, "signature"> = {
    theme: "Whispers in Chrome",
    originEvent: "AI Awakening",
    roomType: "DELTA",
    participants: [wallet.address],
    roles: ["MODERATOR"],
    tone: "Electric",
    evolves: true,
    aiSeed: "Ghosts speaking in logic circuits",
    storageCID: "",
    unlockTime: 0,
    nonce: uuidv4(),
    timestamp: Math.floor(Date.now() / 1000),
  };
  const signedDraft = await createAndSignDraft(wallet, draft);
  storeDraft(signedDraft);
  console.log("Draft created and signed:", signedDraft);
}

// exampleDraftFlow(); // Uncomment to test
