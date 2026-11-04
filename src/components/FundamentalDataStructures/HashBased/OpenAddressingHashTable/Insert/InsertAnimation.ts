import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { OpenAddressingHashTableLayout } from '../OpenAddressingHashTableLayout.ts'

export class InsertAnimation extends LinearAnimation {
  public static readonly title = 'Insert / update'
  public static readonly summary = 'Probe consecutive slots from the home index, reuse tombstones, and grow above 0.75 live load.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title, summary: this.summary,
      time: { best: 'O(1)', average: 'O(1)', worst: 'O(nb)', explanation: 'Lookup follows a probe chain. Expected constant average assumes well-distributed home positions and bounded occupied load; worst case scans up to b slots. Division hashing is deterministic. Deleted slots count toward probe work; accumulated tombstones can make searches expensive even when live load is low. Expected insertion time and allocation are amortized across insertion-only sequences. Doubling reinserts all records; adversarial collisions can require O(nb) work during that rebuild.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(b)', explanation: 'Normally one new record or value update. A geometric resize keeps old records while allocating a new slot array and a temporary record list, bounded by O(b). Average allocation is amortized for insertion-only sequences; snapshots are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Original entry count for this run: n = ${size}.` },
        { symbol: 'b', meaning: 'Number of physical slots (or slots in a larger table during rehash).' },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage under the stated assumptions.' },
        { symbol: 'O(nb)', meaning: 'A conservative upper bound proportional to records times slot capacity.' },
        { symbol: 'O(b)', meaning: 'Work or storage proportional to allocated or attempted slots/buckets.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new OpenAddressingHashTableLayout(), 'insert', input, InsertAnimation.title, InsertAnimation.summary)
  }
}
