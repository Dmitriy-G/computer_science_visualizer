import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { CuckooFilterLayout } from '../CuckooFilterLayout.ts'

export class ClearAnimation extends LinearAnimation {
  public static readonly title = 'Clear'
  public static readonly summary = 'Empty all fingerprint slots and the deletion guard.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(bs + n)', average: 'O(bs + n)', worst: 'O(bs + n)', explanation: 'Reset each bucket and clear the extra exact-key ledger. Animation snapshots and renderer work are excluded.' },
      memory: { best: 'O(bs)', average: 'O(bs)', worst: 'O(bs)', explanation: 'Allocate empty bucket arrays while replacing old arrays; the old representation is released. Animation snapshots and renderer work are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Live fingerprint occurrences before this run: ${size}. The extra deletion ledger stores at most n distinct keys.` },
        { symbol: 'b', meaning: 'Eight allocated cuckoo fingerprint buckets.' },
        { symbol: 's', meaning: 'Two fingerprint slots per cuckoo bucket.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new CuckooFilterLayout(), 'clear', input, ClearAnimation.title, ClearAnimation.summary)
  }
}
