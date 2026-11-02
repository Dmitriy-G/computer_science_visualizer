import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import type { LinearModel, LinearInputValues } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { QuotientFilterLayout } from '../QuotientFilterLayout.ts'

export class AddAnimation extends LinearAnimation {
  public static readonly title = 'Add a value'
  public static readonly summary = 'Rebuild sorted packed fingerprint runs and publish their O/C/S metadata atomically.'

  public static describe(size: number): AlgorithmInformation {
    return {
      name: this.title,
      summary: this.summary,
      time: { best: 'O(b)', average: 'O(b² + bn log(n + 1))', worst: 'O(b² + bn log(n + 1))', explanation: 'This educational insertion decodes real runs, then tries up to b circular cuts and sorts n fingerprints per cut. This conservative bound includes cluster decoding and clearing candidate tables. It is not the usual incremental quotient-filter insertion. One empty slot is reserved. Animation snapshots and renderer work are excluded.' },
      memory: { best: 'O(b + n)', average: 'O(b + n)', worst: 'O(b + n)', explanation: 'Temporary decoded fingerprints, sorted fingerprints, and candidate slots; full keys are never retained. Animation snapshots and renderer work are excluded.' },
      terms: [
        { symbol: 'n', meaning: `Fingerprint occurrences before this run: ${size}. Insertion rebuilds at most n + 1 occurrences.` },
        { symbol: 'b', meaning: 'Sixteen allocated quotient slots, with at least one empty slot.' },
      ],
    }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new QuotientFilterLayout(), 'insert', input, AddAnimation.title, AddAnimation.summary)
  }
}
