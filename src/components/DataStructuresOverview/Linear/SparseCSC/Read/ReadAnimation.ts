import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'
import type { LinearInputValues, LinearModel } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { SparseCSCLayout } from '../SparseCSCLayout.ts'

export class ReadAnimation extends LinearAnimation {
  public static readonly title = 'Read coordinates'
  public static readonly summary = 'Locate and return the value at the selected zero-based coordinates.'

  public static describe(size: number): AlgorithmInformation {
    const information = AnimationSequence.information(this.title, this.summary, size,
      ['O(1)', 'O(log(q + 1))', 'O(log(q + 1))'], 'Read two major-axis pointers, then lower-bound binary-search q sorted minor indices in the selected row or column. Empty and tiny blocks take constant time; average is a distribution-independent upper bound.',
      ['O(1)', 'O(1)', 'O(1)'], 'Coordinate parsing and lookup use constant auxiliary storage. Integer sums use bounded-size BigInt arithmetic.')
    return { ...information, terms: [
      { symbol: 'q', meaning: 'Stored entries in the selected compressed row or column.' },
      { symbol: 'O(1)', meaning: 'Constant work or additional storage.' },
      { symbol: 'O(log(q + 1))', meaning: 'An asymptotic upper bound expressed in q; includes the costs explained above.' },
    ] }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new SparseCSCLayout(), 'search-index', input, ReadAnimation.title, ReadAnimation.summary)
  }
}
