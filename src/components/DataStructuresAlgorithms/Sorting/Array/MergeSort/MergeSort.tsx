import { ArraySortingPseudocode } from '../ArraySortingPseudocode.ts'
import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { MergeSortAnimation } from './MergeSortAnimation.ts'
import './MergeSort.css'

class MergeSortDefinition implements ActionDefinition<FixedArray> {
  public readonly pseudocode = ArraySortingPseudocode.mergeSort
  public readonly title = 'Merge Sort'
  public readonly context = 'Sorting / Array / Merge Sort'
  public readonly summary = MergeSortAnimation.describe(0).summary
  public readonly phases = ['Inspect', 'Locate', 'Move', 'Finish range', 'Commit']
  public readonly timelineHint = 'Deterministic sorting steps in the shared renderer'
  public readonly acceptsValue = false

  public create(model: FixedArray): MergeSortAnimation {
    return new MergeSortAnimation(model)
  }
}

export default class MergeSort extends ActionView<FixedArray> {
  protected readonly definition = new MergeSortDefinition()
}
