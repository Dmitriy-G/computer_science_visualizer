import { ArraySortingPseudocode } from '../ArraySortingPseudocode.ts'
import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { FlashsortAnimation } from './FlashsortAnimation.ts'
import './Flashsort.css'

class FlashsortDefinition implements ActionDefinition<FixedArray> {
  public readonly pseudocode = ArraySortingPseudocode.flashsort
  public readonly title = 'Flashsort'

  public create(model: FixedArray): FlashsortAnimation {
    return new FlashsortAnimation(model)
  }
}

export default class Flashsort extends ActionView<FixedArray> {
  protected readonly definition = new FlashsortDefinition()
}
