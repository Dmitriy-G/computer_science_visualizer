import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { DoublyLinkedList } from '../DoublyLinkedList.ts'
import { InsertionAnimation } from './InsertionAnimation.ts'
import './AddAtEnd.css'

class AddAtEndDefinition implements ActionDefinition<DoublyLinkedList> {
  public readonly title = 'Insert at the end'
  public readonly initialValue = 99

  public create(model: DoublyLinkedList, value: number): InsertionAnimation {
    return new InsertionAnimation(model, value)
  }
}

export default class AddAtEnd extends ActionView<DoublyLinkedList> {
  protected readonly definition = new AddAtEndDefinition()
}
