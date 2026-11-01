import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../FixedArray.ts'
import { ExternalMergeSortAnimation } from './ExternalMergeSortAnimation.ts'
import './ExternalMergeSort.css'

class ExternalMergeSortDefinition implements ActionDefinition<FixedArray> {
  public readonly title = 'External Merge Sort'
  public readonly context = 'Sorting / Array / External Merge Sort'
  public readonly summary = ExternalMergeSortAnimation.describe(0).summary
  public readonly phases = ['Inspect', 'Locate', 'Move', 'Finish range', 'Commit']
  public readonly timelineHint = 'Deterministic sorting steps in the shared renderer'
  public readonly acceptsValue = false

  public create(model: FixedArray): ExternalMergeSortAnimation {
    return new ExternalMergeSortAnimation(model)
  }
}

export default class ExternalMergeSort extends ActionView<FixedArray> {
  protected readonly definition = new ExternalMergeSortDefinition()
}
