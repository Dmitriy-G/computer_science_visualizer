import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { IntervalSetLayout } from '../IntervalSetLayout.ts'

export class ClearAnimation extends LinearAnimation {
  public static readonly title = 'Clear'
  public static readonly summary = 'Release interval records from the end of the sorted array.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', explanation: 'Pop each interval once; cost depends on stored ranges, not their covered cardinality. Empty clear is constant time. Playback clones, traces, and scene formatting are excluded.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Only the current interval reference is retained while releasing the array entries. Playback clones and snapshots are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Number of stored disjoint intervals, not the number of covered integers; currently ${size} entries.` },
        { symbol: 'O(n)', meaning: 'Linear growth in the number of members, keys, or stored intervals.' },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage, independent of the input size.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new IntervalSetLayout(), 'clear', input, ClearAnimation.title, ClearAnimation.summary)
  }
}
