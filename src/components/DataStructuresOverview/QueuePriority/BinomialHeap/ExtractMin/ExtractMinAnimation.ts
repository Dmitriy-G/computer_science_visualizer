import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'
import type { LinearInputValues, LinearModel } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { BinomialHeapLayout } from '../BinomialHeapLayout.ts'

export class ExtractMinAnimation extends LinearAnimation {
  public static readonly title = 'Extract minimum'
  public static readonly summary = 'Remove the cached minimum root, reverse its children, and consolidate the forest.'

  public static describe(size: number): AlgorithmInformation {
    const information = AnimationSequence.information(this.title, this.summary, size,
      ['O(1)', 'O(log n)', 'O(log n)'], 'A degree-zero minimum in a one-root forest is constant work. Otherwise root scans, child-list reversal, and equal-degree links require at most logarithmic work; this is also a conservative average bound.',
      ['O(log n)', 'O(log n)', 'O(log n)'], 'Reversed child and merged root lists each hold at most O(log n) references.')
    return { ...information, terms: [
      { symbol: 'n', meaning: `Original logical entry count for this run: n = ${size}.` },
      { symbol: 'O(1)', meaning: 'Constant work or storage.' },
      { symbol: 'O(log n)', meaning: 'Logarithmic in the original entry count.' },
    ] }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new BinomialHeapLayout(), 'extract-min', input, ExtractMinAnimation.title, ExtractMinAnimation.summary)
  }
}
