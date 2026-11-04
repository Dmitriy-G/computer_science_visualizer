import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { MultiQueueLayout } from '../MultiQueueLayout.ts'

export class EnqueueAnimation extends LinearAnimation {
  public static readonly title = 'Enqueue a request'
  public static readonly summary = 'Append a request to one of the three staging queues.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Cached head and tail pointers append one new linked request node. Rows are upper bounds for this teaching variant; empty or early-return cases can finish sooner.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Includes working collections and output required by this operation. Playback clones, recorded trace frames, and scene snapshots are excluded.' },
      terms: [
        { symbol: 'O(1)', meaning: 'A fixed amount of work or storage under the stated universe, word, and capacity bounds.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = { queue: 0, value: 99 }) {
    super(model, new MultiQueueLayout(), 'enqueue', input, EnqueueAnimation.title, EnqueueAnimation.summary)
  }
}
