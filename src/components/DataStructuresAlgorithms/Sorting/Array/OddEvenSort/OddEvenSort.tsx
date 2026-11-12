import { ArraySortingPseudocode } from '../ArraySortingPseudocode.ts'
import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { OddEvenSortAnimation } from './OddEvenSortAnimation.ts'
import './OddEvenSort.css'

class OddEvenSortDefinition implements ActionDefinition<FixedArray> {
  public readonly pseudocode = ArraySortingPseudocode.oddEvenSort
  public readonly title = 'Odd-Even Sort'

  public create(model: FixedArray): OddEvenSortAnimation {
    return new OddEvenSortAnimation(model)
  }
}

export default class OddEvenSort extends ActionView<FixedArray> {
  protected readonly definition = new OddEvenSortDefinition()
}
