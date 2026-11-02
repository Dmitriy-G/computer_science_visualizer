import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { DAWGLayout } from '../DAWGLayout.ts'

export class ClearAnimation extends LinearAnimation {
  public static readonly title = 'Clear'
  public static readonly summary = 'Release the shared dictionary graph and reset its word count.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(S)', average: 'O(S)', worst: 'O(S)', explanation: 'Clear the keyed state registry with up to S entries. Reclamation of transition maps is deferred to garbage collection. Playback cloning, scene snapshots, and display formatting are excluded.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Only a fixed number of references or indices is needed; unreachable storage is reclaimed by garbage collection outside this operation. Playback cloning, scene snapshots, and display formatting are excluded.' },
      terms: [
        { symbol: 'S', meaning: 'Number of canonical dictionary states currently allocated.' },
        { symbol: 'O(1)', meaning: 'Constant operation work or additional storage under the stated representation assumptions.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new DAWGLayout(), 'clear', input, ClearAnimation.title, ClearAnimation.summary)
  }
}
