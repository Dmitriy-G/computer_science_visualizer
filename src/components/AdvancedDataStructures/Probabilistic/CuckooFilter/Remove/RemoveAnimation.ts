import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { CuckooFilterLayout } from '../CuckooFilterLayout.ts'

export class RemoveAnimation extends LinearAnimation {
  public static readonly title = 'Remove a recorded value'
  public static readonly summary = 'Validate a recorded insertion before removing one matching fingerprint.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(1)', average: 'O(s)', worst: 'O(n + s)', explanation: 'Expected constant deletion-ledger access plus at most two buckets. An unrecorded value is rejected even when its fingerprint is a false positive. Animation snapshots and renderer work are excluded.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Only fingerprint, bucket, and occurrence-count temporaries are needed. Animation snapshots and renderer work are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Live fingerprint occurrences before this run: ${size}. The extra deletion ledger stores at most n distinct keys.` },
        { symbol: 's', meaning: 'Two fingerprint slots per cuckoo bucket.' },
        { symbol: 'O(1)', meaning: 'Constant additional work or storage in the stated operation model.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new CuckooFilterLayout(), 'delete-value', input, RemoveAnimation.title, RemoveAnimation.summary)
  }
}
