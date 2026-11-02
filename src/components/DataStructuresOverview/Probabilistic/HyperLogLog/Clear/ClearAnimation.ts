import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { HyperLogLogLayout } from '../HyperLogLogLayout.ts'

export class ClearAnimation extends LinearAnimation {
  public static readonly title = 'Clear'
  public static readonly summary = 'Reset register maxima and the add-operation counter.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(m)', average: 'O(m)', worst: 'O(m)', explanation: 'Set every register to zero. Animation snapshots and renderer work are excluded.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Reuse the existing register array. Animation snapshots and renderer work are excluded.' },
      terms: [
        { symbol: 'm', meaning: 'Number of rank registers: sixteen in this lesson.' },
        { symbol: 'O(1)', meaning: 'Constant additional work or storage in the stated operation model.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new HyperLogLogLayout(), 'clear', input, ClearAnimation.title, ClearAnimation.summary)
  }
}
