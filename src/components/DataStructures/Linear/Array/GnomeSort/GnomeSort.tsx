import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../FixedArray.ts'
import { GnomeSortAnimation } from './GnomeSortAnimation.ts'
import './GnomeSort.css'

class GnomeSortDefinition implements ActionDefinition<FixedArray> {
  public readonly title = 'Gnome Sort'
  public readonly context = 'Sorting / Array / Gnome Sort'
  public readonly summary = GnomeSortAnimation.describe(0).summary
  public readonly phases = ['Inspect', 'Locate', 'Move', 'Finish range', 'Commit']
  public readonly timelineHint = 'Deterministic sorting steps in the shared renderer'
  public readonly acceptsValue = false

  public create(model: FixedArray): GnomeSortAnimation {
    return new GnomeSortAnimation(model)
  }
}

export default class GnomeSort extends ActionView<FixedArray> {
  protected readonly definition = new GnomeSortDefinition()
}
