import { AdditionalTreeAnimation } from '../../../../../visualization/AdditionalTreeAnimation.ts'
import type { AdditionalTreeModel, TreeInputValues } from '../../../../../visualization/AdditionalTreeModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { LSMTreeLayout } from '../LSMTreeLayout.ts'

export class FlushAnimation extends AdditionalTreeAnimation {
  public static readonly title = 'Flush memtable'
  public static readonly summary = 'Copy sorted memory into one immutable level-0 run.'

  public static describe(size: number, storage = size, runs = 0): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(m)', average: 'O(m)', worst: 'O(m)', explanation: 'Copy all m current memory records without sorting. With m = 0 this is a constant-time no-op.' },
      memory: { best: 'O(m)', average: 'O(m)', worst: 'O(m)', explanation: 'Allocate a run array with m record references; existing versions are immutable. Animation snapshots and traces are excluded.' },
      terms: [
        { symbol: 'm', meaning: 'Number of records in the memtable, at most four before automatic flush.' },
        { symbol: 'O(m)', meaning: 'Work or storage proportional to memtable entries.' },
      ],
    }
  }

  constructor(model: AdditionalTreeModel, input: TreeInputValues = {}) {
    super(model, new LSMTreeLayout(), 'flush', input, FlushAnimation.title, FlushAnimation.summary)
  }
}
