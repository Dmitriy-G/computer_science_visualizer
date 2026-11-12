import { ArraySortingPseudocode } from '../ArraySortingPseudocode.ts'
import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { AmericanFlagSortAnimation } from './AmericanFlagSortAnimation.ts'
import './AmericanFlagSort.css'

class AmericanFlagSortDefinition implements ActionDefinition<FixedArray> {
  public readonly pseudocode = ArraySortingPseudocode.americanFlagSort
  public readonly title = 'American Flag Sort'

  public create(model: FixedArray): AmericanFlagSortAnimation {
    return new AmericanFlagSortAnimation(model)
  }
}

export default class AmericanFlagSort extends ActionView<FixedArray> {
  protected readonly definition = new AmericanFlagSortDefinition()
}
