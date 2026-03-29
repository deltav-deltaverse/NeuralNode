import React from 'react';
import { loadAllDrafts, deleteDraft, type DeltaRoomDraft } from '../engine/deltaRoomEngine';

interface Props {
  onSelect: (draft: DeltaRoomDraft) => void;
  onRefresh: () => void;
}

export default function DraftList({ onSelect, onRefresh }: Props) {
  const drafts = loadAllDrafts();
  const entries = Object.values(drafts);

  if (entries.length === 0) {
    return <p className="no-drafts">No drafts saved. Create a BubbleRoom to get started.</p>;
  }

  return (
    <div className="draft-list">
      <h3>Saved Drafts ({entries.length})</h3>
      {entries.map((draft) => (
        <div key={draft.nonce} className="draft-card">
          <div className="draft-header">
            <strong>{draft.theme || 'Untitled'}</strong>
            <span className="draft-type">{draft.roomType}</span>
          </div>
          <p className="draft-seed">{draft.aiSeed || 'No AI seed'}</p>
          <p className="draft-tone">Tone: {draft.tone || 'None'} | Evolves: {draft.evolves ? 'Yes' : 'No'}</p>
          <div className="draft-actions">
            <button onClick={() => onSelect(draft)}>View / Mint</button>
            <button
              className="btn-delete"
              onClick={() => {
                deleteDraft(draft.nonce);
                onRefresh();
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
