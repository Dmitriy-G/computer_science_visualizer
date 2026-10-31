import { AdditionalTreeAnimation } from '../../../../../visualization/AdditionalTreeAnimation.ts'
import type { AdditionalTreeModel, TreeInputValues } from '../../../../../visualization/AdditionalTreeModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { SegmentTreeLayout } from '../SegmentTreeLayout.ts'

export class UpdateAnimation extends AdditionalTreeAnimation {
  public static readonly title = 'Update a value'
  public static readonly summary = 'Assign one indexed leaf and recompute its ancestor sums.'

  public static describe(size: number, storage = size, runs = 0): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)', explanation: 'Each valid index has a root-to-leaf path of logarithmic height. Singleton updates take constant time.' },
      memory: { best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)', explanation: 'Recursive point assignment holds a root-to-leaf call stack. Animation snapshots and traces are excluded. Numeric sums count scalar cells; exact-integer arithmetic also depends on digit length.' },
      terms: [
        { symbol: 'n', meaning: `Original element count for this run: n = ${size}.` },
        { symbol: 'O(log n)', meaning: 'Work or storage proportional to balanced tree height.' },
      ],
    }
  }

  constructor(model: AdditionalTreeModel, input: TreeInputValues = {}) {
    super(model, new SegmentTreeLayout(), 'update-index', input, UpdateAnimation.title, UpdateAnimation.summary)
  }
}
