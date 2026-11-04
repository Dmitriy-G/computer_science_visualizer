import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'
import type { LinearInputValues, LinearModel } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { FibonacciHeapLayout } from '../FibonacciHeapLayout.ts'

export class DecreaseKeyAnimation extends LinearAnimation {
  public static readonly title = 'Decrease a key by ID'
  public static readonly summary = 'Locate a stable handle, lower its key, and perform cuts and cascading loss-mark repair.'

  public static describe(size: number): AlgorithmInformation {
    const information = AnimationSequence.information(this.title, this.summary, size,
      ['O(1)', 'O(1)', 'O(n)'], 'With expected constant Map lookup, a nonviolating decrease is constant work. The average row is amortized across operation sequences: loss marks bound cascading-cut work. A single cascade can follow a linear parent chain; a larger replacement is rejected unchanged.',
      ['O(1)', 'O(n)', 'O(n)'], 'Recursive cascading cuts can require linear call-stack space in one operation; constant space suffices when no cascade occurs.')
    return { ...information, terms: [
      { symbol: 'n', meaning: `Original logical entry count for this run: n = ${size}.` },
      { symbol: 'O(1)', meaning: 'Constant work or storage.' },
      { symbol: 'O(n)', meaning: 'Linear in the original entry count.' },
    ] }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new FibonacciHeapLayout(), 'decrease-key', input, DecreaseKeyAnimation.title, DecreaseKeyAnimation.summary)
  }
}
