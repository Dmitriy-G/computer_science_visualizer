import { ArraySortingPseudocode } from '../ArraySortingPseudocode.ts'
import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { NaturalMergeSortAnimation } from './NaturalMergeSortAnimation.ts'
import './NaturalMergeSort.css'

class NaturalMergeSortDefinition implements ActionDefinition<FixedArray> {
  public readonly pseudocode = ArraySortingPseudocode.naturalMergeSort
  public readonly title = 'Natural Merge Sort'
  public readonly context = 'Sorting / Array / Natural Merge Sort'
  public readonly summary = NaturalMergeSortAnimation.describe(0).summary
  public readonly phases = ['Inspect', 'Locate', 'Move', 'Finish range', 'Commit']
  public readonly timelineHint = 'Deterministic sorting steps in the shared renderer'
  public readonly acceptsValue = false

  public create(model: FixedArray): NaturalMergeSortAnimation {
    return new NaturalMergeSortAnimation(model)
  }
}

export default class NaturalMergeSort extends ActionView<FixedArray> {
  protected readonly definition = new NaturalMergeSortDefinition()
}
