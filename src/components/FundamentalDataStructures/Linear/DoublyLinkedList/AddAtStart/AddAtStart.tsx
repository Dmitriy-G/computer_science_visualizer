import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { DoublyLinkedList } from '../DoublyLinkedList.ts'
import { InsertionAnimation } from './InsertionAnimation.ts'
import './AddAtStart.css'

class AddAtStartDefinition implements ActionDefinition<DoublyLinkedList> {
  public readonly title = 'Insert at the start'
  public readonly initialValue = 99

  public create(model: DoublyLinkedList, value: number): InsertionAnimation {
    return new InsertionAnimation(model, value)
  }
}

export default class AddAtStart extends ActionView<DoublyLinkedList> {
  protected readonly definition = new AddAtStartDefinition()
}
