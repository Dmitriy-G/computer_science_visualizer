import { ExtendedTreeAnimation } from '../../../../../visualization/ExtendedTreeAnimation.ts'
import type { AdditionalTreeModel, TreeInputValues } from '../../../../../visualization/AdditionalTreeModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { IntervalTreeLayout } from '../IntervalTreeLayout.ts'
export class SearchOverlapAnimation extends ExtendedTreeAnimation {
  public static readonly title = 'Find an overlap'
  public static readonly summary = 'Return one inclusive overlapping interval, using subtree maxima to prune the search.'
  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(1)', average: 'O(n)', worst: 'O(n)', explanation: 'The interval BST is deliberately unbalanced. It orders endpoint pairs and stores subtree maximum highs. Search returns one overlap along a single path. Average O(n) is a conservative bound; no balanced-tree guarantee is claimed.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Storage includes the explicit traversal stack and returned output, where applicable. Playback clones and scene snapshots are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Original element count for this run: n = ${size}.` },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage.' },
        { symbol: 'O(n)', meaning: 'Linear work or additional storage.' },
      ],
    }
  }
  constructor(model: AdditionalTreeModel, input: TreeInputValues = {}) {
    super(model, new IntervalTreeLayout(), 'search-overlap', input, SearchOverlapAnimation.title, SearchOverlapAnimation.summary)
  }
}
