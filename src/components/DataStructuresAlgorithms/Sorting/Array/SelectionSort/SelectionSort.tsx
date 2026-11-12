import { ArraySortingPseudocode } from '../ArraySortingPseudocode.ts'
import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { SelectionSortAnimation } from './SelectionSortAnimation.ts'
import './SelectionSort.css'

class SelectionSortDefinition implements ActionDefinition<FixedArray> {
  public readonly pseudocode = ArraySortingPseudocode.selectionSort
  public readonly title = 'Selection Sort'

  public create(model: FixedArray): SelectionSortAnimation {
    return new SelectionSortAnimation(model)
  }
}

export default class SelectionSort extends ActionView<FixedArray> {
  protected readonly definition = new SelectionSortDefinition()
}
