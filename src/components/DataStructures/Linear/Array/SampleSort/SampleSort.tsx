import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../FixedArray.ts'
import { SampleSortAnimation } from './SampleSortAnimation.ts'
import './SampleSort.css'

class SampleSortDefinition implements ActionDefinition<FixedArray> {
  public readonly title = 'Sample Sort'
  public readonly context = 'Sorting / Array / Sample Sort'
  public readonly summary = SampleSortAnimation.describe(0).summary
  public readonly phases = ['Inspect', 'Locate', 'Move', 'Finish range', 'Commit']
  public readonly timelineHint = 'Deterministic sorting steps in the shared renderer'
  public readonly acceptsValue = false

  public create(model: FixedArray): SampleSortAnimation {
    return new SampleSortAnimation(model)
  }
}

export default class SampleSort extends ActionView<FixedArray> {
  protected readonly definition = new SampleSortDefinition()
}
