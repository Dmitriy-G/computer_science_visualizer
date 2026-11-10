import { ArraySortingPseudocode } from '../ArraySortingPseudocode.ts'
import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { InsertionSortAnimation } from './InsertionSortAnimation.ts'
import './InsertionSort.css'

class InsertionSortDefinition implements ActionDefinition<FixedArray> {
  public readonly pseudocode = ArraySortingPseudocode.insertionSort
  public readonly title = 'Insertion Sort'
  public readonly context = 'Sorting / Array / Insertion Sort'
  public readonly summary = InsertionSortAnimation.describe(0).summary
  public readonly phases = ['Inspect', 'Locate', 'Move', 'Finish range', 'Commit']
  public readonly timelineHint = 'Deterministic sorting steps in the shared renderer'
  public readonly acceptsValue = false

  public create(model: FixedArray): InsertionSortAnimation {
    return new InsertionSortAnimation(model)
  }
}

export default class InsertionSort extends ActionView<FixedArray> {
  protected readonly definition = new InsertionSortDefinition()
}
