import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'
import type { LinearInputValues, LinearModel } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { DenseTensorLayout } from '../DenseTensorLayout.ts'

export class InspectStorageAnimation extends LinearAnimation {
  public static readonly title = 'Inspect storage'
  public static readonly summary = 'Visit the actual representation arrays without changing the structure.'

  public static describe(size: number): AlgorithmInformation {
    const information = AnimationSequence.information(this.title, this.summary, size,
      ['O(N + d)', 'O(N + d)', 'O(N + d)'], 'Read and visit each actual representation array cell, including shape and compressed pointers or strides. Average bounds hold for every input distribution.',
      ['O(N + d)', 'O(N + d)', 'O(N + d)'], 'Read-only array copies and the serialized storage result are linear in the displayed representation. This returned inspection data is operation output, separate from playback snapshots.')
    return { ...information, terms: [
      { symbol: 'N', meaning: 'Number of logical cells: product of all dimensions.' },
      { symbol: 'd', meaning: 'Tensor rank (1 to 4); the grid and sparse matrices have rank two.' },
      { symbol: 'O(N + d)', meaning: 'An asymptotic upper bound expressed in N, d; includes the costs explained above.' },
    ] }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new DenseTensorLayout(), 'inspect-storage', input, InspectStorageAnimation.title, InspectStorageAnimation.summary)
  }
}
