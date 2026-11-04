import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { SplaySortAnimation } from './SplaySortAnimation.ts'
import './SplaySort.css'

class SplaySortDefinition implements ActionDefinition<FixedArray> {
  public readonly title = 'Splay Sort'
  public readonly context = 'Sorting / Array / Splay Sort'
  public readonly summary = SplaySortAnimation.describe(0).summary
  public readonly phases = ['Inspect', 'Locate', 'Move', 'Finish range', 'Commit']
  public readonly timelineHint = 'Deterministic sorting steps in the shared renderer'
  public readonly acceptsValue = false

  public create(model: FixedArray): SplaySortAnimation {
    return new SplaySortAnimation(model)
  }
}

export default class SplaySort extends ActionView<FixedArray> {
  protected readonly definition = new SplaySortDefinition()
}
