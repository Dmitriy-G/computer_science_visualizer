import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { ReservoirSamplingBufferLayout } from '../ReservoirSamplingBufferLayout.ts'

export class InspectSampleAnimation extends LinearAnimation {
  public static readonly title = 'Inspect sample'
  public static readonly summary = 'Visit retained occurrences and show their original arrival positions.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(k)', average: 'O(k)', worst: 'O(k)', explanation: 'Visit each retained occurrence. A sample is over stream positions, so equal numeric values can occupy different slots. Animation snapshots and renderer work are excluded.' },
      memory: { best: 'O(k)', average: 'O(k)', worst: 'O(k)', explanation: 'Return a new array containing the retained values. Animation snapshots and renderer work are excluded.' },
      terms: [
        { symbol: 'k', meaning: 'Reservoir capacity: five retained stream occurrences.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new ReservoirSamplingBufferLayout(), 'inspect-storage', input, InspectSampleAnimation.title, InspectSampleAnimation.summary)
  }
}
