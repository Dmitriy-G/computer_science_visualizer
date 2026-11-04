import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'
import type { LinearInputValues, LinearModel } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { Grid2DLayout } from '../Grid2DLayout.ts'

export class ClearAnimation extends LinearAnimation {
  public static readonly title = 'Zero all cells'
  public static readonly summary = 'Make every logical cell zero while preserving the shape.'

  public static describe(size: number): AlgorithmInformation {
    const information = AnimationSequence.information(this.title, this.summary, size,
      ['O(N)', 'O(N)', 'O(N)'], 'Overwrite every occupied cell with zero; preserve shape, strides, and the exact allocation.',
      ['O(1)', 'O(1)', 'O(1)'], 'Only loop indices and constant references are required; no replacement matrix is allocated.')
    return { ...information, terms: [
      { symbol: 'N', meaning: 'Number of logical cells: product of all dimensions.' },
      { symbol: 'O(N)', meaning: 'An asymptotic upper bound expressed in N; includes the costs explained above.' },
      { symbol: 'O(1)', meaning: 'Constant work or additional storage.' },
    ] }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new Grid2DLayout(), 'clear', input, ClearAnimation.title, ClearAnimation.summary)
  }
}
