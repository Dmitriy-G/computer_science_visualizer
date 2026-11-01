import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../FixedArray.ts'
import { BubbleSortingAnimation } from './BubbleSortingAnimation.ts'
import './BubbleSorting.css'

class BubbleSortingDefinition implements ActionDefinition<FixedArray> {
  public readonly title = 'BubbleSorting'
  public readonly context = 'Sorting / Array / BubbleSorting'
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
