import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../FixedArray.ts'
import { InsertionAnimation } from './InsertionAnimation.ts'
import './AddAtStart.css'

class InsertionDefinition implements ActionDefinition<FixedArray> {
  public readonly title = 'Insert at the start'
  public create(model: FixedArray, value: number): InsertionAnimation { return new InsertionAnimation(model, value) }
}

export default class AddAtStart extends ActionView<FixedArray> {
  protected readonly definition = new InsertionDefinition()
}
