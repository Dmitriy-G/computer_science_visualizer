import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../FixedArray.ts'
import { InsertionAnimation } from './InsertionAnimation.ts'
import './AddAtEnd.css'

class InsertionDefinition implements ActionDefinition<FixedArray> {
  public readonly title = 'Insert at the end'
  public create(model: FixedArray, value: number): InsertionAnimation { return new InsertionAnimation(model, value) }
}

export default class AddAtEnd extends ActionView<FixedArray> {
  protected readonly definition = new InsertionDefinition()
}
