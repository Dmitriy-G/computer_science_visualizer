import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { SeparateChainingHashTableLayout } from '../SeparateChainingHashTableLayout.ts'

export class SearchByKeyAnimation extends LinearAnimation {
  public static readonly title = 'Look up a key'
  public static readonly summary = 'Follow this structure\'s hash locations and return the stored value or exact absence.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(1)', average: 'O(1)', worst: 'O(n)', explanation: 'A head or home match is constant. Expected constant average assumes well-distributed hashes and bounded load; collisions can require linear scans. The deterministic hash is not an adversarial-resistance guarantee.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Only a fixed number of references and counters are used. Existing storage, trace recording, and playback snapshots are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Original entry count for this run: n = ${size}.` },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage under the stated assumptions.' },
        { symbol: 'O(n)', meaning: 'Work or storage proportional to original entries (or servers for the ring).' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new SeparateChainingHashTableLayout(), 'search-value', input, SearchByKeyAnimation.title, SearchByKeyAnimation.summary)
  }
}
