import { ArraySortingPseudocode } from '../ArraySortingPseudocode.ts'
import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { QuickSortAnimation } from './QuickSortAnimation.ts'
import './QuickSort.css'

class QuickSortDefinition implements ActionDefinition<FixedArray> {
  public readonly pseudocode = ArraySortingPseudocode.quickSort
  public readonly title = 'Quick Sort'

  public create(model: FixedArray): QuickSortAnimation {
    return new QuickSortAnimation(model)
  }
}

export default class QuickSort extends ActionView<FixedArray> {
  protected readonly definition = new QuickSortDefinition()
}
