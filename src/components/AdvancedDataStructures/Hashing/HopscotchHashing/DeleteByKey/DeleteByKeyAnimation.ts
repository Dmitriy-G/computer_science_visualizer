import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { HopscotchHashingLayout } from '../HopscotchHashingLayout.ts'

export class DeleteByKeyAnimation extends LinearAnimation {
  public static readonly title = 'Delete a key'
  public static readonly summary = 'Remove the entry and clear its offset bit in the home neighborhood map.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'The home bitmap names at most four legal offsets. Lookup and deletion inspect only these offsets, so collisions elsewhere do not lengthen this fixed-neighborhood operation.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Only a fixed number of references and counters are used. Existing storage, trace recording, and playback snapshots are excluded.' },
      terms: [
        { symbol: 'O(1)', meaning: 'Constant work or additional storage under the stated assumptions.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new HopscotchHashingLayout(), 'delete-value', input, DeleteByKeyAnimation.title, DeleteByKeyAnimation.summary)
  }
}
