import { ArraySortingPseudocode } from '../ArraySortingPseudocode.ts'
import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { BitonicSortAnimation } from './BitonicSortAnimation.ts'
import './BitonicSort.css'

class BitonicSortDefinition implements ActionDefinition<FixedArray> {
  public readonly pseudocode = ArraySortingPseudocode.bitonicSort
  public readonly title = 'Bitonic Sort'

  public create(model: FixedArray): BitonicSortAnimation {
    return new BitonicSortAnimation(model)
  }
}

export default class BitonicSort extends ActionView<FixedArray> {
  protected readonly definition = new BitonicSortDefinition()
}
