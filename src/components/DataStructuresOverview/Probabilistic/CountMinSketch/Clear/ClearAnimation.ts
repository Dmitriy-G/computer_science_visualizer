import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { CountMinSketchLayout } from '../CountMinSketchLayout.ts'

export class ClearAnimation extends LinearAnimation {
  public static readonly title = 'Clear'
  public static readonly summary = 'Reset every sketch counter and the total weight.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(dw)', average: 'O(dw)', worst: 'O(dw)', explanation: 'Write zero into every allocated counter. Animation snapshots and renderer work are excluded.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Reuse row arrays and the shared zero value; snapshots and garbage collection are excluded. Animation snapshots and renderer work are excluded.' },
      terms: [
        { symbol: 'd', meaning: 'Sketch depth: three separately seeded counter rows.' },
        { symbol: 'w', meaning: 'Sketch width: eight counters in each row.' },
        { symbol: 'O(1)', meaning: 'Constant additional work or storage in the stated operation model.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new CountMinSketchLayout(), 'clear', input, ClearAnimation.title, ClearAnimation.summary)
  }
}
