import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'
import type { LinearInputValues, LinearModel } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { NumericalCSRLayout } from '../NumericalCSRLayout.ts'

export class SetAnimation extends LinearAnimation {
  public static readonly title = 'Set coordinates'
  public static readonly summary = 'Assign a replacement value while preserving the logical shape.'

  public static describe(size: number): AlgorithmInformation {
    const information = AnimationSequence.information(this.title, this.summary, size,
      ['O(1)', 'O(s + m + 1)', 'O(s + m + 1)'], 'An existing-value update needs only its block search; structural insertion/deletion can shift s packed entries and adjust m following pointers. Average is a conservative upper bound valid for any request distribution.',
      ['O(1)', 'O(s + 1)', 'O(s + 1)'], 'Existing-value updates use constant space; JavaScript array growth during a structural insertion can require O(s + 1) replacement backing storage.')
    return { ...information, terms: [
      { symbol: 's', meaning: `Original stored triplet or nonzero count for this run. Original count: ${size}.` },
      { symbol: 'm', meaning: 'Major-axis count: columns in CSC, rows in CSR; absent in COO.' },
      { symbol: 'O(1)', meaning: 'Constant work or additional storage.' },
      { symbol: 'O(s + m + 1)', meaning: 'An asymptotic upper bound expressed in s, m; includes the costs explained above.' },
      { symbol: 'O(s + 1)', meaning: 'An asymptotic upper bound expressed in s, m; includes the costs explained above.' },
    ] }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new NumericalCSRLayout(), 'update-index', input, SetAnimation.title, SetAnimation.summary)
  }
}
