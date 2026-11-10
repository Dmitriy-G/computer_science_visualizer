import { ArraySortingPseudocode } from '../ArraySortingPseudocode.ts'
import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { OddEvenMergeSortAnimation } from './OddEvenMergeSortAnimation.ts'
import './OddEvenMergeSort.css'

class OddEvenMergeSortDefinition implements ActionDefinition<FixedArray> {
  public readonly pseudocode = ArraySortingPseudocode.oddEvenMergeSort
  public readonly title = 'Odd-Even Merge Sort'
  public readonly context = 'Sorting / Array / Odd-Even Merge Sort'
  public readonly summary = OddEvenMergeSortAnimation.describe(0).summary
  public readonly phases = ['Inspect', 'Locate', 'Move', 'Finish range', 'Commit']
  public readonly timelineHint = 'Deterministic sorting steps in the shared renderer'
  public readonly acceptsValue = false

  public create(model: FixedArray): OddEvenMergeSortAnimation {
    return new OddEvenMergeSortAnimation(model)
  }
}

export default class OddEvenMergeSort extends ActionView<FixedArray> {
  protected readonly definition = new OddEvenMergeSortDefinition()
}
