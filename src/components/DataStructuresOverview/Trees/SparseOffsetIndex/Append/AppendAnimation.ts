import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { SparseOffsetIndexLayout } from '../SparseOffsetIndexLayout.ts'

export class AppendAnimation extends LinearAnimation {
  public static readonly title = 'Append a record'
  public static readonly summary = 'Append encoded log bytes and periodically add an offset checkpoint.'

  public static describe(_size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Encode one fixed-size safe-integer record and add a checkpoint every third record. Rows state upper bounds; empty, rejected, and early-return cases may finish sooner.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Includes operation working storage and returned output. Playback clones, trace snapshots, and scene storage are excluded. Empty operations can use constant storage.' },
      terms: [
        { symbol: 'O(1)', meaning: 'The stated growth bound for this bounded representation.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new SparseOffsetIndexLayout(), 'insert-end', input, AppendAnimation.title, AppendAnimation.summary)
  }
}
