import { ArraySortingPseudocode } from '../ArraySortingPseudocode.ts'
import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { SleepSortAnimation } from './SleepSortAnimation.ts'
import './SleepSort.css'

class SleepSortDefinition implements ActionDefinition<FixedArray> {
  public readonly pseudocode = ArraySortingPseudocode.sleepSort
  public readonly title = 'Sleep Sort'

  public create(model: FixedArray): SleepSortAnimation {
    return new SleepSortAnimation(model)
  }
}

export default class SleepSort extends ActionView<FixedArray> {
  protected readonly definition = new SleepSortDefinition()
}
