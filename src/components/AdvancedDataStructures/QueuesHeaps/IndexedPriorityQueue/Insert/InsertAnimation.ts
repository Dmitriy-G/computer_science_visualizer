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
      ['O(1)', 'O(log n)', 'O(n log n)'], 'With expected constant Map access, append and sift-up take amortized O(log n), a conservative average bound. Under the linear worst-case Map model used by the other indexed-heap actions, each of O(log n) exchanges can cost O(n), giving O(n log n). Duplicate keys return without mutation.',
      ['O(1)', 'O(1)', 'O(n)'], 'Store one entry and one inverse mapping; backing-array or Map growth can allocate O(n) slots.')
    return { ...information, terms: [
      { symbol: 'n', meaning: `Original logical entry count for this run: n = ${size}.` },
      { symbol: 'O(1)', meaning: 'Constant work or storage.' },
      { symbol: 'O(log n)', meaning: 'Logarithmic in the original entry count.' },
      { symbol: 'O(n log n)', meaning: 'Logarithmically many exchanges with linear worst-case Map maintenance each.' },
      { symbol: 'O(n)', meaning: 'Linear in the original entry count.' },
    ] }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new IndexedPriorityQueueLayout(), 'insert', input, InsertAnimation.title, InsertAnimation.summary)
  }
}
