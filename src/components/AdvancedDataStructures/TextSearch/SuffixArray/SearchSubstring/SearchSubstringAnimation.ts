import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { SuffixArrayLayout } from '../SuffixArrayLayout.ts'

export class SearchSubstringAnimation extends LinearAnimation {
  public static readonly title = 'Find substring positions'
  public static readonly summary = 'Use lower and upper suffix bounds and report every matching source position.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(m + log(n + 1))', average: 'O(m log(n + 1) + z)', worst: 'O(m log(n + 1) + z)', explanation: 'Validate the m-character pattern, then use two binary searches. Each comparison reads up to m characters; report z matching suffix starts in suffix order. Empty indexes return an empty list. Playback cloning, scene snapshots, and display formatting are excluded.' },
      memory: { best: 'O(1)', average: 'O(z + 1)', worst: 'O(z + 1)', explanation: 'Binary search uses constant indices; the returned position array needs O(z) storage. Playback cloning, scene snapshots, and display formatting are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Source length for this operation (including the terminator for suffix-array/FM rows). The committed source currently has ${size} characters; build bounds use replacement input size.` },
        { symbol: 'm', meaning: 'Length of the supplied nonempty substring pattern or dictionary word.' },
        { symbol: 'z', meaning: 'Number of reported matches or source positions, including overlaps.' },
        { symbol: 'O(1)', meaning: 'Constant operation work or additional storage under the stated representation assumptions.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new SuffixArrayLayout(), 'search-value', input, SearchSubstringAnimation.title, SearchSubstringAnimation.summary)
  }
}
