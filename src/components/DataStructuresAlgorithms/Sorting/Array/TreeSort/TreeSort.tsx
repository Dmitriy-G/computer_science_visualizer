import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { TreeSortAnimation } from './TreeSortAnimation.ts'
import './TreeSort.css'

class TreeSortDefinition implements ActionDefinition<FixedArray> {
  public readonly title = 'Tree Sort'
  public readonly context = 'Sorting / Array / Tree Sort'
  public readonly summary = TreeSortAnimation.describe(0).summary
  public readonly phases = ['Inspect', 'Locate', 'Move', 'Finish range', 'Commit']
  public readonly timelineHint = 'Deterministic sorting steps in the shared renderer'
  public readonly acceptsValue = false

  public create(model: FixedArray): TreeSortAnimation {
    return new TreeSortAnimation(model)
  }
}

export default class TreeSort extends ActionView<FixedArray> {
  protected readonly definition = new TreeSortDefinition()
}
