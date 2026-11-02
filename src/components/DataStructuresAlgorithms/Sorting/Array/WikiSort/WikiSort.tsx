import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../DataStructuresOverview/Linear/Array/FixedArray.ts'
import { WikiSortAnimation } from './WikiSortAnimation.ts'
import './WikiSort.css'

class WikiSortDefinition implements ActionDefinition<FixedArray> {
  public readonly title = 'WikiSort'
  public readonly context = 'Sorting / Array / WikiSort'
  public readonly summary = WikiSortAnimation.describe(0).summary
  public readonly phases = ['Inspect', 'Locate', 'Move', 'Finish range', 'Commit']
  public readonly timelineHint = 'Deterministic sorting steps in the shared renderer'
  public readonly acceptsValue = false

  public create(model: FixedArray): WikiSortAnimation {
    return new WikiSortAnimation(model)
  }
}

export default class WikiSort extends ActionView<FixedArray> {
  protected readonly definition = new WikiSortDefinition()
}
