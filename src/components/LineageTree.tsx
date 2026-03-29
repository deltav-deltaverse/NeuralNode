import React, { useEffect, useState } from 'react';
import { Contract } from 'ethers';
import { useWallet } from '../wallet/WalletContext';
import SpawnABI from '../abis/BubbleRoomSpawn.json';
import BubbleRoomABI from '../abis/BubbleRoomV4.json';

interface TreeNode {
  roomId: number;
  aiSeed: string;
  tone: string;
  children: TreeNode[];
}

interface Props {
  rootRoomId: number;
  bubbleRoomAddress: string;
  spawnAddress: string;
  maxDepth?: number;
}

export default function LineageTree({
  rootRoomId,
  bubbleRoomAddress,
  spawnAddress,
  maxDepth = 5,
}: Props) {
  const { signer } = useWallet();
  const [tree, setTree] = useState<TreeNode | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!signer || !rootRoomId || !bubbleRoomAddress || !spawnAddress) return;

    const roomContract = new Contract(bubbleRoomAddress, BubbleRoomABI, signer);
    const spawnContract = new Contract(spawnAddress, SpawnABI, signer);

    async function buildTree(roomId: number, depth: number): Promise<TreeNode> {
      const [aiSeed, tone] = await roomContract.getRoomAI(roomId);
      const node: TreeNode = { roomId, aiSeed, tone, children: [] };

      if (depth < maxDepth) {
        try {
          const childIds: bigint[] = await spawnContract.getLineageTree(roomId);
          for (const childId of childIds) {
            const child = await buildTree(Number(childId), depth + 1);
            node.children.push(child);
          }
        } catch {
          // No children or contract not deployed
        }
      }
      return node;
    }

    setLoading(true);
    setError(null);
    buildTree(rootRoomId, 0)
      .then(setTree)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to build tree'))
      .finally(() => setLoading(false));
  }, [rootRoomId, signer, bubbleRoomAddress, spawnAddress, maxDepth]);

  if (loading) return <div className="tree-loading">Building Lineage tree...</div>;
  if (error) return <div className="room-error">{error}</div>;
  if (!tree) return <div className="tree-empty">Enter a root room ID to visualize its Lineage.</div>;

  return (
    <div className="lineage-tree-viz">
      <h3>Lineage Tree</h3>
      <div className="tree-container">
        <TreeNodeViz node={tree} depth={0} />
      </div>
    </div>
  );
}

function TreeNodeViz({ node, depth }: { node: TreeNode; depth: number }) {
  const indent = depth * 24;
  const toneClass = node.tone?.toLowerCase().replace(/\s+/g, '-') || 'default';
  const seedPreview = node.aiSeed.length > 60
    ? node.aiSeed.slice(0, 60) + '...'
    : node.aiSeed;

  return (
    <div className="tree-node-group">
      <div className="tree-node" style={{ marginLeft: indent }}>
        <div className="tree-connector">
          {depth > 0 && <span className="tree-branch">{'└─'}</span>}
          <span className={`tree-node-dot tone-dot-${toneClass}`} />
        </div>
        <div className="tree-node-info">
          <span className="tree-room-id">#{node.roomId}</span>
          <span className="tree-node-seed">{seedPreview || 'No seed'}</span>
          <span className="tree-node-tone">{node.tone}</span>
          {node.children.length > 0 && (
            <span className="tree-spawn-count">{node.children.length} emergence{node.children.length > 1 ? 's' : ''}</span>
          )}
        </div>
      </div>
      {node.children.map((child) => (
        <TreeNodeViz key={child.roomId} node={child} depth={depth + 1} />
      ))}
    </div>
  );
}
