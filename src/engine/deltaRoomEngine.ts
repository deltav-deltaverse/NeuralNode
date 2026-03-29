import { ethers } from 'ethers';

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

export const ROOM_TYPES = [
  'TEMPORARY', 'LIVING', 'EPHEMERAL', 'ARCHIVAL',
  'INCUBATOR', 'SIGNAL', 'STORAGE', 'TIMELOCKED',
  'VAULT', 'DELTA',
] as const;

export const ROLES = ['NONE', 'MEMBER', 'AGENT', 'MODERATOR'] as const;

export const ROLE_MAP: Record<string, number> = {
  NONE: 0, MEMBER: 1, AGENT: 2, MODERATOR: 3,
};

export const ROOM_TYPE_MAP: Record<string, number> = Object.fromEntries(
  ROOM_TYPES.map((t, i) => [t, i])
);

// EIP-712 domain/type for DeltaRoomDraft
export const eip712Domain = (
  verifyingContract = '0x0000000000000000000000000000000000000000',
  chainId = 137,
) => ({
  name: 'DeltaRoomDraft',
  version: '1',
  chainId,
  verifyingContract,
});

export const eip712Types = {
  DeltaRoom: [
    { name: 'theme', type: 'string' },
    { name: 'originEvent', type: 'string' },
    { name: 'roomType', type: 'string' },
    { name: 'participants', type: 'address[]' },
    { name: 'roles', type: 'string[]' },
    { name: 'tone', type: 'string' },
    { name: 'evolves', type: 'bool' },
    { name: 'aiSeed', type: 'string' },
    { name: 'storageCID', type: 'string' },
    { name: 'unlockTime', type: 'uint256' },
    { name: 'nonce', type: 'string' },
    { name: 'timestamp', type: 'uint256' },
  ],
};

export async function createAndSignDraft(
  signer: ethers.Signer,
  payload: Omit<DeltaRoomDraft, 'signature' | 'metadataURI'>,
  verifyingContract?: string,
  chainId?: number,
): Promise<DeltaRoomDraft> {
  const domain = eip712Domain(verifyingContract, chainId);
  const value = { ...payload };
  const signature = await (signer as ethers.JsonRpcSigner).signTypedData(
    domain,
    eip712Types,
    value,
  );
  return { ...payload, signature };
}

export function generateNonce(): string {
  return ethers.hexlify(ethers.randomBytes(16));
}

export function createDefaultDraft(creatorAddress: string): Omit<DeltaRoomDraft, 'signature' | 'metadataURI'> {
  return {
    theme: '',
    originEvent: '',
    roomType: 'DELTA',
    participants: [creatorAddress],
    roles: ['MODERATOR'],
    tone: '',
    evolves: true,
    aiSeed: '',
    storageCID: '',
    unlockTime: 0,
    nonce: generateNonce(),
    timestamp: Math.floor(Date.now() / 1000),
  };
}

// Store draft in browser localStorage
export function storeDraft(draft: DeltaRoomDraft): void {
  const drafts = loadAllDrafts();
  drafts[draft.nonce] = draft;
  localStorage.setItem('deltaverse_drafts', JSON.stringify(drafts));
}

export function loadDraft(nonce: string): DeltaRoomDraft | undefined {
  const drafts = loadAllDrafts();
  return drafts[nonce];
}

export function loadAllDrafts(): Record<string, DeltaRoomDraft> {
  const raw = localStorage.getItem('deltaverse_drafts');
  if (!raw) return {};
  return JSON.parse(raw);
}

export function deleteDraft(nonce: string): void {
  const drafts = loadAllDrafts();
  delete drafts[nonce];
  localStorage.setItem('deltaverse_drafts', JSON.stringify(drafts));
}
