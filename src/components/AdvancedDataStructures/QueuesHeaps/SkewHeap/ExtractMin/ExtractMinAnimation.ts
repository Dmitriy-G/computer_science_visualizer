import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'
import type { LinearInputValues, LinearModel } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { SkewHeapLayout } from '../SkewHeapLayout.ts'

export class ExtractMinAnimation extends LinearAnimation {
  public static readonly title = 'Extract minimum'
  public static readonly summary = 'Remove the root and meld its two child heaps.'

  public static describe(size: number): AlgorithmInformation {
    const information = AnimationSequence.information(this.title, this.summary, size,
      ['O(1)', 'O(log n)', 'O(n)'], 'Unconditional child swaps give O(log n) amortized work, shown in the average row. One operation can follow a linear chain, with no rank or height constraint. A root with an empty child requires no recursive comparisons.',
      ['O(1)', 'O(n)', 'O(n)'], 'The recursive merge stack follows the traversed right paths.')
    return { ...information, terms: [
      { symbol: 'n', meaning: `Original logical entry count for this run: n = ${size}.` },
      { symbol: 'O(1)', meaning: 'Constant work or storage.' },
      { symbol: 'O(log n)', meaning: 'Logarithmic in the original entry count.' },
      { symbol: 'O(n)', meaning: 'Linear in the original entry count.' },
    ] }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new SkewHeapLayout(), 'extract-min', input, ExtractMinAnimation.title, ExtractMinAnimation.summary)
  }
}
