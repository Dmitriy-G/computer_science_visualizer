import { AdditionalTreeAnimation } from '../../../../../visualization/AdditionalTreeAnimation.ts'
import type { AdditionalTreeModel, TreeInputValues } from '../../../../../visualization/AdditionalTreeModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { SegmentTreeLayout } from '../SegmentTreeLayout.ts'

export class RangeSumAnimation extends AdditionalTreeAnimation {
  public static readonly title = 'Range sum'
  public static readonly summary = 'Use fully covered segment sums and prune disjoint segments.'

  public static describe(size: number, storage = size, runs = 0): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', explanation: 'The full array uses the root sum immediately. Average assumes uniformly chosen valid intervals; other ranges visit logarithmically many boundary and covered segments.' },
      memory: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', explanation: 'A full-cover query returns immediately; other ranges use a logarithmic recursion stack. Animation snapshots and traces are excluded. Numeric sums count scalar cells; exact-integer arithmetic also depends on digit length.' },
      terms: [
        { symbol: 'n', meaning: `Original element count for this run: n = ${size}.` },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage.' },
        { symbol: 'O(log n)', meaning: 'Work or storage proportional to balanced tree height.' },
      ],
    }
  }

  constructor(model: AdditionalTreeModel, input: TreeInputValues = {}) {
    super(model, new SegmentTreeLayout(), 'range-sum', input, RangeSumAnimation.title, RangeSumAnimation.summary)
  }
}
