import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { SpreadsortAnimation } from './SpreadsortAnimation.ts'
import './Spreadsort.css'

class SpreadsortDefinition implements ActionDefinition<FixedArray> {
  public readonly title = 'Spreadsort'
  public readonly context = 'Sorting / Array / Spreadsort'
  public readonly summary = SpreadsortAnimation.describe(0).summary
  public readonly phases = ['Inspect', 'Locate', 'Move', 'Finish range', 'Commit']
  public readonly timelineHint = 'Deterministic sorting steps in the shared renderer'
  public readonly acceptsValue = false

  public create(model: FixedArray): SpreadsortAnimation {
    return new SpreadsortAnimation(model)
  }
}

export default class Spreadsort extends ActionView<FixedArray> {
  protected readonly definition = new SpreadsortDefinition()
}
