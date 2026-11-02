import { ExtendedTreeAnimation } from '../../../../../visualization/ExtendedTreeAnimation.ts'
import type { AdditionalTreeModel, TreeInputValues } from '../../../../../visualization/AdditionalTreeModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { RadixTreeLayout } from '../RadixTreeLayout.ts'
export class SearchByWordAnimation extends ExtendedTreeAnimation {
  public static readonly title = 'Search by word'
  public static readonly summary = 'Follow the character branches and require a complete-word marker.'
  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(1)', average: 'O(m)', worst: 'O(m)', explanation: 'm is the supplied word or prefix length. The alphabet is fixed to 26 lowercase letters; even unbalanced ternary character pivots have at most 26 alternatives per character. Radix edges compare total characters along the path. A first-branch miss is constant.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Storage includes the explicit traversal stack and returned output, where applicable. Playback clones and scene snapshots are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Original element count for this run: n = ${size}.` },
        { symbol: 'm', meaning: 'Length of the supplied word, prefix, or substring pattern.' },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage.' },
        { symbol: 'O(m)', meaning: 'Work or storage proportional to supplied text length.' },
      ],
    }
  }
  constructor(model: AdditionalTreeModel, input: TreeInputValues = {}) {
    super(model, new RadixTreeLayout(), 'search-value', input, SearchByWordAnimation.title, SearchByWordAnimation.summary)
  }
}
