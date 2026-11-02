import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { AhoCorasickAutomatonLayout } from '../AhoCorasickAutomatonLayout.ts'

export class ClearAnimation extends LinearAnimation {
  public static readonly title = 'Clear'
  public static readonly summary = 'Release patterns and links, preserving an empty initial state.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Replace the owned arrays or state map with empty storage. Garbage collection of the old representation is excluded. Playback cloning, scene snapshots, and display formatting are excluded.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Only a fixed number of references or indices is needed; unreachable storage is reclaimed by garbage collection outside this operation. Playback cloning, scene snapshots, and display formatting are excluded.' },
      terms: [
        { symbol: 'O(1)', meaning: 'Constant operation work or additional storage under the stated representation assumptions.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new AhoCorasickAutomatonLayout(), 'clear', input, ClearAnimation.title, ClearAnimation.summary)
  }
}
