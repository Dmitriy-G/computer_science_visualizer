import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { OpenAddressingHashTableLayout } from '../OpenAddressingHashTableLayout.ts'

export class SearchByKeyAnimation extends LinearAnimation {
  public static readonly title = 'Look up a key'
  public static readonly summary = 'Follow this structure\'s hash locations and return the stored value or exact absence.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(1)', average: 'O(1)', worst: 'O(b)', explanation: 'Lookup follows a probe chain. Expected constant average assumes well-distributed home positions and bounded occupied load; worst case scans up to b slots. Division hashing is deterministic. Deleted slots count toward probe work; accumulated tombstones can make searches expensive even when live load is low.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Only a fixed number of references and counters are used. Existing storage, trace recording, and playback snapshots are excluded.' },
      terms: [
        { symbol: 'b', meaning: 'Number of physical slots (or slots in a larger table during rehash).' },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage under the stated assumptions.' },
        { symbol: 'O(b)', meaning: 'Work or storage proportional to allocated or attempted slots/buckets.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new OpenAddressingHashTableLayout(), 'search-value', input, SearchByKeyAnimation.title, SearchByKeyAnimation.summary)
  }
}
