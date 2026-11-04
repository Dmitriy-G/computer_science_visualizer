import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { PolyphaseMergeSortAnimation } from './PolyphaseMergeSortAnimation.ts'
import './PolyphaseMergeSort.css'

class PolyphaseMergeSortDefinition implements ActionDefinition<FixedArray> {
  public readonly title = 'Polyphase Merge Sort'
  public readonly context = 'Sorting / Array / Polyphase Merge Sort'
  public readonly summary = PolyphaseMergeSortAnimation.describe(0).summary
  public readonly phases = ['Inspect', 'Locate', 'Move', 'Finish range', 'Commit']
  public readonly timelineHint = 'Deterministic sorting steps in the shared renderer'
  public readonly acceptsValue = false

  public create(model: FixedArray): PolyphaseMergeSortAnimation {
    return new PolyphaseMergeSortAnimation(model)
  }
}

export default class PolyphaseMergeSort extends ActionView<FixedArray> {
  protected readonly definition = new PolyphaseMergeSortDefinition()
}
