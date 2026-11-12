import { ArraySortingPseudocode } from '../ArraySortingPseudocode.ts'
import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { ShellSortAnimation } from './ShellSortAnimation.ts'
import './ShellSort.css'

class ShellSortDefinition implements ActionDefinition<FixedArray> {
  public readonly pseudocode = ArraySortingPseudocode.shellSort
  public readonly title = 'Shell Sort'

  public create(model: FixedArray): ShellSortAnimation {
    return new ShellSortAnimation(model)
  }
}

export default class ShellSort extends ActionView<FixedArray> {
  protected readonly definition = new ShellSortDefinition()
}
