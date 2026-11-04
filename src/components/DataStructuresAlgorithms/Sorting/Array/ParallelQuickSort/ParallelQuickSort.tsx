import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { ParallelQuickSortAnimation } from './ParallelQuickSortAnimation.ts'
import './ParallelQuickSort.css'

class ParallelQuickSortDefinition implements ActionDefinition<FixedArray> {
  public readonly title = 'Parallel QuickSort'
  public readonly context = 'Sorting / Array / Parallel QuickSort'
  public readonly summary = ParallelQuickSortAnimation.describe(0).summary
  public readonly phases = ['Inspect', 'Locate', 'Move', 'Finish range', 'Commit']
  public readonly timelineHint = 'Deterministic sorting steps in the shared renderer'
  public readonly acceptsValue = false

  public create(model: FixedArray): ParallelQuickSortAnimation {
    return new ParallelQuickSortAnimation(model)
  }
}

export default class ParallelQuickSort extends ActionView<FixedArray> {
  protected readonly definition = new ParallelQuickSortDefinition()
}
