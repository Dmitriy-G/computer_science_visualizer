import { ArraySortingPseudocode } from '../ArraySortingPseudocode.ts'
import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { PatienceSortAnimation } from './PatienceSortAnimation.ts'
import './PatienceSort.css'

class PatienceSortDefinition implements ActionDefinition<FixedArray> {
  public readonly pseudocode = ArraySortingPseudocode.patienceSort
  public readonly title = 'Patience Sort'

  public create(model: FixedArray): PatienceSortAnimation {
    return new PatienceSortAnimation(model)
  }
}

export default class PatienceSort extends ActionView<FixedArray> {
  protected readonly definition = new PatienceSortDefinition()
}
