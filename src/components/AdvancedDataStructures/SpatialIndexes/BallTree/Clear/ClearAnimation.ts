import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { BallTreeLayout } from '../BallTreeLayout.ts'

export class ClearAnimation extends LinearAnimation {
  public static readonly title = 'Clear'
  public static readonly summary = 'Release the stored representation while preserving stable ID allocation.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', explanation: 'The displayed bound allows visiting or dropping the stored entries. Garbage collection of unreachable storage is outside the model operation; no new input-sized structure is retained. Rows are upper bounds for this teaching variant; empty or early-return cases can finish sooner.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Includes working collections and output required by this operation. Playback clones, recorded trace frames, and scene snapshots are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Logical entries before the operation; currently ${size}.` },
        { symbol: 'O(n)', meaning: 'Linear work or storage in the logical entry count.' },
        { symbol: 'O(1)', meaning: 'Constant work or storage under the stated fixed word, universe, or capacity bounds.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {  }) {
    super(model, new BallTreeLayout(), 'clear', input, ClearAnimation.title, ClearAnimation.summary)
  }
}
