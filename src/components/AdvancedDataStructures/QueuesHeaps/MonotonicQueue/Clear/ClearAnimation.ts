import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'
import type { LinearInputValues, LinearModel } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { MonotonicQueueLayout } from '../MonotonicQueueLayout.ts'

export class ClearAnimation extends LinearAnimation {
  public static readonly title = 'Clear window'
  public static readonly summary = 'Release the candidate endpoints and replace the ten-slot history buffer.'

  public static describe(size: number): AlgorithmInformation {
    const information = AnimationSequence.information(this.title, this.summary, size,
      ['O(w)', 'O(w)', 'O(w)'], 'Initialize w empty history slots and replace both candidate endpoints. Deferred garbage collection of the old candidate chain is outside this reset.',
      ['O(w)', 'O(w)', 'O(w)'], 'Allocate a fresh fixed-width history buffer.')
    return { ...information, terms: [
      { symbol: 'n', meaning: `Original logical entry count for this run: n = ${size}.` },
      { symbol: 'w', meaning: 'Fixed sliding-window width: w = 10.' },
      { symbol: 'O(w)', meaning: 'Linear in the sliding-window width.' },
    ] }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new MonotonicQueueLayout(), 'clear', input, ClearAnimation.title, ClearAnimation.summary)
  }
}
