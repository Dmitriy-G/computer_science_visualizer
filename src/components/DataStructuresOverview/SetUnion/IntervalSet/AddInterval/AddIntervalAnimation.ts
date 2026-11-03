import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { IntervalSetLayout } from '../IntervalSetLayout.ts'

export class AddIntervalAnimation extends LinearAnimation {
  public static readonly title = 'Union with interval'
  public static readonly summary = 'Merge an inclusive integer interval with overlapping or adjacent stored ranges.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', explanation: 'Scan every stored interval and construct a normalized result array, without enumerating covered integers. All distributions have the same linear upper bound; an empty input is constant time. Endpoint comparisons use exact BigInt arithmetic. Playback clones, traces, and scene formatting are excluded.' },
      memory: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', explanation: 'The candidate array retains O(n) interval records/references beside the old array. Bound rejection preserves the old intervals and ID counter. Empty insertion uses constant memory. Playback clones and snapshots are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Number of stored disjoint intervals, not the number of covered integers; currently ${size} entries.` },
        { symbol: 'O(n)', meaning: 'Linear growth in the number of members, keys, or stored intervals.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = { minimum: 22, maximum: 42 }) {
    super(model, new IntervalSetLayout(), 'insert', input, AddIntervalAnimation.title, AddIntervalAnimation.summary)
  }
}
