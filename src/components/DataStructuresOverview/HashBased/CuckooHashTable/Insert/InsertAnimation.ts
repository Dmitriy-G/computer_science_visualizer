import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { CuckooHashTableLayout } from '../CuckooHashTableLayout.ts'

export class InsertAnimation extends LinearAnimation {
  public static readonly title = 'Insert / update'
  public static readonly summary = 'Try one of two candidate slots, alternate evictions, and rebuild with fresh seeded functions when needed.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(1)', average: 'O(nb)', worst: 'O(nb)', explanation: 'An empty legal candidate is constant. This deterministic teaching variant snapshots displacement attempts and tries at most eight rebuilds; each rebuild may insert n records with O(b) kicks each. Average O(nb) is a conservative upper bound without random assumptions. Ideal randomized cuckoo expected-amortized O(1) insertion is not claimed for this bounded implementation.' },
      memory: { best: 'O(1)', average: 'O(n + b)', worst: 'O(n + b)', explanation: 'A direct placement uses one record. Displacement rollback copies slot arrays; rebuild also holds record lists and candidate tables, using O(n + b) additional reachable storage. Playback is excluded.' },
      terms: [
        { symbol: 'n', meaning: `Original entry count for this run: n = ${size}.` },
        { symbol: 'b', meaning: 'Largest per-table slot capacity used by a bounded rebuild attempt, at most 256.' },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage under the stated assumptions.' },
        { symbol: 'O(nb)', meaning: 'A conservative upper bound proportional to records times slot capacity.' },
        { symbol: 'O(n + b)', meaning: 'Work or storage proportional to entries plus allocated buckets or slots.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new CuckooHashTableLayout(), 'insert', input, InsertAnimation.title, InsertAnimation.summary)
  }
}
