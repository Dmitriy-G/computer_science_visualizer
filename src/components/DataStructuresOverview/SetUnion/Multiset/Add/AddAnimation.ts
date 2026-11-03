import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { MultisetLayout } from '../MultisetLayout.ts'

export class AddAnimation extends LinearAnimation {
  public static readonly title = 'Add an occurrence'
  public static readonly summary = 'Increment a positive value counter, keeping duplicate occurrences.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(1)', average: 'O(1)', worst: 'O(d)', explanation: 'Map access has expected amortized constant cost. Collision-heavy access or Map growth can take linear time in the distinct-value count. Full bags reject unchanged at 64 total occurrences. Playback clones, traces, and scene formatting are excluded.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(d)', explanation: 'An existing value replaces one counter record. A new distinct entry has amortized constant allocation; Map growth can allocate O(d) index storage. Playback clones and snapshots are excluded.' },
      terms: [
        { symbol: 'd', meaning: `Number of distinct values; the header counts total occurrences; currently ${size} distinct values.` },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage, independent of the input size.' },
        { symbol: 'O(d)', meaning: 'Linear growth in the distinct-value count, irrespective of multiplicities.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = { value: 30 }) {
    super(model, new MultisetLayout(), 'insert', input, AddAnimation.title, AddAnimation.summary)
  }
}
