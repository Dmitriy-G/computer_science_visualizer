import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { XArrayLayout } from '../XArrayLayout.ts'

export class StoreAnimation extends LinearAnimation {
  public static readonly title = 'Store at index'
  public static readonly summary = 'Allocate a radix branch if needed and store one indexed value.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'The fixed 12-bit universe requires two radix selections and at most one 64-slot leaf allocation. Rows are upper bounds for this teaching variant; empty or early-return cases can finish sooner.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Includes working collections and output required by this operation. Playback clones, recorded trace frames, and scene snapshots are excluded.' },
      terms: [
        { symbol: 'O(1)', meaning: 'A fixed amount of work or storage under the stated universe, word, and capacity bounds.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = { index: 12, value: 99 }) {
    super(model, new XArrayLayout(), 'update-index', input, StoreAnimation.title, StoreAnimation.summary)
  }
}
