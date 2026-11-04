import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { TimeIndexLayout } from '../TimeIndexLayout.ts'

export class AppendAnimation extends LinearAnimation {
  public static readonly title = 'Append a timestamped record'
  public static readonly summary = 'Append a log value and maintain timestamp checkpoints.'

  public static describe(_size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Maintain the running maximum timestamp and add one checkpoint per three records. Rows state upper bounds; empty, rejected, and early-return cases may finish sooner.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Includes operation working storage and returned output. Playback clones, trace snapshots, and scene storage are excluded. Empty operations can use constant storage.' },
      terms: [
        { symbol: 'O(1)', meaning: 'The stated growth bound for this bounded representation.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new TimeIndexLayout(), 'insert-end', input, AppendAnimation.title, AppendAnimation.summary)
  }
}
