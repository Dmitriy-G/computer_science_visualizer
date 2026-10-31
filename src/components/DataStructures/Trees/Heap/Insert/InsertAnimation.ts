import { AdditionalTreeAnimation } from '../../../../../visualization/AdditionalTreeAnimation.ts'
import type { AdditionalTreeModel, TreeInputValues } from '../../../../../visualization/AdditionalTreeModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { HeapLayout } from '../HeapLayout.ts'

export class InsertAnimation extends AdditionalTreeAnimation {
  public static readonly title = 'Insert a value'
  public static readonly summary = 'Append a leaf and sift it upward until parent <= child.'

  public static describe(size: number, storage = size, runs = 0): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(1)', average: 'O(1)', worst: 'O(log n)', explanation: 'Best: the new leaf already satisfies heap order. Expected constant sift-up assumes independent uniformly ranked priorities; a new global minimum traverses the height.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'One new entry and a few indices; backing-array allocation is managed by JavaScript. Animation snapshots and traces are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Original element count for this run: n = ${size}.` },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage.' },
        { symbol: 'O(log n)', meaning: 'Work or storage proportional to balanced tree height.' },
      ],
    }
  }

  constructor(model: AdditionalTreeModel, input: TreeInputValues = {}) {
    super(model, new HeapLayout(), 'insert', input, InsertAnimation.title, InsertAnimation.summary)
  }
}
