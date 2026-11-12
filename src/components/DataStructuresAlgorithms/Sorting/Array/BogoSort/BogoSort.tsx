import { ArraySortingPseudocode } from '../ArraySortingPseudocode.ts'
import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { BogoSortAnimation } from './BogoSortAnimation.ts'
import './BogoSort.css'

class BogoSortDefinition implements ActionDefinition<FixedArray> {
  public readonly pseudocode = ArraySortingPseudocode.bogoSort
  public readonly title = 'Bogo Sort'

  public create(model: FixedArray): BogoSortAnimation {
    return new BogoSortAnimation(model)
  }
}

export default class BogoSort extends ActionView<FixedArray> {
  protected readonly definition = new BogoSortDefinition()
}
