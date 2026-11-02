import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../DataStructuresOverview/Linear/Array/FixedArray.ts'
import { PancakeSortAnimation } from './PancakeSortAnimation.ts'
import './PancakeSort.css'

class PancakeSortDefinition implements ActionDefinition<FixedArray> {
  public readonly title = 'Pancake Sort'
  public readonly context = 'Sorting / Array / Pancake Sort'
  public readonly summary = PancakeSortAnimation.describe(0).summary
  public readonly phases = ['Inspect', 'Locate', 'Move', 'Finish range', 'Commit']
  public readonly timelineHint = 'Deterministic sorting steps in the shared renderer'
  public readonly acceptsValue = false

  public create(model: FixedArray): PancakeSortAnimation {
    return new PancakeSortAnimation(model)
  }
}

export default class PancakeSort extends ActionView<FixedArray> {
  protected readonly definition = new PancakeSortDefinition()
}
