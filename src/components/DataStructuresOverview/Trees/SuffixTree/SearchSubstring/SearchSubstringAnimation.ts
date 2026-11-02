import { ExtendedTreeAnimation } from '../../../../../visualization/ExtendedTreeAnimation.ts'
import type { AdditionalTreeModel, TreeInputValues } from '../../../../../visualization/AdditionalTreeModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { SuffixTreeLayout } from '../SuffixTreeLayout.ts'
export class SearchSubstringAnimation extends ExtendedTreeAnimation {
  public static readonly title = 'Search substring'
  public static readonly summary = 'Match a pattern along compressed edges and collect its descendant suffix indices.'
  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(1)', average: 'O(m + k)', worst: 'O(m + k)', explanation: 'Match m pattern characters, then visit the matched subtree to collect k suffix indices. A first-edge miss is constant. Positions are returned in tree traversal order; there is no sorting pass.' },
      memory: { best: 'O(1)', average: 'O(n + k)', worst: 'O(n + k)', explanation: 'Storage includes the explicit traversal stack and returned output, where applicable. Playback clones and scene snapshots are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Original element count for this run: n = ${size}.` },
        { symbol: 'm', meaning: 'Length of the supplied word, prefix, or substring pattern.' },
        { symbol: 'k', meaning: 'Number of matching suffix indices returned.' },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage.' },
        { symbol: 'O(m + k)', meaning: 'Pattern matching plus reporting all matching positions.' },
        { symbol: 'O(n + k)', meaning: 'Input-size recursion bound plus returned positions.' },
      ],
    }
  }
  constructor(model: AdditionalTreeModel, input: TreeInputValues = {}) {
    super(model, new SuffixTreeLayout(), 'search-value', input, SearchSubstringAnimation.title, SearchSubstringAnimation.summary)
  }
}
