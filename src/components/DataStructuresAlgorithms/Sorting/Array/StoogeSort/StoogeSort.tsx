import { ArraySortingPseudocode } from '../ArraySortingPseudocode.ts'
import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { StoogeSortAnimation } from './StoogeSortAnimation.ts'
import './StoogeSort.css'

class StoogeSortDefinition implements ActionDefinition<FixedArray> {
  public readonly pseudocode = ArraySortingPseudocode.stoogeSort
  public readonly title = 'Stooge Sort'

  public create(model: FixedArray): StoogeSortAnimation {
    return new StoogeSortAnimation(model)
  }
}

export default class StoogeSort extends ActionView<FixedArray> {
  protected readonly definition = new StoogeSortDefinition()
}
