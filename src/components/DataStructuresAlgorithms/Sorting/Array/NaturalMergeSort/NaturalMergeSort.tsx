import { ArraySortingPseudocode } from '../ArraySortingPseudocode.ts'
import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { NaturalMergeSortAnimation } from './NaturalMergeSortAnimation.ts'
import './NaturalMergeSort.css'

class NaturalMergeSortDefinition implements ActionDefinition<FixedArray> {
  public readonly pseudocode = ArraySortingPseudocode.naturalMergeSort
  public readonly title = 'Natural Merge Sort'

  public create(model: FixedArray): NaturalMergeSortAnimation {
    return new NaturalMergeSortAnimation(model)
  }
}

export default class NaturalMergeSort extends ActionView<FixedArray> {
  protected readonly definition = new NaturalMergeSortDefinition()
}
