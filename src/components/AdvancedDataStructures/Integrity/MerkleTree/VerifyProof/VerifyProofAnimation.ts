import { ExtendedTreeAnimation } from '../../../../../visualization/ExtendedTreeAnimation.ts'
import type { AdditionalTreeModel, TreeInputValues } from '../../../../../visualization/AdditionalTreeModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { MerkleTreeLayout } from '../MerkleTreeLayout.ts'
export class VerifyProofAnimation extends ExtendedTreeAnimation {
  public static readonly title = 'Verify inclusion proof'
  public static readonly summary = 'Use sibling hashes to verify the supplied leaf value against the current root.'
  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)', explanation: 'Hash the chosen leaf, then process one sibling or parent per level of the padded binary tree. SHA-256 uses fixed-size digests and bounded safe-integer leaf encodings, so each hash has constant cost. All valid inputs take the same path length.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Storage includes the explicit traversal stack and returned output, where applicable. Playback clones and scene snapshots are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Original element count for this run: n = ${size}.` },
        { symbol: 'O(log n)', meaning: 'Work or storage proportional to balanced tree height.' },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage.' },
      ],
    }
  }
  constructor(model: AdditionalTreeModel, input: TreeInputValues = {}) {
    super(model, new MerkleTreeLayout(), 'verify-proof', input, VerifyProofAnimation.title, VerifyProofAnimation.summary)
  }
}
