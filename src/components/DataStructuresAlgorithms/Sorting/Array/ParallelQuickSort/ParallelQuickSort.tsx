import { ArraySortingPseudocode } from '../ArraySortingPseudocode.ts'
import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { ParallelQuickSortAnimation } from './ParallelQuickSortAnimation.ts'
import './ParallelQuickSort.css'

class ParallelQuickSortDefinition implements ActionDefinition<FixedArray> {
  public readonly pseudocode = ArraySortingPseudocode.parallelQuickSort
  public readonly title = 'Parallel QuickSort'

  public create(model: FixedArray): ParallelQuickSortAnimation {
    return new ParallelQuickSortAnimation(model)
  }
}

export default class ParallelQuickSort extends ActionView<FixedArray> {
  protected readonly definition = new ParallelQuickSortDefinition()
}
