import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../FixedArray.ts'
import { OddEvenSortAnimation } from './OddEvenSortAnimation.ts'
import './OddEvenSort.css'

class OddEvenSortDefinition implements ActionDefinition<FixedArray> {
  public readonly title = 'Odd-Even Sort'
  public readonly context = 'Sorting / Array / Odd-Even Sort'
  public readonly summary = OddEvenSortAnimation.describe(0).summary
  public readonly phases = ['Inspect', 'Locate', 'Move', 'Finish range', 'Commit']
  public readonly timelineHint = 'Deterministic sorting steps in the shared renderer'
  public readonly acceptsValue = false

  public create(model: FixedArray): OddEvenSortAnimation {
    return new OddEvenSortAnimation(model)
  }
}

export default class OddEvenSort extends ActionView<FixedArray> {
  protected readonly definition = new OddEvenSortDefinition()
}
