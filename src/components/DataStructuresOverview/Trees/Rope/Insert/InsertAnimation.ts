import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'
import type { LinearInputValues, LinearModel } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { RopeLayout } from '../RopeLayout.ts'

export class InsertAnimation extends LinearAnimation {
  public static readonly title = 'Insert text'
  public static readonly summary = 'Split at the index, build text chunks, and AVL-join prefix, text, and suffix.'

  public static describe(size: number): AlgorithmInformation {
    const information = AnimationSequence.information(this.title, this.summary, size,
      ['O(m + log n)', 'O(m + log n)', 'O(m + log n)'], 'For a nonempty AVL rope, split and join follow logarithmic paths; building inserted text costs O(m). Empty text storage takes O(m). Bounds describe the tree operation, excluding rendering and snapshots.',
      ['O(m + log n)', 'O(m + log n)', 'O(m + log n)'], 'Inserted leaves and immutable copies of the split/join paths require O(m + log n) new nodes and recursion storage. Untouched subtrees are shared.')
    return { ...information, terms: [
        { symbol: 'n', meaning: `Original logical size for this run: n = ${size}.` },
        { symbol: 'm', meaning: 'Number of characters supplied for insertion or search; each request allows 1 to 32 ASCII characters.' },
        { symbol: 'O(m + log n)', meaning: 'New-text work or storage plus logarithmic tree paths.' },
    ] }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new RopeLayout(), 'insert', input, InsertAnimation.title, InsertAnimation.summary)
  }
}
