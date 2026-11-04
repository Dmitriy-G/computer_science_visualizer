import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { LockFreeRingLayout } from '../LockFreeRingLayout.ts'

export class DequeueAnimation extends LinearAnimation {
  public static readonly title = 'Dequeue and release'
  public static readonly summary = 'Check the consumer sequence, read a value, and release its slot.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'One sequence check and fixed counter updates consume a published slot, or report empty. Rows are upper bounds for this teaching variant; empty or early-return cases can finish sooner.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Includes working collections and output required by this operation. Playback clones, recorded trace frames, and scene snapshots are excluded.' },
      terms: [
        { symbol: 'O(1)', meaning: 'A fixed amount of work or storage under the stated universe, word, and capacity bounds.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {  }) {
    super(model, new LockFreeRingLayout(), 'dequeue', input, DequeueAnimation.title, DequeueAnimation.summary)
  }
}
