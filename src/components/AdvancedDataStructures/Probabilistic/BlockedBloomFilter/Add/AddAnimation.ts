import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { BlockedBloomFilterLayout } from '../BlockedBloomFilterLayout.ts'

export class AddAnimation extends LinearAnimation {
  public static readonly title = 'Add a value'
  public static readonly summary = 'Select a block and set three bits within it.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Safe-integer strings have bounded width; four deterministic hashes and three bit updates have fixed cost. Duplicate additions count as operations. Rows are upper bounds for this teaching variant; empty or early-return cases can finish sooner.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Includes working collections and output required by this operation. Playback clones, recorded trace frames, and scene snapshots are excluded.' },
      terms: [
        { symbol: 'O(1)', meaning: 'A fixed amount of work or storage under the stated universe, word, and capacity bounds.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = { value: 99 }) {
    super(model, new BlockedBloomFilterLayout(), 'insert', input, AddAnimation.title, AddAnimation.summary)
  }
}
