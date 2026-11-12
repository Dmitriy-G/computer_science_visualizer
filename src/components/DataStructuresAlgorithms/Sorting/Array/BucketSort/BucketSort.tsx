import { ArraySortingPseudocode } from '../ArraySortingPseudocode.ts'
import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { BucketSortAnimation } from './BucketSortAnimation.ts'
import './BucketSort.css'

class BucketSortDefinition implements ActionDefinition<FixedArray> {
  public readonly pseudocode = ArraySortingPseudocode.bucketSort
  public readonly title = 'Bucket Sort'

  public create(model: FixedArray): BucketSortAnimation {
    return new BucketSortAnimation(model)
  }
}

export default class BucketSort extends ActionView<FixedArray> {
  protected readonly definition = new BucketSortDefinition()
}
