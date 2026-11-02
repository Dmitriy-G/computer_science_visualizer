import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'
import type { LinearInputValues, LinearModel } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { MonotonicQueueLayout } from '../MonotonicQueueLayout.ts'

export class PushAnimation extends LinearAnimation {
  public static readonly title = 'Push next window value'
  public static readonly summary = 'Expire old front indices, remove dominated back candidates, and append the next arrival.'

  public static describe(size: number): AlgorithmInformation {
    const information = AnimationSequence.information(this.title, this.summary, size,
      ['O(1)', 'O(1)', 'O(w)'], 'One push may remove w candidates. The average row is amortized across a stream: each arrival is appended once and removed at most once, giving O(1) amortized work. The window width w is ten in this model.',
      ['O(1)', 'O(1)', 'O(1)'], 'Allocate one linked candidate and overwrite one existing circular-history slot.')
    return { ...information, terms: [
      { symbol: 'n', meaning: `Original logical entry count for this run: n = ${size}.` },
      { symbol: 'w', meaning: 'Fixed sliding-window width: w = 10.' },
      { symbol: 'O(1)', meaning: 'Constant work or storage.' },
      { symbol: 'O(w)', meaning: 'Linear in the sliding-window width.' },
    ] }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new MonotonicQueueLayout(), 'enqueue', input, PushAnimation.title, PushAnimation.summary)
  }
}
