import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'
import type { LinearInputValues, LinearModel } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { FreeListLayout } from '../FreeListLayout.ts'

export class AllocateAnimation extends LinearAnimation {
  public static readonly title = 'Allocate a slot'
  public static readonly summary = 'Pop the free-chain head and store a value; reject exhaustion.'

  public static describe(size: number): AlgorithmInformation {
    const information = AnimationSequence.information(this.title, this.summary, size,
      ['O(1)', 'O(1)', 'O(1)'], 'Read the cached free head, update at most one next link, and write one pool slot. Exhaustion also returns immediately.',
      ['O(1)', 'O(1)', 'O(1)'], 'Only a fixed number of local variables are required.')
    return { ...information, terms: [
        { symbol: 'n', meaning: `Original logical size for this run: n = ${size}.` },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage.' },
    ] }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new FreeListLayout(), 'allocate', input, AllocateAnimation.title, AllocateAnimation.summary)
  }
}
