import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'
import type { LinearInputValues, LinearModel } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { DenseTensorLayout } from '../DenseTensorLayout.ts'

export class ReshapeAnimation extends LinearAnimation {
  public static readonly title = 'Reshape'
  public static readonly summary = 'Recompute row-major dimensions and strides without moving data.'

  public static describe(size: number): AlgorithmInformation {
    const information = AnimationSequence.information(this.title, this.summary, size,
      ['O(d)', 'O(d)', 'O(d)'], 'Validate the new d dimensions and product, then recompute d strides. Only shape metadata changes; all cells remain in the same order.',
      ['O(d)', 'O(d)', 'O(d)'], 'The new shape and stride arrays contain d integers. No value-array allocation or copy is performed by reshape.')
    return { ...information, terms: [
      { symbol: 'd', meaning: 'Tensor rank (1 to 4); the grid and sparse matrices have rank two.' },
      { symbol: 'O(d)', meaning: 'An asymptotic upper bound expressed in d; includes the costs explained above.' },
    ] }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new DenseTensorLayout(), 'reshape', input, ReshapeAnimation.title, ReshapeAnimation.summary)
  }
}
