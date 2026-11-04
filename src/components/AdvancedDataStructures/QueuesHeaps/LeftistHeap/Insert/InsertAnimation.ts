import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'
import type { LinearInputValues, LinearModel } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { LeftistHeapLayout } from '../LeftistHeapLayout.ts'

export class InsertAnimation extends LinearAnimation {
  public static readonly title = 'Insert a value'
  public static readonly summary = 'Meld a singleton and repair null-path ranks.'

  public static describe(size: number): AlgorithmInformation {
    const information = AnimationSequence.information(this.title, this.summary, size,
      ['O(1)', 'O(log n)', 'O(log n)'], 'Leftist ranks bound the traversed right spines logarithmically; swaps restore rank(left) >= rank(right). An empty heap is constant work.',
      ['O(1)', 'O(log n)', 'O(log n)'], 'Allocate one node and use a recursive merge stack bounded by the traversed path.')
    return { ...information, terms: [
      { symbol: 'n', meaning: `Original logical entry count for this run: n = ${size}.` },
      { symbol: 'O(1)', meaning: 'Constant work or storage.' },
      { symbol: 'O(log n)', meaning: 'Logarithmic in the original entry count.' },
    ] }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new LeftistHeapLayout(), 'insert', input, InsertAnimation.title, InsertAnimation.summary)
  }
}
