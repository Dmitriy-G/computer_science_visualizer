import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'
import type { LinearInputValues, LinearModel } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { UnrolledLinkedListLayout } from '../UnrolledLinkedListLayout.ts'

export class InsertAnimation extends LinearAnimation {
  public static readonly title = 'Insert at index'
  public static readonly summary = 'Locate the block, split it if full, and shift values only within that block.'

  public static describe(size: number): AlgorithmInformation {
    const information = AnimationSequence.information(this.title, this.summary, size,
      ['O(1)', 'O(n)', 'O(n)'], 'Insertion into the first block is constant work. Reaching a uniformly distributed index or the last block takes O(n) with the fixed four-value block capacity. A split allocates one constant-sized block.',
      ['O(1)', 'O(1)', 'O(1)'], 'Only a fixed number of local variables are required.')
    return { ...information, terms: [
        { symbol: 'n', meaning: `Original logical size for this run: n = ${size}.` },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage.' },
        { symbol: 'O(n)', meaning: 'Linear in the original size.' },
    ] }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new UnrolledLinkedListLayout(), 'insert', input, InsertAnimation.title, InsertAnimation.summary)
  }
}
