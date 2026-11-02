import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../DataStructuresOverview/Linear/Array/FixedArray.ts'
import { CountingSortAnimation } from './CountingSortAnimation.ts'
import './CountingSort.css'

class CountingSortDefinition implements ActionDefinition<FixedArray> {
  public readonly title = 'Counting Sort'
  public readonly context = 'Sorting / Array / Counting Sort'
  public readonly summary = CountingSortAnimation.describe(0).summary
  public readonly phases = ['Inspect', 'Locate', 'Move', 'Finish range', 'Commit']
  public readonly timelineHint = 'Deterministic sorting steps in the shared renderer'
  public readonly acceptsValue = false

  public create(model: FixedArray): CountingSortAnimation {
    return new CountingSortAnimation(model)
  }
}

export default class CountingSort extends ActionView<FixedArray> {
  protected readonly definition = new CountingSortDefinition()
}
