import { ArraySortingPseudocode } from '../ArraySortingPseudocode.ts'
import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { PancakeSortAnimation } from './PancakeSortAnimation.ts'
import './PancakeSort.css'

class PancakeSortDefinition implements ActionDefinition<FixedArray> {
  public readonly pseudocode = ArraySortingPseudocode.pancakeSort
  public readonly title = 'Pancake Sort'

  public create(model: FixedArray): PancakeSortAnimation {
    return new PancakeSortAnimation(model)
  }
}

export default class PancakeSort extends ActionView<FixedArray> {
  protected readonly definition = new PancakeSortDefinition()
}
