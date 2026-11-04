import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'
import type { LinearInputValues, LinearModel } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { SparseCOOLayout } from '../SparseCOOLayout.ts'

export class SetAnimation extends LinearAnimation {
  public static readonly title = 'Set coordinates'
  public static readonly summary = 'Assign a replacement value while preserving the logical shape.'

  public static describe(size: number): AlgorithmInformation {
    const information = AnimationSequence.information(this.title, this.summary, size,
      ['O(s + 1)', 'O(s + 1)', 'O(s + 1)'], 'Scan s triplets, remove every match, and copy surviving triplets into replacement arrays. A nonzero replacement is appended; zero leaves no triplet.',
      ['O(s + 1)', 'O(s + 1)', 'O(s + 1)'], 'Replacement parallel arrays hold at most s + 1 entries. Capacity rejection occurs before any canonical array changes.')
    return { ...information, terms: [
      { symbol: 's', meaning: `Original stored triplet or nonzero count for this run. Original count: ${size}.` },
      { symbol: 'O(s + 1)', meaning: 'An asymptotic upper bound expressed in s; includes the costs explained above.' },
    ] }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new SparseCOOLayout(), 'update-index', input, SetAnimation.title, SetAnimation.summary)
  }
}
