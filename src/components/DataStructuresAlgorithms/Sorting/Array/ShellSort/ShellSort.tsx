import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { ShellSortAnimation } from './ShellSortAnimation.ts'
import './ShellSort.css'

class ShellSortDefinition implements ActionDefinition<FixedArray> {
  public readonly title = 'Shell Sort'
  public readonly context = 'Sorting / Array / Shell Sort'
  public readonly summary = ShellSortAnimation.describe(0).summary
  public readonly phases = ['Inspect', 'Locate', 'Move', 'Finish range', 'Commit']
  public readonly timelineHint = 'Deterministic sorting steps in the shared renderer'
  public readonly acceptsValue = false

  public create(model: FixedArray): ShellSortAnimation {
    return new ShellSortAnimation(model)
  }
}

export default class ShellSort extends ActionView<FixedArray> {
  protected readonly definition = new ShellSortDefinition()
}
