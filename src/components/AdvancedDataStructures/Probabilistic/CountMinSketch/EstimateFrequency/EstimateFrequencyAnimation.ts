import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { CountMinSketchLayout } from '../CountMinSketchLayout.ts'

export class EstimateFrequencyAnimation extends LinearAnimation {
  public static readonly title = 'Estimate frequency'
  public static readonly summary = 'Read one counter in each row and return their minimum.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(d)', average: 'O(d)', worst: 'O(d)', explanation: 'Read d counters and take their minimum. This is an upper estimate with positive updates; fixed public hash seeds do not establish independent-hash probability guarantees. Animation snapshots and renderer work are excluded.' },
      memory: { best: 'O(d)', average: 'O(d)', worst: 'O(d)', explanation: 'Keep d column indices and a reference to the minimum BigInt. No counter values are copied or changed. Animation snapshots and renderer work are excluded.' },
      terms: [
        { symbol: 'd', meaning: 'Sketch depth: three separately seeded counter rows.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new CountMinSketchLayout(), 'search-value', input, EstimateFrequencyAnimation.title, EstimateFrequencyAnimation.summary)
  }
}
