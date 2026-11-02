import { AdditionalTreeAnimation } from '../../../../../visualization/AdditionalTreeAnimation.ts'
import type { AdditionalTreeModel, TreeInputValues } from '../../../../../visualization/AdditionalTreeModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { LSMTreeLayout } from '../LSMTreeLayout.ts'

export class InsertAnimation extends AdditionalTreeAnimation {
  public static readonly title = 'Insert / update'
  public static readonly summary = 'Write a version to the sorted-array memtable and flush at four distinct keys.'

  public static describe(size: number, storage = size, runs = 0): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(1)', average: 'O(r log(N + 1) + m)', worst: 'O(r log(N + 1) + m)', explanation: 'This teaching model first looks up the old value to maintain an exact live-key count. A first-memory-entry match is constant; average assumes uniformly distributed keys. Search all r sorted runs in the worst case, then shift or flush m memtable entries.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(m)', explanation: 'Updates allocate one version; flushing copies m references. The memtable threshold is four; average assumes flush cost amortized across writes. Animation snapshots and traces are excluded.' },
      terms: [
        { symbol: 'N', meaning: `Original stored versions, including memory, obsolete records, and tombstones: ${storage}.` },
        { symbol: 'r', meaning: `Original number of immutable runs: ${runs}. A nonempty memtable can add one run when flushed.` },
        { symbol: 'm', meaning: 'Number of records in the memtable, at most four before automatic flush.' },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage.' },
        { symbol: 'O(r log(N + 1) + m)', meaning: 'Search r runs, then update or flush the m memory entries.' },
        { symbol: 'O(m)', meaning: 'Work or storage proportional to memtable entries.' },
      ],
    }
  }

  constructor(model: AdditionalTreeModel, input: TreeInputValues = {}) {
    super(model, new LSMTreeLayout(), 'insert', input, InsertAnimation.title, InsertAnimation.summary)
  }
}
