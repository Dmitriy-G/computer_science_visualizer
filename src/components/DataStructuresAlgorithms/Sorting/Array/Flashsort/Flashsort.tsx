import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { FlashsortAnimation } from './FlashsortAnimation.ts'
import './Flashsort.css'

class FlashsortDefinition implements ActionDefinition<FixedArray> {
  public readonly title = 'Flashsort'
  public readonly context = 'Sorting / Array / Flashsort'
  public readonly summary = FlashsortAnimation.describe(0).summary
  public readonly phases = ['Inspect', 'Locate', 'Move', 'Finish range', 'Commit']
  public readonly timelineHint = 'Deterministic sorting steps in the shared renderer'
  public readonly acceptsValue = false

  public create(model: FixedArray): FlashsortAnimation {
    return new FlashsortAnimation(model)
  }
}

export default class Flashsort extends ActionView<FixedArray> {
  protected readonly definition = new FlashsortDefinition()
}
