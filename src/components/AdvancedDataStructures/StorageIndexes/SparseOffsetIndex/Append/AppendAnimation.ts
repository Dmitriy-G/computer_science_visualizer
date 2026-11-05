import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { SparseOffsetIndexLayout } from '../SparseOffsetIndexLayout.ts'

export class AppendAnimation extends LinearAnimation {
  public static readonly title = 'Append a record'
  public static readonly summary = 'Append encoded log bytes and periodically add an offset checkpoint.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(1)', average: 'O(1)', worst: 'O(n)', explanation: 'Encode one fixed-size safe-integer record and add a checkpoint every third record. Average denotes amortized array append, not a random-input average. Growing record or checkpoint storage may copy O(n) slots in one operation.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(n)', explanation: 'A record and at most one summary/checkpoint use constant new storage without growth. Average allocation is amortized over insertions; one backing-array growth can allocate O(n) slots. Playback clones and snapshots are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Stored records before this append: n = ${size}.` },
        { symbol: 'O(n)', meaning: 'Linear work or allocation during backing-array growth.' },
        { symbol: 'O(1)', meaning: 'The stated growth bound for this bounded representation.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new SparseOffsetIndexLayout(), 'insert-end', input, AppendAnimation.title, AppendAnimation.summary)
  }
}
