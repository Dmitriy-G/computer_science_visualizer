import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../DataStructuresOverview/Linear/Array/FixedArray.ts'
import { SmoothsortAnimation } from './SmoothsortAnimation.ts'
import './Smoothsort.css'

class SmoothsortDefinition implements ActionDefinition<FixedArray> {
  public readonly title = 'Smoothsort'
  public readonly context = 'Sorting / Array / Smoothsort'
  public readonly summary = SmoothsortAnimation.describe(0).summary
  public readonly phases = ['Inspect', 'Locate', 'Move', 'Finish range', 'Commit']
  public readonly timelineHint = 'Deterministic sorting steps in the shared renderer'
  public readonly acceptsValue = false

  public create(model: FixedArray): SmoothsortAnimation {
    return new SmoothsortAnimation(model)
  }
}

export default class Smoothsort extends ActionView<FixedArray> {
  protected readonly definition = new SmoothsortDefinition()
}
