import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'
import type { LinearInputValues, LinearModel } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { PairingHeapLayout } from '../PairingHeapLayout.ts'

export class InsertAnimation extends LinearAnimation {
  public static readonly title = 'Insert a value'
  public static readonly summary = 'Meld a singleton by making the larger root the smaller root’s first child.'

  public static describe(size: number): AlgorithmInformation {
    const information = AnimationSequence.information(this.title, this.summary, size,
      ['O(1)', 'O(1)', 'O(1)'], 'Compare two roots and update a constant number of child/sibling pointers; allocate one node.',
      ['O(1)', 'O(1)', 'O(1)'], 'Only a fixed number of local references and indices are needed.')
    return { ...information, terms: [
      { symbol: 'n', meaning: `Original logical entry count for this run: n = ${size}.` },
      { symbol: 'O(1)', meaning: 'Constant work or storage.' },
    ] }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new PairingHeapLayout(), 'insert', input, InsertAnimation.title, InsertAnimation.summary)
  }
}
