import { LinearAnimation } from '../../../../../visualization/LinearAnimation.ts'
import { AnimationSequence } from '../../../../../visualization/AnimationSequence.ts'
import type { LinearInputValues, LinearModel } from '../../../../../visualization/LinearModel.ts'
import type { AlgorithmInformation } from '../../../../../visualization/AlgorithmInformation.ts'
import { XORLinkedListLayout } from '../XORLinkedListLayout.ts'

export class DeleteByValueAnimation extends LinearAnimation {
  public static readonly title = 'Delete by value'
  public static readonly summary = 'Find the first match and XOR its address out of both neighbors.'

  public static describe(size: number): AlgorithmInformation {
    const information = AnimationSequence.information(this.title, this.summary, size,
      ['O(1)', 'O(n)', 'O(n²)'], 'A first-position match is constant work. Uniformly distributed matching positions require linear average work; a last match or miss scans all n values. Expected Map access is constant; a conservative worst bound allows O(n) per address lookup.',
      ['O(1)', 'O(1)', 'O(1)'], 'Only a fixed number of local variables are required.')
    return { ...information, terms: [
        { symbol: 'n', meaning: `Original logical size for this run: n = ${size}.` },
        { symbol: 'O(1)', meaning: 'Constant work or additional storage.' },
        { symbol: 'O(n)', meaning: 'Linear in the original size.' },
        { symbol: 'O(n²)', meaning: 'Quadratic in the original size.' },
    ] }
  }

  constructor(model: LinearModel, input: LinearInputValues = {}) {
    super(model, new XORLinkedListLayout(), 'delete-value', input, DeleteByValueAnimation.title, DeleteByValueAnimation.summary)
  }
}
