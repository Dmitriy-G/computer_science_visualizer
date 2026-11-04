import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { IVFIndexLayout } from '../IVFIndexLayout.ts'

export class InspectStorageAnimation extends LinearAnimation {
  public static readonly title = 'Inspect storage'
  public static readonly summary = 'Visit the actual representation and its metadata.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', explanation: 'Visit all stored records and index entries once. The index size is bounded by the record count. Inspection materializes a diagram containing O(n) entries. Rows state upper bounds; empty, rejected, and early-return cases may finish sooner.' },
      memory: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', explanation: 'Includes operation working storage and returned output. Playback clones, trace snapshots, and scene storage are excluded. Empty operations can use constant storage.' },
      terms: [
        { symbol: 'n', meaning: `Logical entries before the operation; currently ${size}.` },
        { symbol: 'O(n)', meaning: 'The stated growth bound for this bounded representation.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new IVFIndexLayout(), 'inspect-storage', input, InspectStorageAnimation.title, InspectStorageAnimation.summary)
  }
}
