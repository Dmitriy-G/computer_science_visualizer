import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { SeparateChainingHashTableLayout } from '../SeparateChainingHashTableLayout.ts'

export class InsertAnimation extends LinearAnimation {
  public static readonly title = 'Insert / update'
  public static readonly summary = 'Follow a bucket chain, update an existing key, or link a new head; rehash above 0.75 load.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(1)', average: 'O(1)', worst: 'O(n + b)', explanation: 'An existing head match or empty bucket is constant. Expected amortized constant insertion assumes well-distributed hashes and bounded load. A resize visits all buckets and records, taking O(n + b); a bad chain also requires linear comparisons.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(b)', explanation: 'One node normally; rehash allocates O(b) bucket heads and relinks existing nodes. Expected amortized allocation is O(1) over insertion-only sequences. Trace and playback storage are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Original entry count for this run: n = ${size}.` },
        { symbol: 'b', meaning: 'Number of allocated bucket heads; resizing doubles this count.' },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage under the stated assumptions.' },
        { symbol: 'O(n + b)', meaning: 'Work or storage proportional to entries plus allocated buckets or slots.' },
        { symbol: 'O(b)', meaning: 'Work or storage proportional to allocated or attempted slots/buckets.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new SeparateChainingHashTableLayout(), 'insert', input, InsertAnimation.title, InsertAnimation.summary)
  }
}
