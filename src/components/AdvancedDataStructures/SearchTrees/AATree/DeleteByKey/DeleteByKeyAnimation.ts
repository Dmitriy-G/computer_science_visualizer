import { ExtendedTreeAnimation } from '../../../../../visualization/ExtendedTreeAnimation.ts'
import type { AdditionalTreeModel, TreeInputValues } from '../../../../../visualization/AdditionalTreeModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { AATreeLayout } from '../AATreeLayout.ts'
export class DeleteByKeyAnimation extends ExtendedTreeAnimation {
  public static readonly title = 'Delete a key'
  public static readonly summary = 'Remove a key using this structure\'s deletion policy.'
  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', explanation: 'Balancing or equal-depth pages bounds the search and repair path logarithmically. A root match can return immediately; average is an upper bound for any key distribution.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Storage includes the explicit traversal stack and returned output, where applicable. Playback clones and scene snapshots are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Original element count for this run: n = ${size}.` },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage.' },
        { symbol: 'O(log n)', meaning: 'Work or storage proportional to balanced tree height.' },
      ],
    }
  }
  constructor(model: AdditionalTreeModel, input: TreeInputValues = {}) {
    super(model, new AATreeLayout(), 'delete-value', input, DeleteByKeyAnimation.title, DeleteByKeyAnimation.summary)
  }
}
