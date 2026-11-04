import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { CountingBloomFilterLayout } from '../CountingBloomFilterLayout.ts'

export class CheckMembershipAnimation extends LinearAnimation {
  public static readonly title = 'Check membership'
  public static readonly summary = 'A zero counter proves absence; all positive counters mean possibly present.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(1)', average: 'O(k)', worst: 'O(k)', explanation: 'Read up to k hashed counters, stopping at zero. Positive membership is approximate; the exact deletion ledger is never queried. Animation snapshots and renderer work are excluded.' },
      memory: { best: 'O(k)', average: 'O(k)', worst: 'O(k)', explanation: 'Keep k hashed positions. No members are stored by the query. Animation snapshots and renderer work are excluded.' },
      terms: [
        { symbol: 'k', meaning: 'Three hash contributions per counting Bloom operation.' },
        { symbol: 'O(1)', meaning: 'Constant additional work or storage in the stated operation model.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new CountingBloomFilterLayout(), 'search-value', input, CheckMembershipAnimation.title, CheckMembershipAnimation.summary)
  }
}
