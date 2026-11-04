import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { BinaryInsertionSortAnimation } from './BinaryInsertionSortAnimation.ts'
import './BinaryInsertionSort.css'

class BinaryInsertionSortDefinition implements ActionDefinition<FixedArray> {
  public readonly title = 'Binary Insertion Sort'
  public readonly context = 'Sorting / Array / Binary Insertion Sort'
  public readonly summary = BinaryInsertionSortAnimation.describe(0).summary
  public readonly phases = ['Inspect', 'Locate', 'Move', 'Finish range', 'Commit']
  public readonly timelineHint = 'Deterministic sorting steps in the shared renderer'
  public readonly acceptsValue = false

  public create(model: FixedArray): BinaryInsertionSortAnimation {
    return new BinaryInsertionSortAnimation(model)
  }
}

export default class BinaryInsertionSort extends ActionView<FixedArray> {
  protected readonly definition = new BinaryInsertionSortDefinition()
}
