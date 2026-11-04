import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { HyperLogLogLayout } from '../HyperLogLogLayout.ts'

export class EstimateCardinalityAnimation extends LinearAnimation {
  public static readonly title = 'Estimate distinct count'
  public static readonly summary = 'Combine register maxima with small-range linear counting when applicable.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(m)', average: 'O(m)', worst: 'O(m)', explanation: 'Scan m registers for the harmonic sum and zero count. Use alpha16 = 0.673 and linear counting below the small-range threshold. The result is approximate and may lie above or below the true cardinality. Animation snapshots and renderer work are excluded.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Accumulate a sum and zero-register count. No exact set or membership index is materialized. Animation snapshots and renderer work are excluded.' },
      terms: [
        { symbol: 'm', meaning: 'Number of rank registers: sixteen in this lesson.' },
        { symbol: 'O(1)', meaning: 'Constant additional work or storage in the stated operation model.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new HyperLogLogLayout(), 'estimate-cardinality', input, EstimateCardinalityAnimation.title, EstimateCardinalityAnimation.summary)
  }
}
