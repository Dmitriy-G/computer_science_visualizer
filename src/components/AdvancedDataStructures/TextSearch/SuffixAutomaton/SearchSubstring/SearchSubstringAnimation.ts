import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { SuffixAutomatonLayout } from '../SuffixAutomatonLayout.ts'

export class SearchSubstringAnimation extends LinearAnimation {
  public static readonly title = 'Contains substring'
  public static readonly summary = 'Follow character transitions; every reachable state accepts substring queries.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(m)', average: 'O(m)', worst: 'O(m)', explanation: 'Validate the complete pattern and follow at most m transitions. Missing transitions prove absence. The suffix-final flags are not required for substring acceptance. Playback cloning, scene snapshots, and display formatting are excluded.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Only a fixed number of references or indices is needed; unreachable storage is reclaimed by garbage collection outside this operation. Playback cloning, scene snapshots, and display formatting are excluded.' },
      terms: [
        { symbol: 'm', meaning: 'Length of the supplied nonempty substring pattern or dictionary word.' },
        { symbol: 'O(1)', meaning: 'Constant operation work or additional storage under the stated representation assumptions.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new SuffixAutomatonLayout(), 'search-value', input, SearchSubstringAnimation.title, SearchSubstringAnimation.summary)
  }
}
