import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'
import type { LinearInputValues, LinearModel } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { SparseCSCLayout } from '../SparseCSCLayout.ts'

export class ClearAnimation extends LinearAnimation {
  public static readonly title = 'Clear stored entries'
  public static readonly summary = 'Make every logical cell zero while preserving the shape.'

  public static describe(size: number): AlgorithmInformation {
    const information = AnimationSequence.information(this.title, this.summary, size,
      ['O(m + 1)', 'O(m + 1)', 'O(m + 1)'], 'Drop the packed indices and data arrays and zero each major-axis pointer. Deferred garbage collection of discarded storage is outside this operation.',
      ['O(1)', 'O(1)', 'O(1)'], 'Only loop indices and constant references are required; no replacement matrix is allocated.')
    return { ...information, terms: [
      { symbol: 'm', meaning: 'Major-axis count: columns in CSC, rows in CSR; absent in COO.' },
      { symbol: 'O(m + 1)', meaning: 'An asymptotic upper bound expressed in m; includes the costs explained above.' },
      { symbol: 'O(1)', meaning: 'Constant work or additional storage.' },
    ] }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new SparseCSCLayout(), 'clear', input, ClearAnimation.title, ClearAnimation.summary)
  }
}
