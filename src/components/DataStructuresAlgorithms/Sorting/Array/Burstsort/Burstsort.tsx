import { ArraySortingPseudocode } from '../ArraySortingPseudocode.ts'
import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { BurstsortAnimation } from './BurstsortAnimation.ts'
import './Burstsort.css'

class BurstsortDefinition implements ActionDefinition<FixedArray> {
  public readonly pseudocode = ArraySortingPseudocode.burstsort
  public readonly title = 'Burstsort'

  public create(model: FixedArray): BurstsortAnimation {
    return new BurstsortAnimation(model)
  }
}

export default class Burstsort extends ActionView<FixedArray> {
  protected readonly definition = new BurstsortDefinition()
}
