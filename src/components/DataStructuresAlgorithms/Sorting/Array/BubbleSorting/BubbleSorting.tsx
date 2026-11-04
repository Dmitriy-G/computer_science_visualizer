import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { BubbleSortingAnimation } from './BubbleSortingAnimation.ts'
import './BubbleSorting.css'

class BubbleSortingDefinition implements ActionDefinition<FixedArray> {
  public readonly title = 'Bubble Sort'
  public readonly context = 'Sorting / Array / Bubble Sort'
  public readonly summary = 'Sort adjacent values into ascending order with an early exit after a pass without swaps.'
  public readonly phases = ['Inspect', 'Compare', 'Swap', 'Pass', 'Finish']
  public readonly timelineHint = 'Adjacent comparisons, swaps, and a growing sorted suffix'
  public readonly acceptsValue = false

  public create(model: FixedArray): BubbleSortingAnimation {
    return new BubbleSortingAnimation(model)
  }
}

export default class BubbleSorting extends ActionView<FixedArray> {
  protected readonly definition = new BubbleSortingDefinition()
}
