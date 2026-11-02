import { ExtendedTreeAnimation } from '../../../../../visualization/ExtendedTreeAnimation.ts'
import type { AdditionalTreeModel, TreeInputValues } from '../../../../../visualization/AdditionalTreeModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { ScapegoatTreeLayout } from '../ScapegoatTreeLayout.ts'
export class InsertAnimation extends ExtendedTreeAnimation {
  public static readonly title = 'Insert a key'
  public static readonly summary = 'Insert a unique key using this tree\'s own placement and repair policy.'
  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(1)', average: 'O(log n)', worst: 'O(n)', explanation: 'With alpha=2/3, search height is logarithmic. Updates cost O(log n) amortized over a sequence, but one subtree or whole-tree rebuild can be linear. Average denotes the amortized update bound, with no random-input assumption.' },
      memory: { best: 'O(1)', average: 'O(n)', worst: 'O(n)', explanation: 'Storage includes the explicit traversal stack and returned output, where applicable. Playback clones and scene snapshots are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Original element count for this run: n = ${size}.` },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage.' },
        { symbol: 'O(log n)', meaning: 'Work or storage proportional to balanced tree height.' },
        { symbol: 'O(n)', meaning: 'Linear work or additional storage.' },
      ],
    }
  }
  constructor(model: AdditionalTreeModel, input: TreeInputValues = {}) {
    super(model, new ScapegoatTreeLayout(), 'insert', input, InsertAnimation.title, InsertAnimation.summary)
  }
}
