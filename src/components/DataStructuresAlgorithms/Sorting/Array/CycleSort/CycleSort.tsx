import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { CycleSortAnimation } from './CycleSortAnimation.ts'
import './CycleSort.css'

class CycleSortDefinition implements ActionDefinition<FixedArray> {
  public readonly title = 'Cycle Sort'
  public readonly context = 'Sorting / Array / Cycle Sort'
  public readonly summary = CycleSortAnimation.describe(0).summary
  public readonly phases = ['Inspect', 'Locate', 'Move', 'Finish range', 'Commit']
  public readonly timelineHint = 'Deterministic sorting steps in the shared renderer'
  public readonly acceptsValue = false

  public create(model: FixedArray): CycleSortAnimation {
    return new CycleSortAnimation(model)
  }
}

export default class CycleSort extends ActionView<FixedArray> {
  protected readonly definition = new CycleSortDefinition()
}
