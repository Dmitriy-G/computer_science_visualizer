import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { FMIndexLayout } from '../FMIndexLayout.ts'

export class ClearAnimation extends LinearAnimation {
  public static readonly title = 'Clear'
  public static readonly summary = 'Release the transform, rank tables, cumulative counts, and suffix samples.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(σ + n/s)', average: 'O(σ + n/s)', worst: 'O(σ + n/s)', explanation: 'Clear the symbol maps and sampled-position registry. Dense rank arrays become unreachable; garbage collection of their counter cells is excluded. Playback cloning, scene snapshots, and display formatting are excluded.' },
      memory: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: 'Only a fixed number of references or indices is needed; unreachable storage is reclaimed by garbage collection outside this operation. Playback cloning, scene snapshots, and display formatting are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Source length for this operation (including the terminator for suffix-array/FM rows). The committed source currently has ${size} characters; build bounds use replacement input size.` },
        { symbol: 'σ', meaning: 'Alphabet size: at most 26 lowercase letters, plus the unique $ terminator where used.' },
        { symbol: 's', meaning: 'Suffix-position sampling stride: four; every located row needs at most three LF steps.' },
        { symbol: 'O(1)', meaning: 'Constant operation work or additional storage under the stated representation assumptions.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new FMIndexLayout(), 'clear', input, ClearAnimation.title, ClearAnimation.summary)
  }
}
