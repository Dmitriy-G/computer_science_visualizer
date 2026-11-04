import { ExtendedTreeAnimation } from '../../../../../visualization/ExtendedTreeAnimation.ts'
import type { AdditionalTreeModel, TreeInputValues } from '../../../../../visualization/AdditionalTreeModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { MerkleTreeLayout } from '../MerkleTreeLayout.ts'
export class ClearAnimation extends ExtendedTreeAnimation {
  public static readonly title = 'Clear (reset to zero)'
  public static readonly summary = 'Reset all ten indexed values to zero; discard old versions or recompute hashes.'
  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', explanation: 'Initialize n zero-valued leaves and recompute all internal sums or hashes. Persistent reset allocates a fresh tree and discards prior versions; Merkle reset reuses its hash-array slots.' },
      memory: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', explanation: 'Storage includes the explicit traversal stack and returned output, where applicable. Playback clones and scene snapshots are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Original element count for this run: n = ${size}.` },
        { symbol: 'O(n)', meaning: 'Linear work or additional storage.' },
      ],
    }
  }
  constructor(model: AdditionalTreeModel, input: TreeInputValues = {}) {
    super(model, new MerkleTreeLayout(), 'clear', input, ClearAnimation.title, ClearAnimation.summary)
  }
}
