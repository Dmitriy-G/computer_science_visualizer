import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { ExtendibleHashingLayout } from '../ExtendibleHashingLayout.ts'

export class InsertAnimation extends LinearAnimation {
  public static readonly title = 'Insert / update'
  public static readonly summary = 'Split full three-record buckets and double the directory only when local and global depths match.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(1)', average: 'O(n + D)', worst: 'O(n + D)', explanation: 'An existing match or a bucket with room is constant. A full bucket snapshots n records and D aliases for rollback, then performs at most eight depth increases. Geometric directory doubling and alias redirection cost O(n + D). Average is a conservative upper bound without uniform-hash assumptions; depth exhaustion rejects unchanged.' },
      memory: { best: 'O(1)', average: 'O(n + D)', worst: 'O(n + D)', explanation: 'A normal insert allocates one record. Splitting retains a rollback copy and expanded directory, bounded by O(n + D) additional references and buckets. Scene snapshots are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Original entry count for this run: n = ${size}.` },
        { symbol: 'D', meaning: 'Directory entries in the largest attempted directory, at most 256.' },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage under the stated assumptions.' },
        { symbol: 'O(n + D)', meaning: 'Work or storage proportional to records plus directory entries.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new ExtendibleHashingLayout(), 'insert', input, InsertAnimation.title, InsertAnimation.summary)
  }
}
