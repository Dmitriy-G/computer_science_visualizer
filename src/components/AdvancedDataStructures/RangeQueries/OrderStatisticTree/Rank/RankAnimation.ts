import { ExtendedTreeAnimation } from '../../../../../visualization/ExtendedTreeAnimation.ts'
import type { AdditionalTreeModel, TreeInputValues } from '../../../../../visualization/AdditionalTreeModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { OrderStatisticTreeLayout } from '../OrderStatisticTreeLayout.ts'
export class RankAnimation extends ExtendedTreeAnimation {
  public static readonly title = 'Rank of a key'
  public static readonly summary = 'Count stored keys strictly smaller than the supplied key, including absent keys.'
  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)', explanation: 'Rank follows a balanced search path to a missing child while adding left-subtree sizes. Equality continues left to count strictly smaller keys, so there is no early root-match exit. Empty input returns zero in O(1); bounds hold for any key distribution.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Storage includes the explicit traversal stack and returned output, where applicable. Playback clones and scene snapshots are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Original element count for this run: n = ${size}.` },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage.' },
        { symbol: 'O(log n)', meaning: 'Work or storage proportional to balanced tree height.' },
      ],
    }
  }
  constructor(model: AdditionalTreeModel, input: TreeInputValues = {}) {
    super(model, new OrderStatisticTreeLayout(), 'rank', input, RankAnimation.title, RankAnimation.summary)
  }
}
