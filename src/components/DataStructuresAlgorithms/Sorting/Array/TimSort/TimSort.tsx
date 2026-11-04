import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { TimSortAnimation } from './TimSortAnimation.ts'
import './TimSort.css'

class TimSortDefinition implements ActionDefinition<FixedArray> {
  public readonly title = 'TimSort'
  public readonly context = 'Sorting / Array / TimSort'
  public readonly summary = TimSortAnimation.describe(0).summary
  public readonly phases = ['Inspect', 'Locate', 'Move', 'Finish range', 'Commit']
  public readonly timelineHint = 'Deterministic sorting steps in the shared renderer'
  public readonly acceptsValue = false

  public create(model: FixedArray): TimSortAnimation {
    return new TimSortAnimation(model)
  }
}

export default class TimSort extends ActionView<FixedArray> {
  protected readonly definition = new TimSortDefinition()
}
