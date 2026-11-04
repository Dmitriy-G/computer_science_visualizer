import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { InvertedIndexLayout } from '../InvertedIndexLayout.ts'

export class InspectStorageAnimation extends LinearAnimation {
  public static readonly title = 'Inspect storage'
  public static readonly summary = 'Visit the stored entries and representation metadata.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(m n)', average: 'O(m n)', worst: 'O(m n)', explanation: 'Enumerates the actual representation. This is a conservative upper bound; diagram formatting and playback are separate visualization work. Rows are upper bounds for this teaching variant; empty or early-return cases can finish sooner.' },
      memory: { best: 'O(m n)', average: 'O(m n)', worst: 'O(m n)', explanation: 'Includes working collections and output required by this operation. Playback clones, recorded trace frames, and scene snapshots are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Logical entries before the operation; currently ${size}.` },
        { symbol: 'm', meaning: 'Input text length or the number of bounded words considered by this operation.' },
        { symbol: 'O(m n)', meaning: 'Work or storage bounded by the product of bounded term/input length and logical entry count.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {  }) {
    super(model, new InvertedIndexLayout(), 'inspect-storage', input, InspectStorageAnimation.title, InspectStorageAnimation.summary)
  }
}
