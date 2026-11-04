import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { RadixSortAnimation } from './RadixSortAnimation.ts'
import './RadixSort.css'

class RadixSortDefinition implements ActionDefinition<FixedArray> {
  public readonly title = 'Radix Sort'
  public readonly context = 'Sorting / Array / Radix Sort'
  public readonly summary = RadixSortAnimation.describe(0).summary
  public readonly phases = ['Inspect', 'Locate', 'Move', 'Finish range', 'Commit']
  public readonly timelineHint = 'Deterministic sorting steps in the shared renderer'
  public readonly acceptsValue = false

  public create(model: FixedArray): RadixSortAnimation {
    return new RadixSortAnimation(model)
  }
}

export default class RadixSort extends ActionView<FixedArray> {
  protected readonly definition = new RadixSortDefinition()
}
