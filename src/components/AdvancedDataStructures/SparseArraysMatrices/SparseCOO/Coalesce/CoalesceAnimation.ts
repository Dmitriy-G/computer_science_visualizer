import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'
import type { LinearInputValues, LinearModel } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { SparseCOOLayout } from '../SparseCOOLayout.ts'

export class CoalesceAnimation extends LinearAnimation {
  public static readonly title = 'Coalesce'
  public static readonly summary = 'Insertion-sort coordinates, sum duplicates exactly, and remove zeros.'

  public static describe(size: number): AlgorithmInformation {
    const information = AnimationSequence.information(this.title, this.summary, size,
      ['O(s + 1)', 'O(s² + 1)', 'O(s² + 1)'], 'Copy s triplets and insertion-sort them by row and column, then sum equal-coordinate runs. Sorted input is linear; reversed input is quadratic. The average row is a conservative upper bound without an ordering assumption.',
      ['O(s + 1)', 'O(s + 1)', 'O(s + 1)'], 'Temporary sorted records and new parallel arrays take linear storage. Preflight every summed value before publishing arrays; overflow preserves the original triplets.')
    return { ...information, terms: [
      { symbol: 's', meaning: `Original stored triplet or nonzero count for this run. Original count: ${size}.` },
      { symbol: 'O(s + 1)', meaning: 'An asymptotic upper bound expressed in s; includes the costs explained above.' },
      { symbol: 'O(s² + 1)', meaning: 'An asymptotic upper bound expressed in s; includes the costs explained above.' },
    ] }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new SparseCOOLayout(), 'coalesce', input, CoalesceAnimation.title, CoalesceAnimation.summary)
  }
}
