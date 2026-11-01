import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../FixedArray.ts'
import { StoogeSortAnimation } from './StoogeSortAnimation.ts'
import './StoogeSort.css'

class StoogeSortDefinition implements ActionDefinition<FixedArray> {
  public readonly title = 'Stooge Sort'
  public readonly context = 'Sorting / Array / Stooge Sort'
  public readonly summary = StoogeSortAnimation.describe(0).summary
  public readonly phases = ['Inspect', 'Locate', 'Move', 'Finish range', 'Commit']
  public readonly timelineHint = 'Deterministic sorting steps in the shared renderer'
  public readonly acceptsValue = false

  public create(model: FixedArray): StoogeSortAnimation {
    return new StoogeSortAnimation(model)
  }
}

export default class StoogeSort extends ActionView<FixedArray> {
  protected readonly definition = new StoogeSortDefinition()
}
