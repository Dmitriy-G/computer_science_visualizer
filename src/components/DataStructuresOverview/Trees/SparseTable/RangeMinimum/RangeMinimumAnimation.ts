import { ExtendedTreeAnimation } from '../../../../../visualization/ExtendedTreeAnimation.ts'
import type { AdditionalTreeModel, TreeInputValues } from '../../../../../visualization/AdditionalTreeModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { SparseTableLayout } from '../SparseTableLayout.ts'
export class RangeMinimumAnimation extends ExtendedTreeAnimation {
  public static readonly title = 'Range minimum'
  public static readonly summary = 'Find the minimum value in an inclusive zero-based index range.'
  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Build tabulates all available power-of-two intervals and integer logarithms. A query reads exactly two cached intervals; minimum is idempotent, so overlap is safe. These are bounds for every input distribution; empty tables cannot be queried.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Storage includes the explicit traversal stack and returned output, where applicable. Playback clones and scene snapshots are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Original element count for this run: n = ${size}.` },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage.' },
      ],
    }
  }
  constructor(model: AdditionalTreeModel, input: TreeInputValues = {}) {
    super(model, new SparseTableLayout(), 'range-min', input, RangeMinimumAnimation.title, RangeMinimumAnimation.summary)
  }
}
