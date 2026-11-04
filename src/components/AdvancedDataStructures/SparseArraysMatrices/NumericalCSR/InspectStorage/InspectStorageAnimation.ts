import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'
import type { LinearInputValues, LinearModel } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { NumericalCSRLayout } from '../NumericalCSRLayout.ts'

export class InspectStorageAnimation extends LinearAnimation {
  public static readonly title = 'Inspect storage'
  public static readonly summary = 'Visit the actual representation arrays without changing the structure.'

  public static describe(size: number): AlgorithmInformation {
    const information = AnimationSequence.information(this.title, this.summary, size,
      ['O(s + m + 1)', 'O(s + m + 1)', 'O(s + m + 1)'], 'Read and visit each actual representation array cell, including shape and compressed pointers or strides. Average bounds hold for every input distribution.',
      ['O(s + m + 1)', 'O(s + m + 1)', 'O(s + m + 1)'], 'Read-only array copies and the serialized storage result are linear in the displayed representation. This returned inspection data is operation output, separate from playback snapshots.')
    return { ...information, terms: [
      { symbol: 's', meaning: `Original stored triplet or nonzero count for this run. Original count: ${size}.` },
      { symbol: 'm', meaning: 'Major-axis count: columns in CSC, rows in CSR; absent in COO.' },
      { symbol: 'O(s + m + 1)', meaning: 'An asymptotic upper bound expressed in s, m; includes the costs explained above.' },
    ] }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new NumericalCSRLayout(), 'inspect-storage', input, InspectStorageAnimation.title, InspectStorageAnimation.summary)
  }
}
