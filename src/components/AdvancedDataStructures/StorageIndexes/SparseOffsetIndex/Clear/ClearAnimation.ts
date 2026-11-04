import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { SparseOffsetIndexLayout } from '../SparseOffsetIndexLayout.ts'

export class ClearAnimation extends LinearAnimation {
  public static readonly title = 'Clear'
  public static readonly summary = 'Release the stored representation.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', explanation: 'Release each stored record and its associated index metadata. Rows state upper bounds; empty, rejected, and early-return cases may finish sooner.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Includes operation working storage and returned output. Playback clones, trace snapshots, and scene storage are excluded. Empty operations can use constant storage.' },
      terms: [
        { symbol: 'n', meaning: `Logical entries before the operation; currently ${size}.` },
        { symbol: 'O(n)', meaning: 'The stated growth bound for this bounded representation.' },
        { symbol: 'O(1)', meaning: 'Additional working and output storage for the operation.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new SparseOffsetIndexLayout(), 'clear', input, ClearAnimation.title, ClearAnimation.summary)
  }
}
