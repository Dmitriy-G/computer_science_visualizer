import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'
import type { LinearInputValues, LinearModel } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { GapBufferLayout } from '../GapBufferLayout.ts'

export class MoveGapAnimation extends LinearAnimation {
  public static readonly title = 'Move the gap'
  public static readonly summary = 'Move characters across the gap until its start equals the selected logical index.'

  public static describe(size: number): AlgorithmInformation {
    const information = AnimationSequence.information(this.title, this.summary, size,
      ['O(1)', 'O(n)', 'O(n)'], 'No movement is needed at the current cursor. Uniformly distributed target positions require linear average movement; moving between opposite ends moves n characters.',
      ['O(1)', 'O(1)', 'O(1)'], 'Only a fixed number of local variables are required.')
    return { ...information, terms: [
        { symbol: 'n', meaning: `Original logical size for this run: n = ${size}.` },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage.' },
        { symbol: 'O(n)', meaning: 'Linear in the original size.' },
    ] }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new GapBufferLayout(), 'move-gap', input, MoveGapAnimation.title, MoveGapAnimation.summary)
  }
}
