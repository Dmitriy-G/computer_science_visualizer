import { ExtendedTreeAnimation } from '../../../../../visualization/ExtendedTreeAnimation.ts'
import type { AdditionalTreeModel, TreeInputValues } from '../../../../../visualization/AdditionalTreeModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { ScapegoatTreeLayout } from '../ScapegoatTreeLayout.ts'
export class SearchByKeyAnimation extends ExtendedTreeAnimation {
  public static readonly title = 'Search by key'
  public static readonly summary = 'Find a key and report its actual location or absence.'
  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', explanation: 'With alpha=2/3, search height is logarithmic. Updates cost O(log n) amortized over a sequence, but one subtree or whole-tree rebuild can be linear. Average denotes the amortized update bound, with no random-input assumption.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Storage includes the explicit traversal stack and returned output, where applicable. Playback clones and scene snapshots are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Original element count for this run: n = ${size}.` },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage.' },
        { symbol: 'O(log n)', meaning: 'Work or storage proportional to balanced tree height.' },
      ],
    }
  }
  constructor(model: AdditionalTreeModel, input: TreeInputValues = {}) {
    super(model, new ScapegoatTreeLayout(), 'search-value', input, SearchByKeyAnimation.title, SearchByKeyAnimation.summary)
  }
}
