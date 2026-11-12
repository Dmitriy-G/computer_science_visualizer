import { ArraySortingPseudocode } from '../ArraySortingPseudocode.ts'
import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { SampleSortAnimation } from './SampleSortAnimation.ts'
import './SampleSort.css'

class SampleSortDefinition implements ActionDefinition<FixedArray> {
  public readonly pseudocode = ArraySortingPseudocode.sampleSort
  public readonly title = 'Sample Sort'

  public create(model: FixedArray): SampleSortAnimation {
    return new SampleSortAnimation(model)
  }
}

export default class SampleSort extends ActionView<FixedArray> {
  protected readonly definition = new SampleSortDefinition()
}
