import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { MultisetLayout } from '../MultisetLayout.ts'

export class CountAnimation extends LinearAnimation {
  public static readonly title = 'Count occurrences'
  public static readonly summary = 'Read the exact positive count for a value, or zero if absent.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(1)', average: 'O(1)', worst: 'O(d)', explanation: 'One Map lookup has expected constant cost under ordinary hashing; conservative collision-heavy access is linear. Empty lookup returns zero. Playback clones, traces, and scene formatting are excluded.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'A lookup retains only the retrieved entry and a numeric count. Playback clones and snapshots are excluded.' },
      terms: [
        { symbol: 'd', meaning: `Number of distinct values; the header counts total occurrences; currently ${size} distinct values.` },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage, independent of the input size.' },
        { symbol: 'O(d)', meaning: 'Linear growth in the distinct-value count, irrespective of multiplicities.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = { value: 30 }) {
    super(model, new MultisetLayout(), 'count-value', input, CountAnimation.title, CountAnimation.summary)
  }
}
