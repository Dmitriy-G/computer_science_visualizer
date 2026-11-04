import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { QuickSortAnimation } from './QuickSortAnimation.ts'
import './QuickSort.css'

class QuickSortDefinition implements ActionDefinition<FixedArray> {
  public readonly title = 'Quick Sort'
  public readonly context = 'Sorting / Array / Quick Sort'
  public readonly summary = QuickSortAnimation.describe(0).summary
  public readonly phases = ['Inspect', 'Locate', 'Move', 'Finish range', 'Commit']
  public readonly timelineHint = 'Deterministic sorting steps in the shared renderer'
  public readonly acceptsValue = false

  public create(model: FixedArray): QuickSortAnimation {
    return new QuickSortAnimation(model)
  }
}

export default class QuickSort extends ActionView<FixedArray> {
  protected readonly definition = new QuickSortDefinition()
}
