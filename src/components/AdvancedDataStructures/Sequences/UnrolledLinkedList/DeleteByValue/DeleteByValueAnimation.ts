import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'
import type { LinearInputValues, LinearModel } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { UnrolledLinkedListLayout } from '../UnrolledLinkedListLayout.ts'

export class DeleteByValueAnimation extends LinearAnimation {
  public static readonly title = 'Delete by value'
  public static readonly summary = 'Remove the first match, unlink an empty block, and merge a following block when it fits.'

  public static describe(size: number): AlgorithmInformation {
    const information = AnimationSequence.information(this.title, this.summary, size,
      ['O(1)', 'O(n)', 'O(n)'], 'A first-position match is constant work. Uniformly distributed matching positions require linear average work; a last match or miss scans all n values.',
      ['O(1)', 'O(1)', 'O(1)'], 'Only a fixed number of local variables are required.')
    return { ...information, terms: [
        { symbol: 'n', meaning: `Original logical size for this run: n = ${size}.` },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage.' },
        { symbol: 'O(n)', meaning: 'Linear in the original size.' },
    ] }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new UnrolledLinkedListLayout(), 'delete-value', input, DeleteByValueAnimation.title, DeleteByValueAnimation.summary)
  }
}
