// deltaRoomEngine.ts
import { createEmbedding, summarizePrompt, classifyTone } from './ai-tools';
import { storeEncrypted, pinToIPFS } from './ipfs-tools';

export async function createDeltaRoomMetadata(input: {
  seed: string;
  creator: string;
  toneHint?: string;
}) {
  const aiSeed = await summarizePrompt(input.seed);
  const tone = input.toneHint || await classifyTone(input.seed);

  const metadata = {
    name: `DeltaRoom: ${aiSeed}`,
    description: "An evolving collaborative AI space",
    theme: aiSeed,
    room_type: "DELTA",
    ai_seed: aiSeed,
    tone,
    evolves: true,
    created_by: input.creator,
    timestamp: Date.now(),
    permissions: {
      access: "Public",
      contributors: [input.creator]
    }
  };

  const cid = await pinToIPFS(metadata);
  return { metadata, cid };
}
