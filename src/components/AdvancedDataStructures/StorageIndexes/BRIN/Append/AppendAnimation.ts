import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { BRINLayout } from '../BRINLayout.ts'

export class AppendAnimation extends LinearAnimation {
  public static readonly title = 'Append a record'
  public static readonly summary = 'Append a heap value and maintain its page-range summary.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(1)', average: 'O(1)', worst: 'O(n)', explanation: 'Append one record and widen one cached min/max pair. The three-record page-range size is fixed. Average denotes amortized array append, not a random-input average. Growing record or checkpoint storage may copy O(n) slots in one operation.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(n)', explanation: 'A record and at most one summary/checkpoint use constant new storage without growth. Average allocation is amortized over insertions; one backing-array growth can allocate O(n) slots. Playback clones and snapshots are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Stored records before this append: n = ${size}.` },
        { symbol: 'O(n)', meaning: 'Linear work or allocation during backing-array growth.' },
        { symbol: 'O(1)', meaning: 'The stated growth bound for this bounded representation.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new BRINLayout(), 'insert-end', input, AppendAnimation.title, AppendAnimation.summary)
  }
}
