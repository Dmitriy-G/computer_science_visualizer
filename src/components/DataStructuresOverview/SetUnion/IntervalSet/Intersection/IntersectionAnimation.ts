import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { IntervalSetLayout } from '../IntervalSetLayout.ts'

export class IntersectionAnimation extends LinearAnimation {
  public static readonly title = 'Intersect with interval'
  public static readonly summary = 'Report exact overlaps with an inclusive query range without modifying storage.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(1)', average: 'O(n)', worst: 'O(n)', explanation: 'Scan sorted intervals until one starts above the query maximum. An early stop is constant; a high-end query or broad overlap visits every interval. Average assumes query locations can reach a constant fraction of the list. Playback clones, traces, and scene formatting are excluded.' },
      memory: { best: 'O(1)', average: 'O(n)', worst: 'O(n)', explanation: 'Output stores one endpoint pair per overlap, up to n intervals. No covered integers are enumerated. Empty output uses constant memory. Playback clones and snapshots are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Number of stored disjoint intervals, not the number of covered integers; currently ${size} entries.` },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage, independent of the input size.' },
        { symbol: 'O(n)', meaning: 'Linear growth in the number of members, keys, or stored intervals.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = { minimum: 22, maximum: 42 }) {
    super(model, new IntervalSetLayout(), 'search-overlap', input, IntersectionAnimation.title, IntersectionAnimation.summary)
  }
}
