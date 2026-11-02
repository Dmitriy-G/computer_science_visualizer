import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'
import type { LinearInputValues, LinearModel } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { FreeListLayout } from '../FreeListLayout.ts'

export class ClearAnimation extends LinearAnimation {
  public static readonly title = 'Release all slots'
  public static readonly summary = 'Inspect all pool slots and return every allocated one to the free chain.'

  public static describe(size: number): AlgorithmInformation {
    const information = AnimationSequence.information(this.title, this.summary, size,
      ['O(p)', 'O(p)', 'O(p)'], 'Inspect the entire fixed pool, including already-free slots. Here p = 10 even when the allocated count n is zero.',
      ['O(1)', 'O(1)', 'O(1)'], 'Only a fixed number of local variables are required.')
    return { ...information, terms: [
        { symbol: 'n', meaning: `Original logical size for this run: n = ${size}.` },
        { symbol: 'p', meaning: 'Number of preallocated pool slots: p = 10.' },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage.' },
        { symbol: 'O(p)', meaning: 'Linear in the fixed pool capacity.' },
    ] }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new FreeListLayout(), 'clear', input, ClearAnimation.title, ClearAnimation.summary)
  }
}
