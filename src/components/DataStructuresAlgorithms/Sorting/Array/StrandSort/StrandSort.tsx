import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../DataStructuresOverview/Linear/Array/FixedArray.ts'
import { StrandSortAnimation } from './StrandSortAnimation.ts'
import './StrandSort.css'

class StrandSortDefinition implements ActionDefinition<FixedArray> {
  public readonly title = 'Strand Sort'
  public readonly context = 'Sorting / Array / Strand Sort'
  public readonly summary = StrandSortAnimation.describe(0).summary
  public readonly phases = ['Inspect', 'Locate', 'Move', 'Finish range', 'Commit']
  public readonly timelineHint = 'Deterministic sorting steps in the shared renderer'
  public readonly acceptsValue = false

  public create(model: FixedArray): StrandSortAnimation {
    return new StrandSortAnimation(model)
  }
}

export default class StrandSort extends ActionView<FixedArray> {
  protected readonly definition = new StrandSortDefinition()
}
