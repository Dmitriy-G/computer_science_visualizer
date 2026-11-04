import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { CuckooHashTableLayout } from '../CuckooHashTableLayout.ts'

export class SearchByKeyAnimation extends LinearAnimation {
  public static readonly title = 'Look up a key'
  public static readonly summary = 'Follow this structure\'s hash locations and return the stored value or exact absence.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Lookup and deletion inspect exactly two candidate positions at most; placement does not depend on a probe chain. Hash arithmetic uses bounded safe-integer words.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Only a fixed number of references and counters are used. Existing storage, trace recording, and playback snapshots are excluded.' },
      terms: [
        { symbol: 'O(1)', meaning: 'Constant work or additional storage under the stated assumptions.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new CuckooHashTableLayout(), 'search-value', input, SearchByKeyAnimation.title, SearchByKeyAnimation.summary)
  }
}
