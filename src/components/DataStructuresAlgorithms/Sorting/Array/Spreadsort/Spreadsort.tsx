import { ArraySortingPseudocode } from '../ArraySortingPseudocode.ts'
import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { SpreadsortAnimation } from './SpreadsortAnimation.ts'
import './Spreadsort.css'

class SpreadsortDefinition implements ActionDefinition<FixedArray> {
  public readonly pseudocode = ArraySortingPseudocode.spreadsort
  public readonly title = 'Spreadsort'

  public create(model: FixedArray): SpreadsortAnimation {
    return new SpreadsortAnimation(model)
  }
}

export default class Spreadsort extends ActionView<FixedArray> {
  protected readonly definition = new SpreadsortDefinition()
}
