import { AdditionalTreeAnimation } from '../../../../../visualization/AdditionalTreeAnimation.ts'
import type { AdditionalTreeModel, TreeInputValues } from '../../../../../visualization/AdditionalTreeModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { FenwickTreeLayout } from '../FenwickTreeLayout.ts'

export class AddAnimation extends AdditionalTreeAnimation {
  public static readonly title = 'Add to a value'
  public static readonly summary = 'Add a delta along BIT update ancestors using i += i & -i.'

  public static describe(size: number, storage = size, runs = 0): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', explanation: 'Some high indices have one update cell. Average assumes uniformly distributed valid indices; worst visits logarithmically many cells.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Iterative updates keep a cell index and delta. Animation snapshots and traces are excluded. Numeric sums count scalar cells; exact-integer arithmetic also depends on digit length.' },
      terms: [
        { symbol: 'n', meaning: `Original element count for this run: n = ${size}.` },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage.' },
        { symbol: 'O(log n)', meaning: 'Work or storage proportional to balanced tree height.' },
      ],
    }
  }

  constructor(model: AdditionalTreeModel, input: TreeInputValues = {}) {
    super(model, new FenwickTreeLayout(), 'add-index', input, AddAnimation.title, AddAnimation.summary)
  }
}
