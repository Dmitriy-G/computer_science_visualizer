import { AdditionalTreeAnimation } from '../../../../../visualization/AdditionalTreeAnimation.ts'
import type { AdditionalTreeModel, TreeInputValues } from '../../../../../visualization/AdditionalTreeModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { FenwickTreeLayout } from '../FenwickTreeLayout.ts'

export class RangeSumAnimation extends AdditionalTreeAnimation {
  public static readonly title = 'Range sum'
  public static readonly summary = 'Subtract prefix(minimum - 1) from prefix(maximum).'

  public static describe(size: number, storage = size, runs = 0): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', explanation: 'Aligned prefix boundaries can require constant work. Average assumes uniformly chosen valid intervals; two prefix traversals are logarithmic in the worst case.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Keep two scalar sums and iterative indices. Animation snapshots and traces are excluded. Numeric sums count scalar cells; exact-integer arithmetic also depends on digit length.' },
      terms: [
        { symbol: 'n', meaning: `Original element count for this run: n = ${size}.` },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage.' },
        { symbol: 'O(log n)', meaning: 'Work or storage proportional to balanced tree height.' },
      ],
    }
  }

  constructor(model: AdditionalTreeModel, input: TreeInputValues = {}) {
    super(model, new FenwickTreeLayout(), 'range-sum', input, RangeSumAnimation.title, RangeSumAnimation.summary)
  }
}
