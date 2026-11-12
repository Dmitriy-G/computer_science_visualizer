import { ArraySortingPseudocode } from '../ArraySortingPseudocode.ts'
import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { CountingSortAnimation } from './CountingSortAnimation.ts'
import './CountingSort.css'

class CountingSortDefinition implements ActionDefinition<FixedArray> {
  public readonly pseudocode = ArraySortingPseudocode.countingSort
  public readonly title = 'Counting Sort'

  public create(model: FixedArray): CountingSortAnimation {
    return new CountingSortAnimation(model)
  }
}

export default class CountingSort extends ActionView<FixedArray> {
  protected readonly definition = new CountingSortDefinition()
}
