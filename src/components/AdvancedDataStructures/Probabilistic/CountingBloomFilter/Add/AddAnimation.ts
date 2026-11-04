import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { CountingBloomFilterLayout } from '../CountingBloomFilterLayout.ts'

export class AddAnimation extends LinearAnimation {
  public static readonly title = 'Add a value'
  public static readonly summary = 'Increment three hashed counters; reject overflow before any counter changes.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(k)', average: 'O(k)', worst: 'O(n + k)', explanation: 'Three hash contributions are aggregated before mutation. The extra deletion ledger has expected constant lookup and up to linear worst-case work. Counter overflow and the 64-live-insertion limit reject atomically. Animation snapshots and renderer work are excluded.' },
      memory: { best: 'O(k)', average: 'O(k)', worst: 'O(k)', explanation: 'The temporary multiplicity map stores at most k positions; one ledger entry may be added. Persistent storage is m counters plus an O(n) exact deletion ledger. Animation snapshots and renderer work are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Live recorded insertions before this run: ${size}. The extra deletion ledger stores at most n distinct keys.` },
        { symbol: 'k', meaning: 'Three hash contributions per counting Bloom operation.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new CountingBloomFilterLayout(), 'insert', input, AddAnimation.title, AddAnimation.summary)
  }
}
