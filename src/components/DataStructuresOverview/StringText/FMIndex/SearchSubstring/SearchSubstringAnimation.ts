import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { FMIndexLayout } from '../FMIndexLayout.ts'

export class SearchSubstringAnimation extends LinearAnimation {
  public static readonly title = 'Find substring positions'
  public static readonly summary = 'Narrow the suffix interval backward and locate each row using LF and samples.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(m)', average: 'O(m + zs)', worst: 'O(m + zs)', explanation: 'Backward search performs two constant-time prefix-rank reads per pattern character. Samples are selected by SA position modulo s, so every matching row reaches a sample within s - 1 LF steps. Results follow suffix order; absent symbols or empty indexes return no positions. Playback cloning, scene snapshots, and display formatting are excluded.' },
      memory: { best: 'O(1)', average: 'O(z + 1)', worst: 'O(z + 1)', explanation: 'Keep interval bounds and a constant number of LF-walk indices, plus the z returned positions. No source scanning or full suffix array is used. Playback cloning, scene snapshots, and display formatting are excluded.' },
      terms: [
        { symbol: 'm', meaning: 'Length of the supplied nonempty substring pattern or dictionary word.' },
        { symbol: 'z', meaning: 'Number of reported matches or source positions, including overlaps.' },
        { symbol: 's', meaning: 'Suffix-position sampling stride: four; every located row needs at most three LF steps.' },
        { symbol: 'O(1)', meaning: 'Constant operation work or additional storage under the stated representation assumptions.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new FMIndexLayout(), 'search-value', input, SearchSubstringAnimation.title, SearchSubstringAnimation.summary)
  }
}
