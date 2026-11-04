import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { IntervalSetLayout } from '../IntervalSetLayout.ts'

export class SubtractIntervalAnimation extends LinearAnimation {
  public static readonly title = 'Subtract interval'
  public static readonly summary = 'Remove an inclusive range, retaining zero, one, or two remainders from each overlap.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', explanation: 'Every stored interval is inspected and up to two remainder records are created for a split. The cost is independent of covered-integer cardinality; empty subtraction is constant time. Playback clones, traces, and scene formatting are excluded.' },
      memory: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', explanation: 'A replacement interval array is built even for a miss. A split can add at most one interval overall; results above 64 intervals reject atomically. Playback clones and snapshots are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Number of stored disjoint intervals, not the number of covered integers; currently ${size} entries.` },
        { symbol: 'O(n)', meaning: 'Linear growth in the number of members, keys, or stored intervals.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = { minimum: 21, maximum: 23 }) {
    super(model, new IntervalSetLayout(), 'delete-value', input, SubtractIntervalAnimation.title, SubtractIntervalAnimation.summary)
  }
}
