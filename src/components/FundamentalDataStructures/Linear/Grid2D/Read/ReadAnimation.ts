import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'
import type { LinearInputValues, LinearModel } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { Grid2DLayout } from '../Grid2DLayout.ts'

export class ReadAnimation extends LinearAnimation {
  public static readonly title = 'Read coordinates'
  public static readonly summary = 'Locate and return the value at the selected zero-based coordinates.'

  public static describe(size: number): AlgorithmInformation {
    const information = AnimationSequence.information(this.title, this.summary, size,
      ['O(1)', 'O(1)', 'O(1)'], 'Validate coordinates and sum each coordinate times its cached stride; the grid has exactly two axes.',
      ['O(1)', 'O(1)', 'O(1)'], 'Coordinate parsing and lookup use constant auxiliary storage. Integer sums use bounded-size BigInt arithmetic.')
    return { ...information, terms: [

      { symbol: 'O(1)', meaning: 'Constant work or additional storage.' },
    ] }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new Grid2DLayout(), 'search-index', input, ReadAnimation.title, ReadAnimation.summary)
  }
}
