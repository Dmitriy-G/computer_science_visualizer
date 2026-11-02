import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'
import type { LinearInputValues, LinearModel } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { IndexedPriorityQueueLayout } from '../IndexedPriorityQueueLayout.ts'

export class InsertAnimation extends LinearAnimation {
  public static readonly title = 'Insert a key / priority'
  public static readonly summary = 'Reject duplicate keys, append a leaf, and maintain the inverse position Map during sift-up.'

  public static describe(size: number): AlgorithmInformation {
    const information = AnimationSequence.information(this.title, this.summary, size,
      ['O(1)', 'O(log n)', 'O(n)'], 'The inverse key-to-position Map avoids a linear search. Heap sifting follows at most the complete-tree height. Bounds assume expected constant Map access; the conservative linear worst row also allows table maintenance. Missing or duplicate keys return without mutation.',
      ['O(1)', 'O(1)', 'O(n)'], 'Store one entry and one inverse mapping; backing-array or Map growth can allocate O(n) slots.')
    return { ...information, terms: [
      { symbol: 'n', meaning: `Original logical entry count for this run: n = ${size}.` },
      { symbol: 'O(1)', meaning: 'Constant work or storage.' },
      { symbol: 'O(log n)', meaning: 'Logarithmic in the original entry count.' },
      { symbol: 'O(n)', meaning: 'Linear in the original entry count.' },
    ] }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new IndexedPriorityQueueLayout(), 'insert', input, InsertAnimation.title, InsertAnimation.summary)
  }
}
