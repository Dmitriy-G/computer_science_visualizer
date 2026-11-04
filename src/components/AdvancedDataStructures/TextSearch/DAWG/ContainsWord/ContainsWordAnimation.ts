import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { DAWGLayout } from '../DAWGLayout.ts'

export class ContainsWordAnimation extends LinearAnimation {
  public static readonly title = 'Contains complete word'
  public static readonly summary = 'Follow the complete word and require its final state to be accepting.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(m)', average: 'O(m)', worst: 'O(m)', explanation: 'Validate the complete word and follow at most m character transitions. A prefix path without a final flag is not a dictionary word; an empty graph rejects every nonempty word. Playback cloning, scene snapshots, and display formatting are excluded.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Only a fixed number of references or indices is needed; unreachable storage is reclaimed by garbage collection outside this operation. Playback cloning, scene snapshots, and display formatting are excluded.' },
      terms: [
        { symbol: 'm', meaning: 'Length of the supplied nonempty substring pattern or dictionary word.' },
        { symbol: 'O(1)', meaning: 'Constant operation work or additional storage under the stated representation assumptions.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new DAWGLayout(), 'search-value', input, ContainsWordAnimation.title, ContainsWordAnimation.summary)
  }
}
