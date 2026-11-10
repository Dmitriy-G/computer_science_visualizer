import { ArraySortingPseudocode } from '../ArraySortingPseudocode.ts'
import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { PigeonholeSortAnimation } from './PigeonholeSortAnimation.ts'
import './PigeonholeSort.css'

class PigeonholeSortDefinition implements ActionDefinition<FixedArray> {
  public readonly pseudocode = ArraySortingPseudocode.pigeonholeSort
  public readonly title = 'Pigeonhole Sort'
  public readonly context = 'Sorting / Array / Pigeonhole Sort'
  public readonly summary = PigeonholeSortAnimation.describe(0).summary
  public readonly phases = ['Inspect', 'Locate', 'Move', 'Finish range', 'Commit']
  public readonly timelineHint = 'Deterministic sorting steps in the shared renderer'
  public readonly acceptsValue = false

  public create(model: FixedArray): PigeonholeSortAnimation {
    return new PigeonholeSortAnimation(model)
  }
}

export default class PigeonholeSort extends ActionView<FixedArray> {
  protected readonly definition = new PigeonholeSortDefinition()
}
