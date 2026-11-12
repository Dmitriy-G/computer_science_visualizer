import { ArraySortingPseudocode } from '../ArraySortingPseudocode.ts'
import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { PolyphaseMergeSortAnimation } from './PolyphaseMergeSortAnimation.ts'
import './PolyphaseMergeSort.css'

class PolyphaseMergeSortDefinition implements ActionDefinition<FixedArray> {
  public readonly pseudocode = ArraySortingPseudocode.polyphaseMergeSort
  public readonly title = 'Polyphase Merge Sort'

  public create(model: FixedArray): PolyphaseMergeSortAnimation {
    return new PolyphaseMergeSortAnimation(model)
  }
}

export default class PolyphaseMergeSort extends ActionView<FixedArray> {
  protected readonly definition = new PolyphaseMergeSortDefinition()
}
