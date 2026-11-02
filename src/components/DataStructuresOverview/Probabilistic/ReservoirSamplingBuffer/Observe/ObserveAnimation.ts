import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { ReservoirSamplingBufferLayout } from '../ReservoirSamplingBufferLayout.ts'

export class ObserveAnimation extends LinearAnimation {
  public static readonly title = 'Observe a stream value'
  public static readonly summary = 'Fill five slots, then replace a sampled slot or skip the incoming occurrence.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(1)', average: 'O(1)', worst: 'Unbounded', explanation: 'Algorithm R makes one bounded-integer choice per later arrival. Rejection sampling has expected constant draws under uniform random-word assumptions but no finite random-draw worst-case bound. The lesson uses a deterministic fixed-seed generator; theoretical sampling claims assume ideal uniform draws. Animation snapshots and renderer work are excluded.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'One incoming occurrence, draw, and generator state. Persistent memory is O(k) retained occurrences plus word-sized counters, not the whole stream. Animation snapshots and renderer work are excluded.' },
      terms: [
        { symbol: 'k', meaning: 'Reservoir capacity: five retained stream occurrences.' },
        { symbol: 'O(1)', meaning: 'Constant additional work or storage in the stated operation model.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new ReservoirSamplingBufferLayout(), 'insert', input, ObserveAnimation.title, ObserveAnimation.summary)
  }
}
