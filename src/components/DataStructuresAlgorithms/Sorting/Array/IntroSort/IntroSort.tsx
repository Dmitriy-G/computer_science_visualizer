import { ArraySortingPseudocode } from '../ArraySortingPseudocode.ts'
import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { IntroSortAnimation } from './IntroSortAnimation.ts'
import './IntroSort.css'

class IntroSortDefinition implements ActionDefinition<FixedArray> {
  public readonly pseudocode = ArraySortingPseudocode.introSort
  public readonly title = 'IntroSort'

  public create(model: FixedArray): IntroSortAnimation {
    return new IntroSortAnimation(model)
  }
}

export default class IntroSort extends ActionView<FixedArray> {
  protected readonly definition = new IntroSortDefinition()
}
