import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'
import type { LinearInputValues, LinearModel } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { DenseTensorLayout } from '../DenseTensorLayout.ts'

export class ReadAnimation extends LinearAnimation {
  public static readonly title = 'Read coordinates'
  public static readonly summary = 'Locate and return the value at the selected zero-based coordinates.'

  public static describe(size: number): AlgorithmInformation {
    const information = AnimationSequence.information(this.title, this.summary, size,
      ['O(d)', 'O(d)', 'O(d)'], 'Validate coordinates and sum each coordinate times its cached stride; the grid has exactly two axes.',
      ['O(d)', 'O(d)', 'O(d)'], 'Coordinate parsing uses O(d) space. No cell storage is copied by lookup.')
    return { ...information, terms: [
      { symbol: 'd', meaning: 'Tensor rank (1 to 4); the grid and sparse matrices have rank two.' },
      { symbol: 'O(d)', meaning: 'An asymptotic upper bound expressed in d; includes the costs explained above.' },
    ] }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new DenseTensorLayout(), 'search-index', input, ReadAnimation.title, ReadAnimation.summary)
  }
}
