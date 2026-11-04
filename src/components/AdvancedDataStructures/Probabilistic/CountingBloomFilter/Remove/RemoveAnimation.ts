import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { CountingBloomFilterLayout } from '../CountingBloomFilterLayout.ts'

export class RemoveAnimation extends LinearAnimation {
  public static readonly title = 'Remove a recorded value'
  public static readonly summary = 'Use the insertion ledger to guard deletion, then decrement all hash contributions.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(1)', average: 'O(k)', worst: 'O(n + k)', explanation: 'Reject unrecorded values before mutation. With expected constant ledger access, decrement at most k distinct counters. Duplicate positions contribute repeatedly. Animation snapshots and renderer work are excluded.' },
      memory: { best: 'O(k)', average: 'O(k)', worst: 'O(k)', explanation: 'Store at most k position multiplicities. Removing a ledger occurrence does not allocate new filter capacity. Animation snapshots and renderer work are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Live recorded insertions before this run: ${size}. The extra deletion ledger stores at most n distinct keys.` },
        { symbol: 'k', meaning: 'Three hash contributions per counting Bloom operation.' },
        { symbol: 'O(1)', meaning: 'Constant additional work or storage in the stated operation model.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new CountingBloomFilterLayout(), 'delete-value', input, RemoveAnimation.title, RemoveAnimation.summary)
  }
}
