import { ArraySortingPseudocode } from '../ArraySortingPseudocode.ts'
import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { InterpolationSortAnimation } from './InterpolationSortAnimation.ts'
import './InterpolationSort.css'

class InterpolationSortDefinition implements ActionDefinition<FixedArray> {
  public readonly pseudocode = ArraySortingPseudocode.interpolationSort
  public readonly title = 'Interpolation Sort'

  public create(model: FixedArray): InterpolationSortAnimation {
    return new InterpolationSortAnimation(model)
  }
}

export default class InterpolationSort extends ActionView<FixedArray> {
  protected readonly definition = new InterpolationSortDefinition()
}
