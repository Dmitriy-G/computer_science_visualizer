import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../FixedArray.ts'
import { ParallelMergeSortAnimation } from './ParallelMergeSortAnimation.ts'
import './ParallelMergeSort.css'

class ParallelMergeSortDefinition implements ActionDefinition<FixedArray> {
  public readonly title = 'Parallel Merge Sort'
  public readonly context = 'Sorting / Array / Parallel Merge Sort'
  public readonly summary = ParallelMergeSortAnimation.describe(0).summary
  public readonly phases = ['Inspect', 'Locate', 'Move', 'Finish range', 'Commit']
  public readonly timelineHint = 'Deterministic sorting steps in the shared renderer'
  public readonly acceptsValue = false

  public create(model: FixedArray): ParallelMergeSortAnimation {
    return new ParallelMergeSortAnimation(model)
  }
}

export default class ParallelMergeSort extends ActionView<FixedArray> {
  protected readonly definition = new ParallelMergeSortDefinition()
}
