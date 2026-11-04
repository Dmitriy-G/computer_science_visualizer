import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'
import type { LinearInputValues, LinearModel } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { SparseCOOLayout } from '../SparseCOOLayout.ts'

export class ReadAnimation extends LinearAnimation {
  public static readonly title = 'Read coordinates'
  public static readonly summary = 'Locate and return the value at the selected zero-based coordinates.'

  public static describe(size: number): AlgorithmInformation {
    const information = AnimationSequence.information(this.title, this.summary, size,
      ['O(s + 1)', 'O(s + 1)', 'O(s + 1)'], 'Scan all s triplets, including after a match, because duplicate coordinates must be summed. Empty storage takes constant time.',
      ['O(1)', 'O(1)', 'O(1)'], 'Coordinate parsing and lookup use constant auxiliary storage. Integer sums use bounded-size BigInt arithmetic.')
    return { ...information, terms: [
      { symbol: 's', meaning: `Original stored triplet or nonzero count for this run. Original count: ${size}.` },
      { symbol: 'O(s + 1)', meaning: 'An asymptotic upper bound expressed in s; includes the costs explained above.' },
      { symbol: 'O(1)', meaning: 'Constant work or additional storage.' },
    ] }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new SparseCOOLayout(), 'search-index', input, ReadAnimation.title, ReadAnimation.summary)
  }
}
