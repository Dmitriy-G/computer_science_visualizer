import { AdditionalTreeAnimation } from '../../../../../visualization/AdditionalTreeAnimation.ts'
import type { AdditionalTreeModel, TreeInputValues } from '../../../../../visualization/AdditionalTreeModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { LSMTreeLayout } from '../LSMTreeLayout.ts'

export class CompactAnimation extends AdditionalTreeAnimation {
  public static readonly title = 'Compact all runs'
  public static readonly summary = 'Flush memory, pairwise merge every run, keep newest versions, then discard fully covered tombstones.'

  public static describe(size: number, storage = size, runs = 0): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(N + m)', average: 'O(N + m)', worst: 'O(Nr + m)', explanation: 'Best: one input run. Average assumes a bounded number r of runs. Sequential pairwise merges can repeatedly scan older output across r runs. Empty input is constant.' },
      memory: { best: 'O(N + m)', average: 'O(N + m)', worst: 'O(N + m)', explanation: 'Keep merge output and a possible memory flush. Tombstones are dropped only after every older run is covered. Animation snapshots and traces are excluded.' },
      terms: [
        { symbol: 'N', meaning: `Original stored versions, including memory, obsolete records, and tombstones: ${storage}.` },
        { symbol: 'r', meaning: `Original number of immutable runs: ${runs}. A nonempty memtable can add one run when flushed.` },
        { symbol: 'm', meaning: 'Number of records in the memtable, at most four before automatic flush.' },
        { symbol: 'O(N + m)', meaning: 'Work or storage proportional to stored versions plus memory entries.' },
        { symbol: 'O(Nr + m)', meaning: 'Repeated pairwise merges across r runs, plus a memory flush.' },
      ],
    }
  }

  constructor(model: AdditionalTreeModel, input: TreeInputValues = {}) {
    super(model, new LSMTreeLayout(), 'compact', input, CompactAnimation.title, CompactAnimation.summary)
  }
}
