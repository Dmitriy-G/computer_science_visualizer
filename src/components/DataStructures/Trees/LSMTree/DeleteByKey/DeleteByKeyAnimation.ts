import { AdditionalTreeAnimation } from '../../../../../visualization/AdditionalTreeAnimation.ts'
import type { AdditionalTreeModel, TreeInputValues } from '../../../../../visualization/AdditionalTreeModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { LSMTreeLayout } from '../LSMTreeLayout.ts'

export class DeleteByKeyAnimation extends AdditionalTreeAnimation {
  public static readonly title = 'Delete a key (tombstone)'
  public static readonly summary = 'Write a tombstone so newer deletion hides every older value.'

  public static describe(size: number, storage = size, runs = 0): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(1)', average: 'O(r log(N + 1) + m)', worst: 'O(r log(N + 1) + m)', explanation: 'As with writes, a preliminary lookup maintains live-key count. Average assumes uniformly distributed keys; worst searches all runs and shifts or flushes m memory entries. Missing keys still receive tombstones.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(m)', explanation: 'One tombstone is allocated; an automatic flush copies m references. Average flush storage is amortized across writes at the fixed threshold. Animation snapshots and traces are excluded.' },
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
    super(model, new LSMTreeLayout(), 'delete-value', input, DeleteByKeyAnimation.title, DeleteByKeyAnimation.summary)
  }
}
