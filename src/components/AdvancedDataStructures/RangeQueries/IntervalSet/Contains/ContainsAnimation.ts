import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { IntervalSetLayout } from '../IntervalSetLayout.ts'

export class ContainsAnimation extends LinearAnimation {
  public static readonly title = 'Contains value'
  public static readonly summary = 'Binary-search sorted disjoint intervals for exact integer membership.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', explanation: 'A midpoint interval can contain the value immediately; other matches and misses use binary search. Average logarithmic time assumes uniformly distributed matching interval positions. Empty search is constant time. Playback clones, traces, and scene formatting are excluded.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Binary search retains only bounds and a midpoint. Playback clones and snapshots are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Number of stored disjoint intervals, not the number of covered integers; currently ${size} entries.` },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage, independent of the input size.' },
        { symbol: 'O(log n)', meaning: 'Logarithmic growth, as in balanced-tree or binary-search depth.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = { value: 22 }) {
    super(model, new IntervalSetLayout(), 'search-value', input, ContainsAnimation.title, ContainsAnimation.summary)
  }
}
