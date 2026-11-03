import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { MinimizerIndexLayout } from '../MinimizerIndexLayout.ts'

export class BuildAnimation extends LinearAnimation {
  public static readonly title = 'Build a DNA index'
  public static readonly summary = 'Extract window minimizers and store reference-position postings.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(m)', average: 'O(m)', worst: 'O(m)', explanation: 'A monotone deque visits each k-mer a bounded number of times; expected Map lookup maintains position lists. Fixed k and window width do not grow with the input. Rows are upper bounds for this teaching variant; empty or early-return cases can finish sooner.' },
      memory: { best: 'O(m)', average: 'O(m)', worst: 'O(m)', explanation: 'Includes working collections and output required by this operation. Playback clones, recorded trace frames, and scene snapshots are excluded.' },
      terms: [
        { symbol: 'm', meaning: 'Input text length or the number of bounded words considered by this operation.' },
        { symbol: 'O(m)', meaning: 'Linear work or storage in the input text length.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = { text: 'acgttgcagt' }) {
    super(model, new MinimizerIndexLayout(), 'build-text', input, BuildAnimation.title, BuildAnimation.summary)
  }
}
