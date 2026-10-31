import { AdditionalTreeAnimation } from '../../../../../visualization/AdditionalTreeAnimation.ts'
import type { AdditionalTreeModel, TreeInputValues } from '../../../../../visualization/AdditionalTreeModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { HeapLayout } from '../HeapLayout.ts'

export class ClearAnimation extends AdditionalTreeAnimation {
  public static readonly title = 'Clear'
  public static readonly summary = 'Release entries from the final occupied array slot.'

  public static describe(size: number, storage = size, runs = 0): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', explanation: 'Every entry is removed once, without sifting. Empty clear takes constant time.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Release entries iteratively without allocating replacement storage. Animation snapshots and traces are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Original element count for this run: n = ${size}.` },
        { symbol: 'O(n)', meaning: 'Work or storage proportional to the original number of array values or stored records.' },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage.' },
      ],
    }
  }

  constructor(model: AdditionalTreeModel, input: TreeInputValues = {}) {
    super(model, new HeapLayout(), 'clear', input, ClearAnimation.title, ClearAnimation.summary)
  }
}
