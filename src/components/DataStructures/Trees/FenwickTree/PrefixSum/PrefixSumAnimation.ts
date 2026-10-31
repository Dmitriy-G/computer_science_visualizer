import { AdditionalTreeAnimation } from '../../../../../visualization/AdditionalTreeAnimation.ts'
import type { AdditionalTreeModel, TreeInputValues } from '../../../../../visualization/AdditionalTreeModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { FenwickTreeLayout } from '../FenwickTreeLayout.ts'

export class PrefixSumAnimation extends AdditionalTreeAnimation {
  public static readonly title = 'Prefix sum'
  public static readonly summary = 'Accumulate BIT blocks using i -= i & -i.'

  public static describe(size: number, storage = size, runs = 0): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', explanation: 'A prefix ending at a power-of-two BIT index uses one block. Average assumes uniformly distributed valid endpoints; worst visits logarithmically many set bits.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'An iterative index and accumulator suffice. Animation snapshots and traces are excluded. Numeric sums count scalar cells; exact-integer arithmetic also depends on digit length.' },
      terms: [
        { symbol: 'n', meaning: `Original element count for this run: n = ${size}.` },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage.' },
        { symbol: 'O(log n)', meaning: 'Work or storage proportional to balanced tree height.' },
      ],
    }
  }

  constructor(model: AdditionalTreeModel, input: TreeInputValues = {}) {
    super(model, new FenwickTreeLayout(), 'prefix-sum', input, PrefixSumAnimation.title, PrefixSumAnimation.summary)
  }
}
