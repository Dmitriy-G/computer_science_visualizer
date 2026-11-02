import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../../../../DataStructuresOverview/Linear/Array/FixedArray.ts'
import { BurstsortAnimation } from './BurstsortAnimation.ts'
import './Burstsort.css'

class BurstsortDefinition implements ActionDefinition<FixedArray> {
  public readonly title = 'Burstsort'
  public readonly context = 'Sorting / Array / Burstsort'
  public readonly summary = BurstsortAnimation.describe(0).summary
  public readonly phases = ['Inspect', 'Locate', 'Move', 'Finish range', 'Commit']
  public readonly timelineHint = 'Deterministic sorting steps in the shared renderer'
  public readonly acceptsValue = false

  public create(model: FixedArray): BurstsortAnimation {
    return new BurstsortAnimation(model)
  }
}

export default class Burstsort extends ActionView<FixedArray> {
  protected readonly definition = new BurstsortDefinition()
}
