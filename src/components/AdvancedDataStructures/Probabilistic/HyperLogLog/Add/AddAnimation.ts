import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { HyperLogLogLayout } from '../HyperLogLogLayout.ts'

export class AddAnimation extends LinearAnimation {
  public static readonly title = 'Add a value'
  public static readonly summary = 'Hash a value, compute its leading-zero rank, and retain the register maximum.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(m)', average: 'O(m)', worst: 'O(m)', explanation: 'Register update itself is constant for a fixed 64-bit hash. This implementation also computes the displayed estimate by scanning m registers after every add. Duplicate values leave registers unchanged; the add-operation counter still advances. Animation snapshots and renderer work are excluded.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Use a fixed-width hash, rank, and register index. Persistent storage is m register maxima, without an exact distinct set. Animation snapshots and renderer work are excluded.' },
      terms: [
        { symbol: 'm', meaning: 'Number of rank registers: sixteen in this lesson.' },
        { symbol: 'O(1)', meaning: 'Constant additional work or storage in the stated operation model.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new HyperLogLogLayout(), 'insert', input, AddAnimation.title, AddAnimation.summary)
  }
}
