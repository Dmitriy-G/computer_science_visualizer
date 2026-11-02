import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { CuckooFilterLayout } from '../CuckooFilterLayout.ts'

export class CheckMembershipAnimation extends LinearAnimation {
  public static readonly title = 'Check membership'
  public static readonly summary = 'Compare the fingerprint in its two candidate buckets.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(1)', average: 'O(s)', worst: 'O(s)', explanation: 'Inspect at most two buckets of s slots. Matching a short fingerprint means possibly present, never exact membership. Animation snapshots and renderer work are excluded.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Keep one fingerprint and two candidate bucket indices. Animation snapshots and renderer work are excluded.' },
      terms: [
        { symbol: 's', meaning: 'Two fingerprint slots per cuckoo bucket.' },
        { symbol: 'O(1)', meaning: 'Constant additional work or storage in the stated operation model.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new CuckooFilterLayout(), 'search-value', input, CheckMembershipAnimation.title, CheckMembershipAnimation.summary)
  }
}
