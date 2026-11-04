import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'
import type { LinearInputValues, LinearModel } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { FibonacciHeapLayout } from '../FibonacciHeapLayout.ts'

export class InsertAnimation extends LinearAnimation {
  public static readonly title = 'Insert a value'
  public static readonly summary = 'Add a singleton to the circular root list without consolidating degrees.'

  public static describe(size: number): AlgorithmInformation {
    const information = AnimationSequence.information(this.title, this.summary, size,
      ['O(1)', 'O(1)', 'O(n)'], 'Root-list linking is O(1) worst case. The handle Map has expected amortized constant insertion, shown in the average row; a conservative linear worst row includes table growth. No random-key assumption is needed.',
      ['O(1)', 'O(1)', 'O(n)'], 'One node is added. Handle-table growth may allocate linear backing storage.')
    return { ...information, terms: [
      { symbol: 'n', meaning: `Original logical entry count for this run: n = ${size}.` },
      { symbol: 'O(1)', meaning: 'Constant work or storage.' },
      { symbol: 'O(n)', meaning: 'Linear in the original entry count.' },
    ] }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new FibonacciHeapLayout(), 'insert', input, InsertAnimation.title, InsertAnimation.summary)
  }
}
