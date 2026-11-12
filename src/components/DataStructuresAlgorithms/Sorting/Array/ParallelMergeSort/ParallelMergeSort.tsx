import { ArraySortingPseudocode } from '../ArraySortingPseudocode.ts'
import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { ParallelMergeSortAnimation } from './ParallelMergeSortAnimation.ts'
import './ParallelMergeSort.css'

class ParallelMergeSortDefinition implements ActionDefinition<FixedArray> {
  public readonly pseudocode = ArraySortingPseudocode.parallelMergeSort
  public readonly title = 'Parallel Merge Sort'

  public create(model: FixedArray): ParallelMergeSortAnimation {
    return new ParallelMergeSortAnimation(model)
  }
}

export default class ParallelMergeSort extends ActionView<FixedArray> {
  protected readonly definition = new ParallelMergeSortDefinition()
}
