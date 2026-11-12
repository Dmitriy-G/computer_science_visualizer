import { ArraySortingPseudocode } from '../ArraySortingPseudocode.ts'
import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { InsertionSortAnimation } from './InsertionSortAnimation.ts'
import './InsertionSort.css'

class InsertionSortDefinition implements ActionDefinition<FixedArray> {
  public readonly pseudocode = ArraySortingPseudocode.insertionSort
  public readonly title = 'Insertion Sort'

  public create(model: FixedArray): InsertionSortAnimation {
    return new InsertionSortAnimation(model)
  }
}

export default class InsertionSort extends ActionView<FixedArray> {
  protected readonly definition = new InsertionSortDefinition()
}
