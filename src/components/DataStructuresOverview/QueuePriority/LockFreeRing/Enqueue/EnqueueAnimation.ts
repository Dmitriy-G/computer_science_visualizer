import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { LockFreeRingLayout } from '../LockFreeRingLayout.ts'

export class EnqueueAnimation extends LinearAnimation {
  public static readonly title = 'Enqueue and publish'
  public static readonly summary = 'Check the producer sequence, write a value, and publish the slot.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'One slot-sequence check and a fixed number of counter/payload updates are simulated without contention. Rows are upper bounds for this teaching variant; empty or early-return cases can finish sooner.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Includes working collections and output required by this operation. Playback clones, recorded trace frames, and scene snapshots are excluded.' },
      terms: [
        { symbol: 'O(1)', meaning: 'A fixed amount of work or storage under the stated universe, word, and capacity bounds.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = { value: 99 }) {
    super(model, new LockFreeRingLayout(), 'enqueue', input, EnqueueAnimation.title, EnqueueAnimation.summary)
  }
}
