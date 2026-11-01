import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../FixedArray.ts'
import { InterpolationSortAnimation } from './InterpolationSortAnimation.ts'
import './InterpolationSort.css'

class InterpolationSortDefinition implements ActionDefinition<FixedArray> {
  public readonly title = 'Interpolation Sort'
  public readonly context = 'Sorting / Array / Interpolation Sort'
  public readonly summary = InterpolationSortAnimation.describe(0).summary
  public readonly phases = ['Inspect', 'Locate', 'Move', 'Finish range', 'Commit']
  public readonly timelineHint = 'Deterministic sorting steps in the shared renderer'
  public readonly acceptsValue = false

  public create(model: FixedArray): InterpolationSortAnimation {
    return new InterpolationSortAnimation(model)
  }
}

export default class InterpolationSort extends ActionView<FixedArray> {
  protected readonly definition = new InterpolationSortDefinition()
}
