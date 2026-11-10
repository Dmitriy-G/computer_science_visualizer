import { ArraySortingPseudocode } from '../ArraySortingPseudocode.ts'
import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { AmericanFlagSortAnimation } from './AmericanFlagSortAnimation.ts'
import './AmericanFlagSort.css'

class AmericanFlagSortDefinition implements ActionDefinition<FixedArray> {
  public readonly pseudocode = ArraySortingPseudocode.americanFlagSort
  public readonly title = 'American Flag Sort'
  public readonly context = 'Sorting / Array / American Flag Sort'
  public readonly summary = AmericanFlagSortAnimation.describe(0).summary
  public readonly phases = ['Inspect', 'Locate', 'Move', 'Finish range', 'Commit']
  public readonly timelineHint = 'Deterministic sorting steps in the shared renderer'
  public readonly acceptsValue = false

  public create(model: FixedArray): AmericanFlagSortAnimation {
    return new AmericanFlagSortAnimation(model)
  }
}

export default class AmericanFlagSort extends ActionView<FixedArray> {
  protected readonly definition = new AmericanFlagSortDefinition()
}
