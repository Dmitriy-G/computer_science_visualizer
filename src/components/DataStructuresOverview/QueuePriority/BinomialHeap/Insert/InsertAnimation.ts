import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'
import type { LinearInputValues, LinearModel } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { BinomialHeapLayout } from '../BinomialHeapLayout.ts'

export class InsertAnimation extends LinearAnimation {
  public static readonly title = 'Insert a value'
  public static readonly summary = 'Merge a singleton root list and link equal-degree trees like binary carries.'

  public static describe(size: number): AlgorithmInformation {
    const information = AnimationSequence.information(this.title, this.summary, size,
      ['O(1)', 'O(log n)', 'O(log n)'], 'Root lists contain at most one tree per degree after consolidation. This implementation merges and scans those lists, giving a conservative logarithmic average and worst bound. An empty forest is constant work.',
      ['O(log n)', 'O(log n)', 'O(log n)'], 'The temporary merged root list holds O(log n) references, plus one new node.')
    return { ...information, terms: [
      { symbol: 'n', meaning: `Original logical entry count for this run: n = ${size}.` },
      { symbol: 'O(1)', meaning: 'Constant work or storage.' },
      { symbol: 'O(log n)', meaning: 'Logarithmic in the original entry count.' },
    ] }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new BinomialHeapLayout(), 'insert', input, InsertAnimation.title, InsertAnimation.summary)
  }
}
