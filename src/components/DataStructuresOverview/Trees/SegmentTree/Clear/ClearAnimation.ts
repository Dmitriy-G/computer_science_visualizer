import { AdditionalTreeAnimation } from '../../../../../visualization/AdditionalTreeAnimation.ts'
import type { AdditionalTreeModel, TreeInputValues } from '../../../../../visualization/AdditionalTreeModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { SegmentTreeLayout } from '../SegmentTreeLayout.ts'

export class ClearAnimation extends AdditionalTreeAnimation {
  public static readonly title = 'Clear (reset to zero)'
  public static readonly summary = 'Reset every leaf and cached segment to zero while preserving array indices.'

  public static describe(size: number, storage = size, runs = 0): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', explanation: 'Visit all array values and the linear number of segment nodes. Empty arrays complete immediately.' },
      memory: { best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)', explanation: 'A postorder recursion stack has logarithmic height. Animation snapshots and traces are excluded. Numeric sums count scalar cells; exact-integer arithmetic also depends on digit length.' },
      terms: [
        { symbol: 'n', meaning: `Original element count for this run: n = ${size}.` },
        { symbol: 'O(n)', meaning: 'Work or storage proportional to the original number of array values or stored records.' },
        { symbol: 'O(log n)', meaning: 'Work or storage proportional to balanced tree height.' },
      ],
    }
  }

  constructor(model: AdditionalTreeModel, input: TreeInputValues = {}) {
    super(model, new SegmentTreeLayout(), 'clear', input, ClearAnimation.title, ClearAnimation.summary)
  }
}
