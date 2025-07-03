// deltaRoomEngine.ts
import { ethers } from "ethers";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { NFTStorage, File } from "nft.storage"; // For IPFS optional upload

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
  metadataURI?: string;
}

// EIP-712 domain/type for DeltaRoomDraft
export const domain = (
  verifyingContract = "0x0000000000000000000000000000000000000000",
  chainId = 137
) => ({
  name: "DeltaRoomDraft",
  version: "1",
  chainId,
  verifyingContract,
});
export const types = {
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

//  Create and sign a draft DeltaRoom
export async function createAndSignDraft(
  wallet: ethers.Wallet,
  payload: Omit<DeltaRoomDraft, "signature" | "metadataURI">,
  verifyingContract?: string,
  chainId?: number
): Promise<DeltaRoomDraft> {
  const draft = { ...payload };
  const value = { ...draft };
  const signature = await wallet._signTypedData(
    domain(verifyingContract, chainId),
    types,
    value
  );
  return { ...draft, signature };
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

// Upload to IPFS (NFT.storage)
export async function uploadDraftToIPFS(draft: DeltaRoomDraft, nftStorageKey: string): Promise<string> {
  const client = new NFTStorage({ token: nftStorageKey });
  const file = new File([JSON.stringify(draft)], `deltaroom_${draft.nonce}.json`, { type: 'application/json' });
  const cid = await client.storeBlob(file);
  return `ipfs://${cid}`;
}

// Example usage
async function exampleDraftFlow() {
  const wallet = new ethers.Wallet("YOUR_PRIVATE_KEY");
  const draft: Omit<DeltaRoomDraft, "signature" | "metadataURI"> = {
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
  // Optionally upload to IPFS
  // const metadataURI = await uploadDraftToIPFS(signedDraft, process.env.NFT_STORAGE_KEY!);
  // signedDraft.metadataURI = metadataURI;
  console.log("Draft created and signed:", signedDraft);
}

// exampleDraftFlow(); // Uncomment to run
