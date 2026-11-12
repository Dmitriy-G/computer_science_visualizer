import { ArraySortingPseudocode } from '../ArraySortingPseudocode.ts'
import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { HeapSortAnimation } from './HeapSortAnimation.ts'
import './HeapSort.css'

class HeapSortDefinition implements ActionDefinition<FixedArray> {
  public readonly pseudocode = ArraySortingPseudocode.heapSort
  public readonly title = 'Heap Sort'

  public create(model: FixedArray): HeapSortAnimation {
    return new HeapSortAnimation(model)
  }
}

export default class HeapSort extends ActionView<FixedArray> {
  protected readonly definition = new HeapSortDefinition()
}
