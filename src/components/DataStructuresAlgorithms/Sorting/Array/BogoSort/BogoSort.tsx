import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { BogoSortAnimation } from './BogoSortAnimation.ts'
import './BogoSort.css'

class BogoSortDefinition implements ActionDefinition<FixedArray> {
  public readonly title = 'Bogo Sort'
  public readonly context = 'Sorting / Array / Bogo Sort'
  public readonly summary = BogoSortAnimation.describe(0).summary
  public readonly phases = ['Inspect', 'Locate', 'Move', 'Finish range', 'Commit']
  public readonly timelineHint = 'Deterministic sorting steps in the shared renderer'
  public readonly acceptsValue = false

  public create(model: FixedArray): BogoSortAnimation {
    return new BogoSortAnimation(model)
  }
}

export default class BogoSort extends ActionView<FixedArray> {
  protected readonly definition = new BogoSortDefinition()
}
