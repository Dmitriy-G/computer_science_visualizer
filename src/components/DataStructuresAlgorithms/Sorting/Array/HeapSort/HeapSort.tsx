import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { HeapSortAnimation } from './HeapSortAnimation.ts'
import './HeapSort.css'

class HeapSortDefinition implements ActionDefinition<FixedArray> {
  public readonly title = 'Heap Sort'
  public readonly context = 'Sorting / Array / Heap Sort'
  public readonly summary = HeapSortAnimation.describe(0).summary
  public readonly phases = ['Inspect', 'Locate', 'Move', 'Finish range', 'Commit']
  public readonly timelineHint = 'Deterministic sorting steps in the shared renderer'
  public readonly acceptsValue = false

  public create(model: FixedArray): HeapSortAnimation {
    return new HeapSortAnimation(model)
  }
}

export default class HeapSort extends ActionView<FixedArray> {
  protected readonly definition = new HeapSortDefinition()
}
