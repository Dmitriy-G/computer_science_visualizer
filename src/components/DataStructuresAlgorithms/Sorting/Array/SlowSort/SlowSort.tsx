import { ArraySortingPseudocode } from '../ArraySortingPseudocode.ts'
import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { SlowSortAnimation } from './SlowSortAnimation.ts'
import './SlowSort.css'

class SlowSortDefinition implements ActionDefinition<FixedArray> {
  public readonly pseudocode = ArraySortingPseudocode.slowSort
  public readonly title = 'Slow Sort'

  public create(model: FixedArray): SlowSortAnimation {
    return new SlowSortAnimation(model)
  }
}

export default class SlowSort extends ActionView<FixedArray> {
  protected readonly definition = new SlowSortDefinition()
}
