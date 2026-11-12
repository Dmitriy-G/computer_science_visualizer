import { ArraySortingPseudocode } from '../ArraySortingPseudocode.ts'
import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { TimSortAnimation } from './TimSortAnimation.ts'
import './TimSort.css'

class TimSortDefinition implements ActionDefinition<FixedArray> {
  public readonly pseudocode = ArraySortingPseudocode.timSort
  public readonly title = 'TimSort'

  public create(model: FixedArray): TimSortAnimation {
    return new TimSortAnimation(model)
  }
}

export default class TimSort extends ActionView<FixedArray> {
  protected readonly definition = new TimSortDefinition()
}
