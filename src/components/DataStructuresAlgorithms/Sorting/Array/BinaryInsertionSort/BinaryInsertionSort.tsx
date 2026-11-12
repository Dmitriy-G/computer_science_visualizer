import { ArraySortingPseudocode } from '../ArraySortingPseudocode.ts'
import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { BinaryInsertionSortAnimation } from './BinaryInsertionSortAnimation.ts'
import './BinaryInsertionSort.css'

class BinaryInsertionSortDefinition implements ActionDefinition<FixedArray> {
  public readonly pseudocode = ArraySortingPseudocode.binaryInsertionSort
  public readonly title = 'Binary Insertion Sort'

  public create(model: FixedArray): BinaryInsertionSortAnimation {
    return new BinaryInsertionSortAnimation(model)
  }
}

export default class BinaryInsertionSort extends ActionView<FixedArray> {
  protected readonly definition = new BinaryInsertionSortDefinition()
}
