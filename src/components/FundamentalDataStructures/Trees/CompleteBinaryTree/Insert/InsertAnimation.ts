import { ExtendedTreeAnimation } from '../../../../../visualization/ExtendedTreeAnimation.ts'
import type { AdditionalTreeModel, TreeInputValues } from '../../../../../visualization/AdditionalTreeModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { CompleteBinaryTreeLayout } from '../CompleteBinaryTreeLayout.ts'
export class InsertAnimation extends ExtendedTreeAnimation {
  public static readonly title = 'Append a value'
  public static readonly summary = 'Fill the next level-order position. Duplicate values are allowed.'
  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(1)', average: 'O(1)', worst: 'O(n)', explanation: 'Append directly to the level-order array. The average row denotes amortized append cost across insertion sequences. One backing-array growth may copy O(n) entries; this follows the same dynamic-array cost model as the other array-backed heaps.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(n)', explanation: 'One new entry and fixed local variables suffice without growth. The average row is amortized allocation over an insertion sequence; an individual backing-array growth may allocate O(n) slots. Playback clones and snapshots are excluded.' },
      terms: [
        { symbol: 'O(n)', meaning: 'Linear work or allocation when the backing array grows.' },
        { symbol: 'n', meaning: `Original element count for this run: n = ${size}.` },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage.' },
      ],
    }
  }
  constructor(model: AdditionalTreeModel, input: TreeInputValues = {}) {
    super(model, new CompleteBinaryTreeLayout(), 'insert', input, InsertAnimation.title, InsertAnimation.summary)
  }
}
