import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'
import type { LinearInputValues, LinearModel } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { BinaryMaxHeapLayout } from '../BinaryMaxHeapLayout.ts'

export class InsertAnimation extends LinearAnimation {
  public static readonly title = 'Insert a value'
  public static readonly summary = 'Append a leaf and sift it upward until every parent is at least as large.'

  public static describe(size: number): AlgorithmInformation {
    const information = AnimationSequence.information(this.title, this.summary, size,
      ['O(1)', 'O(log n)', 'O(n)'], 'A leaf already in heap order needs no exchanges. O(log n) bounds the average comparison work without a priority-distribution assumption. A sift can cross the height; JavaScript backing-array growth can copy O(n) slots, giving the conservative worst row. Empty insertion takes O(1).',
      ['O(1)', 'O(1)', 'O(n)'], 'One entry is added; managed backing-array growth can temporarily allocate O(n) slots.')
    return { ...information, terms: [
      { symbol: 'n', meaning: `Original logical entry count for this run: n = ${size}.` },
      { symbol: 'O(1)', meaning: 'Constant work or storage.' },
      { symbol: 'O(log n)', meaning: 'Logarithmic in the original entry count.' },
      { symbol: 'O(n)', meaning: 'Linear in the original entry count.' },
    ] }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new BinaryMaxHeapLayout(), 'insert', input, InsertAnimation.title, InsertAnimation.summary)
  }
}
