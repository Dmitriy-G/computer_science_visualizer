import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'
import type { LinearInputValues, LinearModel } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { XORLinkedListLayout } from '../XORLinkedListLayout.ts'

export class AppendAnimation extends LinearAnimation {
  public static readonly title = 'Append a value'
  public static readonly summary = 'Append a node using simulated address XOR links and a cached tail.'

  public static describe(size: number): AlgorithmInformation {
    const information = AnimationSequence.information(this.title, this.summary, size,
      ['O(1)', 'O(1)', 'O(n)'], 'Pointer bookkeeping is constant work. The simulated address table uses JavaScript Map: expected amortized lookup/insertion is constant, while a conservative worst bound allows linear table work. No native-address or memory-saving claim is made.',
      ['O(1)', 'O(1)', 'O(n)'], 'One node is added; JavaScript Map growth may allocate a linear backing table.')
    return { ...information, terms: [
        { symbol: 'n', meaning: `Original logical size for this run: n = ${size}.` },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage.' },
        { symbol: 'O(n)', meaning: 'Linear in the original size.' },
    ] }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new XORLinkedListLayout(), 'insert-end', input, AppendAnimation.title, AppendAnimation.summary)
  }
}
