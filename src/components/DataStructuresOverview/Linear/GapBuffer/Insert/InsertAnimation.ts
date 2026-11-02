import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'
import type { LinearInputValues, LinearModel } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { GapBufferLayout } from '../GapBufferLayout.ts'

export class InsertAnimation extends LinearAnimation {
  public static readonly title = 'Insert text'
  public static readonly summary = 'Move the gap to an index, grow it if needed, and write text into it.'

  public static describe(size: number): AlgorithmInformation {
    const information = AnimationSequence.information(this.title, this.summary, size,
      ['O(m)', 'O(n + m)', 'O(n + m)'], 'At the current gap with sufficient space, only m characters are written. Arbitrary cursor positions can move O(n) characters, and backing-buffer growth can copy O(n + m) cells. Average assumes arbitrary edit positions; empty input takes O(m).',
      ['O(1)', 'O(n + m)', 'O(n + m)'], 'Existing gap space needs only local variables. Growth can allocate a replacement backing buffer proportional to old and inserted text.')
    return { ...information, terms: [
        { symbol: 'n', meaning: `Original logical size for this run: n = ${size}.` },
        { symbol: 'm', meaning: 'Number of characters supplied for insertion or search; each request allows 1 to 32 ASCII characters.' },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage.' },
        { symbol: 'O(m)', meaning: 'Linear in the supplied text length.' },
        { symbol: 'O(n + m)', meaning: 'Linear in original and supplied text lengths.' },
    ] }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new GapBufferLayout(), 'insert', input, InsertAnimation.title, InsertAnimation.summary)
  }
}
