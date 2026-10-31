import { AdditionalTreeAnimation } from '../../../../../visualization/AdditionalTreeAnimation.ts'
import type { AdditionalTreeModel, TreeInputValues } from '../../../../../visualization/AdditionalTreeModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { HeapLayout } from '../HeapLayout.ts'

export class PeekAnimation extends AdditionalTreeAnimation {
  public static readonly title = 'Peek minimum'
  public static readonly summary = 'Read the minimum at the root without modifying the heap.'

  public static describe(size: number, storage = size, runs = 0): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Read the first occupied slot; an empty heap returns no value.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Only a reference to the root value is needed. Animation snapshots and traces are excluded.' },
      terms: [
        { symbol: 'O(1)', meaning: 'Constant work or additional storage.' },
      ],
    }
  }

  constructor(model: AdditionalTreeModel, input: TreeInputValues = {}) {
    super(model, new HeapLayout(), 'peek', input, PeekAnimation.title, PeekAnimation.summary)
  }
}
