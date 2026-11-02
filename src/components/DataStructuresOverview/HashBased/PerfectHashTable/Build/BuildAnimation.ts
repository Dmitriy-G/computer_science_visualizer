import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { PerfectHashTableLayout } from '../PerfectHashTableLayout.ts'

export class BuildAnimation extends LinearAnimation {
  public static readonly title = 'Build key set'
  public static readonly summary = 'Construct a complete static set of distinct keys with collision-free second-level tables.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(k)', average: 'O(k)', worst: 'O(k)', explanation: 'At most 128 primary trials and 128 secondary trials per bucket are executed. Accepted primary partitions have total secondary space at most 4k; fixed trial budgets give an O(k) upper bound for every input distribution, including rejection. Ideal FKS has expected linear randomized construction; this seeded bounded search can fail unchanged.' },
      memory: { best: 'O(k)', average: 'O(k)', worst: 'O(k)', explanation: 'New records, primary groups, and collision-free secondary allocations occupy O(k) reachable storage; an old committed table remains available until success. Existing storage and playback snapshots are excluded.' },
      terms: [
        { symbol: 'k', meaning: 'Number of distinct keys in the newly supplied static set (1 to 64).' },
        { symbol: 'O(k)', meaning: 'Work or storage proportional to the newly supplied distinct key count.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new PerfectHashTableLayout(), 'build-values', input, BuildAnimation.title, BuildAnimation.summary)
  }
}
