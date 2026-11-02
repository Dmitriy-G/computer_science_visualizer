import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'
import type { LinearInputValues, LinearModel } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { RopeLayout } from '../RopeLayout.ts'

export class DeleteAnimation extends LinearAnimation {
  public static readonly title = 'Delete text'
  public static readonly summary = 'Split around the selected span and join the surviving sides.'

  public static describe(size: number): AlgorithmInformation {
    const information = AnimationSequence.information(this.title, this.summary, size,
      ['O(log n)', 'O(log n)', 'O(log n)'], 'Two splits and an AVL join follow logarithmic paths. Releasing this root does not traverse shared discarded nodes; their eventual garbage collection is outside the operation. Empty ropes cannot be indexed.',
      ['O(log n)', 'O(log n)', 'O(log n)'], 'Immutable split/join paths and recursive call stacks use O(log n) additional storage. The removed span is not copied.')
    return { ...information, terms: [
        { symbol: 'n', meaning: `Original logical size for this run: n = ${size}.` },
        { symbol: 'O(log n)', meaning: 'Logarithmic in the original size.' },
    ] }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new RopeLayout(), 'delete-index', input, DeleteAnimation.title, DeleteAnimation.summary)
  }
}
