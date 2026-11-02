import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'
import type { LinearInputValues, LinearModel } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { RopeLayout } from '../RopeLayout.ts'

export class SearchByIndexAnimation extends LinearAnimation {
  public static readonly title = 'Read character by index'
  public static readonly summary = 'Compare the index with cached left weights to find its leaf and local offset.'

  public static describe(size: number): AlgorithmInformation {
    const information = AnimationSequence.information(this.title, this.summary, size,
      ['O(log n)', 'O(log n)', 'O(log n)'], 'Four-character leaves in an AVL-balanced tree give logarithmic root-to-leaf traversal. Empty ropes cannot be indexed; a single leaf takes O(1). Iterative lookup uses a constant number of references.',
      ['O(1)', 'O(1)', 'O(1)'], 'Only a fixed number of local variables are required.')
    return { ...information, terms: [
        { symbol: 'n', meaning: `Original logical size for this run: n = ${size}.` },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage.' },
        { symbol: 'O(log n)', meaning: 'Logarithmic in the original size.' },
    ] }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new RopeLayout(), 'search-index', input, SearchByIndexAnimation.title, SearchByIndexAnimation.summary)
  }
}
