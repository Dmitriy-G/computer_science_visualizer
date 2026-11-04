import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'
import type { LinearInputValues, LinearModel } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { Grid2DLayout } from '../Grid2DLayout.ts'

export class SetAnimation extends LinearAnimation {
  public static readonly title = 'Set coordinates'
  public static readonly summary = 'Assign a replacement value while preserving the logical shape.'

  public static describe(size: number): AlgorithmInformation {
    const information = AnimationSequence.information(this.title, this.summary, size,
      ['O(1)', 'O(1)', 'O(1)'], 'Validate coordinates, compute the cached-stride offset, and overwrite exactly one occupied cell.',
      ['O(1)', 'O(1)', 'O(1)'], 'The fixed two-coordinate request and overwrite require constant space.')
    return { ...information, terms: [

      { symbol: 'O(1)', meaning: 'Constant work or additional storage.' },
    ] }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new Grid2DLayout(), 'update-index', input, SetAnimation.title, SetAnimation.summary)
  }
}
