import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { LSHIndexLayout } from '../LSHIndexLayout.ts'

export class InsertAnimation extends LinearAnimation {
  public static readonly title = 'Insert and encode a vector'
  public static readonly summary = 'Compute eight projection signs and retain the vector code.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', explanation: 'Eight projections have fixed cost; the conservative per-operation bound includes possible JavaScript backing-array growth. Rows are upper bounds for this teaching variant; empty or early-return cases can finish sooner.' },
      memory: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', explanation: 'Includes working collections and output required by this operation. Playback clones, recorded trace frames, and scene snapshots are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Logical entries before the operation; currently ${size}.` },
        { symbol: 'O(n)', meaning: 'Linear work or storage in the logical entry count.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = { x: 10, y: 10 }) {
    super(model, new LSHIndexLayout(), 'insert', input, InsertAnimation.title, InsertAnimation.summary)
  }
}
