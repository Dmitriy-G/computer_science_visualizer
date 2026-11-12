import { ArraySortingPseudocode } from '../ArraySortingPseudocode.ts'
import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { RadixSortAnimation } from './RadixSortAnimation.ts'
import './RadixSort.css'

class RadixSortDefinition implements ActionDefinition<FixedArray> {
  public readonly pseudocode = ArraySortingPseudocode.radixSort
  public readonly title = 'Radix Sort'

  public create(model: FixedArray): RadixSortAnimation {
    return new RadixSortAnimation(model)
  }
}

export default class RadixSort extends ActionView<FixedArray> {
  protected readonly definition = new RadixSortDefinition()
}
