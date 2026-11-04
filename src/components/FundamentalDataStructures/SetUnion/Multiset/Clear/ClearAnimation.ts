import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { MultisetLayout } from '../MultisetLayout.ts'

export class ClearAnimation extends LinearAnimation {
  public static readonly title = 'Clear'
  public static readonly summary = 'Release each distinct counter and subtract all of its occurrences.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(d)', average: 'O(d)', worst: 'O(d²)', explanation: 'Visit every distinct entry once, irrespective of its count. Map deletion has expected constant cost; conservative linear-cost accesses give quadratic worst time. Empty clear is constant time. Playback clones, traces, and scene formatting are excluded.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Iterate the Map while deleting current entries, without allocating a key list. Collection of discarded storage is outside the operation. Playback clones and snapshots are excluded.' },
      terms: [
        { symbol: 'd', meaning: `Number of distinct values; the header counts total occurrences; currently ${size} distinct values.` },
        { symbol: 'O(d)', meaning: 'Linear growth in the distinct-value count, irrespective of multiplicities.' },
        { symbol: 'O(d²)', meaning: 'Quadratic growth in the distinct-value count under the stated conservative Map assumption.' },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage, independent of the input size.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new MultisetLayout(), 'clear', input, ClearAnimation.title, ClearAnimation.summary)
  }
}
