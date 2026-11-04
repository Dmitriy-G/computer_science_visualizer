import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { ExtendibleHashingLayout } from '../ExtendibleHashingLayout.ts'

export class DeleteByKeyAnimation extends LinearAnimation {
  public static readonly title = 'Delete a key'
  public static readonly summary = 'Remove a record from its bucket; retain directory size and local depths.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Directory indexing selects one bucket, whose fixed capacity is three. Lookup and deletion scan at most those three records, independent of directory length.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Only a fixed number of references and counters are used. Existing storage, trace recording, and playback snapshots are excluded.' },
      terms: [
        { symbol: 'O(1)', meaning: 'Constant work or additional storage under the stated assumptions.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new ExtendibleHashingLayout(), 'delete-value', input, DeleteByKeyAnimation.title, DeleteByKeyAnimation.summary)
  }
}
