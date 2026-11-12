import { ArraySortingPseudocode } from '../ArraySortingPseudocode.ts'
import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { SplaySortAnimation } from './SplaySortAnimation.ts'
import './SplaySort.css'

class SplaySortDefinition implements ActionDefinition<FixedArray> {
  public readonly pseudocode = ArraySortingPseudocode.splaySort
  public readonly title = 'Splay Sort'

  public create(model: FixedArray): SplaySortAnimation {
    return new SplaySortAnimation(model)
  }
}

export default class SplaySort extends ActionView<FixedArray> {
  protected readonly definition = new SplaySortDefinition()
}
