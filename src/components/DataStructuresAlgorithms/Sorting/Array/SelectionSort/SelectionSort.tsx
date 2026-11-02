import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../DataStructuresOverview/Linear/Array/FixedArray.ts'
import { SelectionSortAnimation } from './SelectionSortAnimation.ts'
import './SelectionSort.css'

class SelectionSortDefinition implements ActionDefinition<FixedArray> {
  public readonly title = 'Selection Sort'
  public readonly context = 'Sorting / Array / Selection Sort'
  public readonly summary = SelectionSortAnimation.describe(0).summary
  public readonly phases = ['Inspect', 'Locate', 'Move', 'Finish range', 'Commit']
  public readonly timelineHint = 'Deterministic sorting steps in the shared renderer'
  public readonly acceptsValue = false

  public create(model: FixedArray): SelectionSortAnimation {
    return new SelectionSortAnimation(model)
  }
}

export default class SelectionSort extends ActionView<FixedArray> {
  protected readonly definition = new SelectionSortDefinition()
}
