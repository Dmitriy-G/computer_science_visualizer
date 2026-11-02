import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { QuotientFilterLayout } from '../QuotientFilterLayout.ts'

export class CheckMembershipAnimation extends LinearAnimation {
  public static readonly title = 'Check membership'
  public static readonly summary = 'Walk cluster metadata to the quotient run and compare sorted remainders.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(1)', average: 'O(b)', worst: 'O(b)', explanation: 'An unoccupied quotient proves absence immediately. Otherwise backward cluster discovery and synchronized quotient/run walks inspect at most a constant number of table passes. Animation snapshots and renderer work are excluded.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Keep only quotient, remainder, and circular positions. Fingerprint equality can be a false positive. Animation snapshots and renderer work are excluded.' },
      terms: [
        { symbol: 'b', meaning: 'Sixteen allocated quotient slots, with at least one empty slot.' },
        { symbol: 'O(1)', meaning: 'Constant additional work or storage in the stated operation model.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new QuotientFilterLayout(), 'search-value', input, CheckMembershipAnimation.title, CheckMembershipAnimation.summary)
  }
}
