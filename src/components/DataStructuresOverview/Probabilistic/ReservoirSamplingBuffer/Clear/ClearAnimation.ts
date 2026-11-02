import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { ReservoirSamplingBufferLayout } from '../ReservoirSamplingBufferLayout.ts'

export class ClearAnimation extends LinearAnimation {
  public static readonly title = 'Clear'
  public static readonly summary = 'Empty the reservoir and restart the seeded experiment.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Replace the retained array and reset the stream count and generator seed. Reclaiming old entries is left to garbage collection. Animation snapshots and renderer work are excluded.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Allocate an empty array; stable item identifiers are not reused. Animation snapshots and renderer work are excluded.' },
      terms: [
        { symbol: 'O(1)', meaning: 'Constant additional work or storage in the stated operation model.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new ReservoirSamplingBufferLayout(), 'clear', input, ClearAnimation.title, ClearAnimation.summary)
  }
}
