import { ExtendedTreeAnimation } from '../../../../../visualization/ExtendedTreeAnimation.ts'
import type { AdditionalTreeModel, TreeInputValues } from '../../../../../visualization/AdditionalTreeModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { KDTreeLayout } from '../KDTreeLayout.ts'
export class InsertAnimation extends ExtendedTreeAnimation {
  public static readonly title = 'Insert a point'
  public static readonly summary = 'Insert a unique point using this structure\'s spatial partition rules.'
  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(1)', average: 'O(n)', worst: 'O(n)', explanation: 'The teaching spatial index has no global balancing guarantee. Insertion follows its partition or enlargement policy; box queries can inspect the entire representation and report all n points or rectangles. Average O(n) is a conservative upper bound without a spatial distribution assumption.' },
      memory: { best: 'O(1)', average: 'O(n)', worst: 'O(n)', explanation: 'Storage includes the explicit traversal stack and returned output, where applicable. Playback clones and scene snapshots are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Original element count for this run: n = ${size}.` },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage.' },
        { symbol: 'O(n)', meaning: 'Linear work or additional storage.' },
      ],
    }
  }
  constructor(model: AdditionalTreeModel, input: TreeInputValues = {}) {
    super(model, new KDTreeLayout(), 'insert', input, InsertAnimation.title, InsertAnimation.summary)
  }
}
