import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { MultiQueueLayout } from '../MultiQueueLayout.ts'

export class DispatchAnimation extends LinearAnimation {
  public static readonly title = 'Dispatch next request'
  public static readonly summary = 'Scan queues from the cursor and remove the first available head.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'At most three queue heads are checked; removal changes cached endpoints and advances the cursor. Rows are upper bounds for this teaching variant; empty or early-return cases can finish sooner.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Includes working collections and output required by this operation. Playback clones, recorded trace frames, and scene snapshots are excluded.' },
      terms: [
        { symbol: 'O(1)', meaning: 'A fixed amount of work or storage under the stated universe, word, and capacity bounds.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {  }) {
    super(model, new MultiQueueLayout(), 'dequeue', input, DispatchAnimation.title, DispatchAnimation.summary)
  }
}
