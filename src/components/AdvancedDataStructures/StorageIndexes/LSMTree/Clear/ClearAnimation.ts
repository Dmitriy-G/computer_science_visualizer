import { AdditionalTreeAnimation } from '../../../../../visualization/AdditionalTreeAnimation.ts'
import type { AdditionalTreeModel, TreeInputValues } from '../../../../../visualization/AdditionalTreeModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { LSMTreeLayout } from '../LSMTreeLayout.ts'

export class ClearAnimation extends AdditionalTreeAnimation {
  public static readonly title = 'Clear'
  public static readonly summary = 'Release memory entries and references to all immutable runs.'

  public static describe(size: number, storage = size, runs = 0): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(m + r)', average: 'O(m + r)', worst: 'O(m + r)', explanation: 'Explicitly remove m memory entries and r run references. Reclaiming immutable run storage is left to JavaScript collection.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Release references iteratively. Animation snapshots and traces are excluded.' },
      terms: [
        { symbol: 'r', meaning: `Original number of immutable runs: ${runs}. A nonempty memtable can add one run when flushed.` },
        { symbol: 'm', meaning: 'Number of records in the memtable, at most four before automatic flush.' },
        { symbol: 'O(m + r)', meaning: 'Work proportional to memory entries plus run references.' },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage.' },
      ],
    }
  }

  constructor(model: AdditionalTreeModel, input: TreeInputValues = {}) {
    super(model, new LSMTreeLayout(), 'clear', input, ClearAnimation.title, ClearAnimation.summary)
  }
}
