import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { CountingBloomFilterLayout } from '../CountingBloomFilterLayout.ts'

export class ClearAnimation extends LinearAnimation {
  public static readonly title = 'Clear'
  public static readonly summary = 'Reset counters and the exact deletion guard.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(m + n)', average: 'O(m + n)', worst: 'O(m + n)', explanation: 'Reset every counter and release the extra exact-key deletion ledger. Animation snapshots and renderer work are excluded.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Reset existing counters in place and clear the ledger; snapshots are excluded. Animation snapshots and renderer work are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Live recorded insertions before this run: ${size}. The extra deletion ledger stores at most n distinct keys.` },
        { symbol: 'm', meaning: 'Number of four-bit counters: 32 in this lesson.' },
        { symbol: 'O(1)', meaning: 'Constant additional work or storage in the stated operation model.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new CountingBloomFilterLayout(), 'clear', input, ClearAnimation.title, ClearAnimation.summary)
  }
}
