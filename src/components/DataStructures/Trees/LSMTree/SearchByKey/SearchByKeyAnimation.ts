import { AdditionalTreeAnimation } from '../../../../../visualization/AdditionalTreeAnimation.ts'
import type { AdditionalTreeModel, TreeInputValues } from '../../../../../visualization/AdditionalTreeModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { LSMTreeLayout } from '../LSMTreeLayout.ts'

export class SearchByKeyAnimation extends AdditionalTreeAnimation {
  public static readonly title = 'Look up a key'
  public static readonly summary = 'Search sorted memory, then newest-to-oldest runs, stopping at a value or tombstone.'

  public static describe(size: number, storage = size, runs = 0): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(1)', average: 'O(r log(N + 1) + log(m + 1))', worst: 'O(r log(N + 1) + log(m + 1))', explanation: 'A first-memory-entry match is constant; average assumes uniformly distributed keys without Bloom filters. A miss binary-searches every run. A tombstone terminates the lookup.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Iterative binary searches retain only bounds and a record reference. Animation snapshots and traces are excluded.' },
      terms: [
        { symbol: 'N', meaning: `Original stored versions, including memory, obsolete records, and tombstones: ${storage}.` },
        { symbol: 'r', meaning: `Original number of immutable runs: ${runs}. A nonempty memtable can add one run when flushed.` },
        { symbol: 'm', meaning: 'Number of records in the memtable, at most four before automatic flush.' },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage.' },
        { symbol: 'O(r log(N + 1) + log(m + 1))', meaning: 'Binary-search memory and up to r sorted runs.' },
      ],
    }
  }

  constructor(model: AdditionalTreeModel, input: TreeInputValues = {}) {
    super(model, new LSMTreeLayout(), 'search-value', input, SearchByKeyAnimation.title, SearchByKeyAnimation.summary)
  }
}
