import { ArraySortingPseudocode } from '../ArraySortingPseudocode.ts'
import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { BubbleSortingAnimation } from './BubbleSortingAnimation.ts'
import './BubbleSorting.css'

class BubbleSortingDefinition implements ActionDefinition<FixedArray> {
  public readonly pseudocode = ArraySortingPseudocode.bubbleSorting
  public readonly title = 'Bubble Sort'

  public create(model: FixedArray): BubbleSortingAnimation {
    return new BubbleSortingAnimation(model)
  }
}

export default class BubbleSorting extends ActionView<FixedArray> {
  protected readonly definition = new BubbleSortingDefinition()
}
