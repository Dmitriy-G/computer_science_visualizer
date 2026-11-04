import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'
import type { LinearInputValues, LinearModel } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { DenseTensorLayout } from '../DenseTensorLayout.ts'

export class SetAnimation extends LinearAnimation {
  public static readonly title = 'Set coordinates'
  public static readonly summary = 'Assign a replacement value while preserving the logical shape.'

  public static describe(size: number): AlgorithmInformation {
    const information = AnimationSequence.information(this.title, this.summary, size,
      ['O(d)', 'O(d)', 'O(d)'], 'Validate coordinates, compute the cached-stride offset, and overwrite exactly one occupied cell.',
      ['O(d)', 'O(d)', 'O(d)'], 'Coordinate parsing uses O(d) space; the existing allocation is reused.')
    return { ...information, terms: [
      { symbol: 'd', meaning: 'Tensor rank (1 to 4); the grid and sparse matrices have rank two.' },
      { symbol: 'O(d)', meaning: 'An asymptotic upper bound expressed in d; includes the costs explained above.' },
    ] }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new DenseTensorLayout(), 'update-index', input, SetAnimation.title, SetAnimation.summary)
  }
}
