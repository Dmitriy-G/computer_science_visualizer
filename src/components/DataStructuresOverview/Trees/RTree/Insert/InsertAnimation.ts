import { AdditionalTreeAnimation } from '../../../../../visualization/AdditionalTreeAnimation.ts'
import type { AdditionalTreeModel, TreeInputValues } from '../../../../../visualization/AdditionalTreeModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { RTreeLayout } from '../RTreeLayout.ts'

export class InsertAnimation extends AdditionalTreeAnimation {
  public static readonly title = 'Insert a rectangle'
  public static readonly summary = 'Choose least enlargement; split overflowing order-4 pages with quadratic seeds.'

  public static describe(size: number, storage = size, runs = 0): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)', explanation: 'At fixed page capacity, descend one balanced path and repair at most that path. Average is over insertions at the same size. Empty insertion is constant.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(log n)', explanation: 'An ordinary insert allocates one record. Amortized average over insertions allocates constant pages; a cascading split allocates logarithmically many pages. Animation snapshots and traces are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Original element count for this run: n = ${size}.` },
        { symbol: 'O(log n)', meaning: 'Work or storage proportional to balanced tree height.' },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage.' },
      ],
    }
  }

  constructor(model: AdditionalTreeModel, input: TreeInputValues = {}) {
    super(model, new RTreeLayout(), 'insert', input, InsertAnimation.title, InsertAnimation.summary)
  }
}
