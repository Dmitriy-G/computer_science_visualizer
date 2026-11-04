import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'
import type { LinearInputValues, LinearModel } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { DenseTensorLayout } from '../DenseTensorLayout.ts'

export class BuildAnimation extends LinearAnimation {
  public static readonly title = 'Build from values'
  public static readonly summary = 'Validate the complete shape and row-major values, then replace the storage.'

  public static describe(size: number): AlgorithmInformation {
    const information = AnimationSequence.information(this.title, this.summary, size,
      ['O(N + d)', 'O(N + d)', 'O(N + d)'], 'Validate N supplied cells and d dimensions, compute strides, and copy the contiguous allocation.',
      ['O(N + d)', 'O(N + d)', 'O(N + d)'], 'Parsed values, replacement storage, shape, and strides require O(N + d) memory. Discarded allocations are reclaimed separately.')
    return { ...information, terms: [
      { symbol: 'N', meaning: 'Number of logical cells: product of all dimensions.' },
      { symbol: 'd', meaning: 'Tensor rank (1 to 4); the grid and sparse matrices have rank two.' },
      { symbol: 'O(N + d)', meaning: 'An asymptotic upper bound expressed in N, d; includes the costs explained above.' },
    ] }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new DenseTensorLayout(), 'build-values', input, BuildAnimation.title, BuildAnimation.summary)
  }
}
