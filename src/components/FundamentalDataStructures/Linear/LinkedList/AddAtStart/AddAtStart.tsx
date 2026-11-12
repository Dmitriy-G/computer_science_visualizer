import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { LinkedList } from '../LinkedList.ts'
import { InsertionAnimation } from './InsertionAnimation.ts'
import './AddAtStart.css'

class InsertionDefinition implements ActionDefinition<LinkedList> {
  public readonly title = 'Insert at the start'
  public create(model: LinkedList, value: number): InsertionAnimation { return new InsertionAnimation(model, value) }
}

export default class AddAtStart extends ActionView<LinkedList> {
  protected readonly definition = new InsertionDefinition()
}
