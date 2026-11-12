import { ArraySortingPseudocode } from '../ArraySortingPseudocode.ts'
import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { CycleSortAnimation } from './CycleSortAnimation.ts'
import './CycleSort.css'

class CycleSortDefinition implements ActionDefinition<FixedArray> {
  public readonly pseudocode = ArraySortingPseudocode.cycleSort
  public readonly title = 'Cycle Sort'

  public create(model: FixedArray): CycleSortAnimation {
    return new CycleSortAnimation(model)
  }
}

export default class CycleSort extends ActionView<FixedArray> {
  protected readonly definition = new CycleSortDefinition()
}
