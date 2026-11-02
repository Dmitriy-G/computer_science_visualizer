import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { QuotientFilterLayout } from '../QuotientFilterLayout.ts'

export class ClearAnimation extends LinearAnimation {
  public static readonly title = 'Clear'
  public static readonly summary = 'Discard all remainders and metadata.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(b)', average: 'O(b)', worst: 'O(b)', explanation: 'Create b empty quotient slots and reset the occurrence counter. Animation snapshots and renderer work are excluded.' },
      memory: { best: 'O(b)', average: 'O(b)', worst: 'O(b)', explanation: 'Replace the slot array with a fresh empty array. Animation snapshots and renderer work are excluded.' },
      terms: [
        { symbol: 'b', meaning: 'Sixteen allocated quotient slots, with at least one empty slot.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new QuotientFilterLayout(), 'clear', input, ClearAnimation.title, ClearAnimation.summary)
  }
}
