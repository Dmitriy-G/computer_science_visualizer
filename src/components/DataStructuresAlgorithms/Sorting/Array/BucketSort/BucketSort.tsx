import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { BucketSortAnimation } from './BucketSortAnimation.ts'
import './BucketSort.css'

class BucketSortDefinition implements ActionDefinition<FixedArray> {
  public readonly title = 'Bucket Sort'
  public readonly context = 'Sorting / Array / Bucket Sort'
  public readonly summary = BucketSortAnimation.describe(0).summary
  public readonly phases = ['Inspect', 'Locate', 'Move', 'Finish range', 'Commit']
  public readonly timelineHint = 'Deterministic sorting steps in the shared renderer'
  public readonly acceptsValue = false

  public create(model: FixedArray): BucketSortAnimation {
    return new BucketSortAnimation(model)
  }
}

export default class BucketSort extends ActionView<FixedArray> {
  protected readonly definition = new BucketSortDefinition()
}
