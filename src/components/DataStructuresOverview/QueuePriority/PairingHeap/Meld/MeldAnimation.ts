import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'
import type { LinearInputValues, LinearModel } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { PairingHeapLayout } from '../PairingHeapLayout.ts'

export class MeldAnimation extends LinearAnimation {
  public static readonly title = 'Meld a donor heap'
  public static readonly summary = 'Build the donor with constant-time links and join it to the current root.'

  public static describe(size: number): AlgorithmInformation {
    const information = AnimationSequence.information(this.title, this.summary, size,
      ['O(m)', 'O(m)', 'O(m)'], 'Each of m donor insertions takes constant pointer work; joining the two completed roots is O(1). Donor construction is included.',
      ['O(m)', 'O(m)', 'O(m)'], 'Allocate m donor nodes; joining completed heaps needs only constant references.')
    return { ...information, terms: [
      { symbol: 'n', meaning: `Original logical entry count for this run: n = ${size}.` },
      { symbol: 'm', meaning: 'Number of supplied donor values, from 1 to 16. Donor construction is included in the action cost.' },
      { symbol: 'O(m)', meaning: 'Linear in the donor entry count.' },
    ] }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new PairingHeapLayout(), 'meld', input, MeldAnimation.title, MeldAnimation.summary)
  }
}
