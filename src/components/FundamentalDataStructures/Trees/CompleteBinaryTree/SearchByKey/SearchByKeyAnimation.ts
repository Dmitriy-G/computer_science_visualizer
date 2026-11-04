import { ExtendedTreeAnimation } from '../../../../../visualization/ExtendedTreeAnimation.ts'
import type { AdditionalTreeModel, TreeInputValues } from '../../../../../visualization/AdditionalTreeModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { CompleteBinaryTreeLayout } from '../CompleteBinaryTreeLayout.ts'
export class SearchByKeyAnimation extends ExtendedTreeAnimation {
  public static readonly title = 'Search by value'
  public static readonly summary = 'Find a key and report its actual location or absence.'
  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(1)', average: 'O(n)', worst: 'O(n)', explanation: 'The packed level-order array appends directly (amortized O(1) host-array append). Search scans in level order; deletion performs that scan and one last-value replacement. Average search assumes uniformly distributed matching positions.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Storage includes the explicit traversal stack and returned output, where applicable. Playback clones and scene snapshots are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Original element count for this run: n = ${size}.` },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage.' },
        { symbol: 'O(n)', meaning: 'Linear work or additional storage.' },
      ],
    }
  }
  constructor(model: AdditionalTreeModel, input: TreeInputValues = {}) {
    super(model, new CompleteBinaryTreeLayout(), 'search-value', input, SearchByKeyAnimation.title, SearchByKeyAnimation.summary)
  }
}
