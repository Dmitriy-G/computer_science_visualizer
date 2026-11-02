import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { CountMinSketchLayout } from '../CountMinSketchLayout.ts'

export class AddAnimation extends LinearAnimation {
  public static readonly title = 'Add weighted occurrence'
  public static readonly summary = 'Increment one seeded counter per row by a positive weight.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(d)', average: 'O(d)', worst: 'O(d)', explanation: 'Compute one column per row and perform d BigInt additions. Bounds count arithmetic operations; their bit cost grows with log(W + 2). Only positive updates are accepted, preserving the no-underestimation invariant. Animation snapshots and renderer work are excluded.' },
      memory: { best: 'O(d log(W + 2))', average: 'O(d log(W + 2))', worst: 'O(d log(W + 2))', explanation: 'Temporary row indices and newly allocated BigInt counter values require up to d counter-width bit strings. Persistent storage is dw counters; no exact item registry is stored. Animation snapshots and renderer work are excluded.' },
      terms: [
        { symbol: 'd', meaning: 'Sketch depth: three separately seeded counter rows.' },
        { symbol: 'w', meaning: 'Sketch width: eight counters in each row.' },
        { symbol: 'W', meaning: 'Total positive stream weight. Counter bit width grows with log(W + 2).' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new CountMinSketchLayout(), 'insert', input, AddAnimation.title, AddAnimation.summary)
  }
}
