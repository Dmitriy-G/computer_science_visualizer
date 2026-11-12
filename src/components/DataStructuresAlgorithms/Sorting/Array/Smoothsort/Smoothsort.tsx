import { ArraySortingPseudocode } from '../ArraySortingPseudocode.ts'
import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { SmoothsortAnimation } from './SmoothsortAnimation.ts'
import './Smoothsort.css'

class SmoothsortDefinition implements ActionDefinition<FixedArray> {
  public readonly pseudocode = ArraySortingPseudocode.smoothsort
  public readonly title = 'Smoothsort'

  public create(model: FixedArray): SmoothsortAnimation {
    return new SmoothsortAnimation(model)
  }
}

export default class Smoothsort extends ActionView<FixedArray> {
  protected readonly definition = new SmoothsortDefinition()
}
