import { ArraySortingPseudocode } from '../ArraySortingPseudocode.ts'
import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { BlockMergeSortAnimation } from './BlockMergeSortAnimation.ts'
import './BlockMergeSort.css'

class BlockMergeSortDefinition implements ActionDefinition<FixedArray> {
  public readonly pseudocode = ArraySortingPseudocode.blockMergeSort
  public readonly title = 'Block Merge Sort'

  public create(model: FixedArray): BlockMergeSortAnimation {
    return new BlockMergeSortAnimation(model)
  }
}

export default class BlockMergeSort extends ActionView<FixedArray> {
  protected readonly definition = new BlockMergeSortDefinition()
}
