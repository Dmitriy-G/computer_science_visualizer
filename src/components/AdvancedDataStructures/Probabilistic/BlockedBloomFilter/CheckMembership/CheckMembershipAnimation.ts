import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { BlockedBloomFilterLayout } from '../BlockedBloomFilterLayout.ts'

export class CheckMembershipAnimation extends LinearAnimation {
  public static readonly title = 'Check membership'
  public static readonly summary = 'Stop at a zero bit or report possibly present.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'At most three probes are checked in one block. Positives can be false positives; an inserted value never becomes negative until clear. Rows are upper bounds for this teaching variant; empty or early-return cases can finish sooner.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Includes working collections and output required by this operation. Playback clones, recorded trace frames, and scene snapshots are excluded.' },
      terms: [
        { symbol: 'O(1)', meaning: 'A fixed amount of work or storage under the stated universe, word, and capacity bounds.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = { value: 10 }) {
    super(model, new BlockedBloomFilterLayout(), 'search-value', input, CheckMembershipAnimation.title, CheckMembershipAnimation.summary)
  }
}
