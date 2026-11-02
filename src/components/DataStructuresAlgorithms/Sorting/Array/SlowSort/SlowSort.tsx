import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../DataStructuresOverview/Linear/Array/FixedArray.ts'
import { SlowSortAnimation } from './SlowSortAnimation.ts'
import './SlowSort.css'

class SlowSortDefinition implements ActionDefinition<FixedArray> {
  public readonly title = 'Slow Sort'
  public readonly context = 'Sorting / Array / Slow Sort'
  public readonly summary = SlowSortAnimation.describe(0).summary
  public readonly phases = ['Inspect', 'Locate', 'Move', 'Finish range', 'Commit']
  public readonly timelineHint = 'Deterministic sorting steps in the shared renderer'
  public readonly acceptsValue = false

  public create(model: FixedArray): SlowSortAnimation {
    return new SlowSortAnimation(model)
  }
}

export default class SlowSort extends ActionView<FixedArray> {
  protected readonly definition = new SlowSortDefinition()
}
