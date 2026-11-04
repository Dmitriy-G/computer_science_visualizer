import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'
import type { LinearInputValues, LinearModel } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { SparseCOOLayout } from '../SparseCOOLayout.ts'

export class ClearAnimation extends LinearAnimation {
  public static readonly title = 'Clear stored entries'
  public static readonly summary = 'Make every logical cell zero while preserving the shape.'

  public static describe(size: number): AlgorithmInformation {
    const information = AnimationSequence.information(this.title, this.summary, size,
      ['O(s + 1)', 'O(s + 1)', 'O(s + 1)'], 'Pop every triplet from all three aligned arrays. Empty storage takes constant time.',
      ['O(1)', 'O(1)', 'O(1)'], 'Only loop indices and constant references are required; no replacement matrix is allocated.')
    return { ...information, terms: [
      { symbol: 's', meaning: `Original stored triplet or nonzero count for this run. Original count: ${size}.` },
      { symbol: 'O(s + 1)', meaning: 'An asymptotic upper bound expressed in s; includes the costs explained above.' },
      { symbol: 'O(1)', meaning: 'Constant work or additional storage.' },
    ] }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new SparseCOOLayout(), 'clear', input, ClearAnimation.title, ClearAnimation.summary)
  }
}
