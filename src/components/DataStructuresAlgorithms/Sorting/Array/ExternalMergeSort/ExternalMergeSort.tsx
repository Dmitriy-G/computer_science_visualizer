import { ArraySortingPseudocode } from '../ArraySortingPseudocode.ts'
import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { ExternalMergeSortAnimation } from './ExternalMergeSortAnimation.ts'
import './ExternalMergeSort.css'

class ExternalMergeSortDefinition implements ActionDefinition<FixedArray> {
  public readonly pseudocode = ArraySortingPseudocode.externalMergeSort
  public readonly title = 'External Merge Sort'

  public create(model: FixedArray): ExternalMergeSortAnimation {
    return new ExternalMergeSortAnimation(model)
  }
}

export default class ExternalMergeSort extends ActionView<FixedArray> {
  protected readonly definition = new ExternalMergeSortDefinition()
}
