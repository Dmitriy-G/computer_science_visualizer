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
      time: { best: 'O(1)', average: 'O(log n)', worst: 'O(n)', explanation: 'Appending and sifting up costs O(log n) amortized, used as a conservative average bound without a key distribution. A leaf already in heap order needs constant sift work; a new minimum may climb O(log n) levels. One backing-array growth may copy O(n) entries; this follows the same dynamic-array cost model as the other array-backed heaps.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(n)', explanation: 'One new entry and fixed local variables suffice without growth. The average row is amortized allocation over an insertion sequence; an individual backing-array growth may allocate O(n) slots. Playback clones and snapshots are excluded.' },
      terms: [
        { symbol: 'O(n)', meaning: 'Linear work or allocation when the backing array grows.' },
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
