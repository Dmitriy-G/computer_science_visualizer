import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'
import type { LinearInputValues, LinearModel } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { FibonacciHeapLayout } from '../FibonacciHeapLayout.ts'

export class ExtractMinAnimation extends LinearAnimation {
  public static readonly title = 'Extract minimum'
  public static readonly summary = 'Promote the minimum’s children and consolidate roots with equal degrees.'

  public static describe(size: number): AlgorithmInformation {
    const information = AnimationSequence.information(this.title, this.summary, size,
      ['O(1)', 'O(log n)', 'O(n)'], 'A singleton takes constant work. The average row denotes the amortized bound over operation sequences, not a random-input expectation. One extraction may visit a linear root list; consolidation gives O(log n) amortized work. Map access assumes expected constant cost.',
      ['O(1)', 'O(n)', 'O(n)'], 'The temporary root snapshot can hold O(n) references; the degree table is logarithmic. These are algorithm storage, separate from animation snapshots.')
    return { ...information, terms: [
      { symbol: 'n', meaning: `Original logical entry count for this run: n = ${size}.` },
      { symbol: 'O(1)', meaning: 'Constant work or storage.' },
      { symbol: 'O(log n)', meaning: 'Logarithmic in the original entry count.' },
      { symbol: 'O(n)', meaning: 'Linear in the original entry count.' },
    ] }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new FibonacciHeapLayout(), 'extract-min', input, ExtractMinAnimation.title, ExtractMinAnimation.summary)
  }
}
