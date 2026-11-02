import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'
import type { LinearInputValues, LinearModel } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { GapBufferLayout } from '../GapBufferLayout.ts'

export class DeleteAnimation extends LinearAnimation {
  public static readonly title = 'Delete text'
  public static readonly summary = 'Move the gap to the starting index and extend it across the selected span.'

  public static describe(size: number): AlgorithmInformation {
    const information = AnimationSequence.information(this.title, this.summary, size,
      ['O(k)', 'O(n + k)', 'O(n + k)'], 'At the current gap, k cells are cleared. An arbitrary or opposite-end position also requires O(n) character movement. No buffer growth is needed.',
      ['O(1)', 'O(1)', 'O(1)'], 'Only a fixed number of local variables are required.')
    return { ...information, terms: [
        { symbol: 'n', meaning: `Original logical size for this run: n = ${size}.` },
        { symbol: 'k', meaning: 'Number of characters selected for deletion.' },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage.' },
        { symbol: 'O(k)', meaning: 'Linear in the selected deletion length.' },
        { symbol: 'O(n + k)', meaning: 'Linear in original and deleted text lengths.' },
    ] }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new GapBufferLayout(), 'delete-index', input, DeleteAnimation.title, DeleteAnimation.summary)
  }
}
