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
      ['O(log n)', 'O(log n)', 'O(log n)'], 'Consolidation iterates a degree-indexed array through the highest degree, even across empty slots. A nonempty binomial forest with n nodes has maximum degree floor(log2 n), so accepted insertions and nontrivial extractions take O(log n) in every case. Empty and singleton boundary cases take O(1).',
      ['O(log n)', 'O(log n)', 'O(log n)'], 'Merged root lists and the degree-indexed consolidation array use O(log n) additional slots, plus one new node.')
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
