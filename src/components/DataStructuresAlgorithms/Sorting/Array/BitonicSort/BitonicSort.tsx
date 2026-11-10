import { ArraySortingPseudocode } from '../ArraySortingPseudocode.ts'
import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { BitonicSortAnimation } from './BitonicSortAnimation.ts'
import './BitonicSort.css'

class BitonicSortDefinition implements ActionDefinition<FixedArray> {
  public readonly pseudocode = ArraySortingPseudocode.bitonicSort
  public readonly title = 'Bitonic Sort'
  public readonly context = 'Sorting / Array / Bitonic Sort'
  public readonly summary = BitonicSortAnimation.describe(0).summary
  public readonly phases = ['Inspect', 'Locate', 'Move', 'Finish range', 'Commit']
  public readonly timelineHint = 'Deterministic sorting steps in the shared renderer'
  public readonly acceptsValue = false

  public create(model: FixedArray): BitonicSortAnimation {
    return new BitonicSortAnimation(model)
  }
}

export default class BitonicSort extends ActionView<FixedArray> {
  protected readonly definition = new BitonicSortDefinition()
}
