import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'
import type { LinearInputValues, LinearModel } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { SparseCOOLayout } from '../SparseCOOLayout.ts'

export class AppendTripletAnimation extends LinearAnimation {
  public static readonly title = 'Append triplet'
  public static readonly summary = 'Append a coordinate and value, retaining duplicates and explicit zero.'

  public static describe(size: number): AlgorithmInformation {
    const information = AnimationSequence.information(this.title, this.summary, size,
      ['O(1)', 'O(1)', 'O(s + 1)'], 'Three aligned array appends take amortized constant time over successful appends. A backing-array growth can copy s existing triplets; no duplicate scan is performed.',
      ['O(1)', 'O(1)', 'O(s + 1)'], 'One triplet adds constant storage amortized across appends; a growth can temporarily allocate O(s + 1) backing storage. Requests beyond 64 triplets are rejected before mutation.')
    return { ...information, terms: [
      { symbol: 's', meaning: `Original stored triplet or nonzero count for this run. Original count: ${size}.` },
      { symbol: 'O(1)', meaning: 'Constant work or additional storage.' },
      { symbol: 'O(s + 1)', meaning: 'An asymptotic upper bound expressed in s; includes the costs explained above.' },
    ] }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new SparseCOOLayout(), 'insert', input, AppendTripletAnimation.title, AppendTripletAnimation.summary)
  }
}
