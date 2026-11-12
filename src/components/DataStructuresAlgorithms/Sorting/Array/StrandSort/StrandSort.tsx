import { ArraySortingPseudocode } from '../ArraySortingPseudocode.ts'
import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { StrandSortAnimation } from './StrandSortAnimation.ts'
import './StrandSort.css'

class StrandSortDefinition implements ActionDefinition<FixedArray> {
  public readonly pseudocode = ArraySortingPseudocode.strandSort
  public readonly title = 'Strand Sort'

  public create(model: FixedArray): StrandSortAnimation {
    return new StrandSortAnimation(model)
  }
}

export default class StrandSort extends ActionView<FixedArray> {
  protected readonly definition = new StrandSortDefinition()
}
