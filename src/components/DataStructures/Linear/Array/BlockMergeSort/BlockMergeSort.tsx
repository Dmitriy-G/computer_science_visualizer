import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../FixedArray.ts'
import { BlockMergeSortAnimation } from './BlockMergeSortAnimation.ts'
import './BlockMergeSort.css'

class BlockMergeSortDefinition implements ActionDefinition<FixedArray> {
  public readonly title = 'Block Merge Sort'
  public readonly context = 'Sorting / Array / Block Merge Sort'
  public readonly summary = BlockMergeSortAnimation.describe(0).summary
  public readonly phases = ['Inspect', 'Locate', 'Move', 'Finish range', 'Commit']
  public readonly timelineHint = 'Deterministic sorting steps in the shared renderer'
  public readonly acceptsValue = false

  public create(model: FixedArray): BlockMergeSortAnimation {
    return new BlockMergeSortAnimation(model)
  }
}

export default class BlockMergeSort extends ActionView<FixedArray> {
  protected readonly definition = new BlockMergeSortDefinition()
}
