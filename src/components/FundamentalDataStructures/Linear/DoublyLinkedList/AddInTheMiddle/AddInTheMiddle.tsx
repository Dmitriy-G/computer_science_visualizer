import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { DoublyLinkedList } from '../DoublyLinkedList.ts'
import { InsertionAnimation } from './InsertionAnimation.ts'
import './AddInTheMiddle.css'

class AddInTheMiddleDefinition implements ActionDefinition<DoublyLinkedList> {
  public readonly title = 'Insert in the middle'
  public readonly initialValue = 99

  public create(model: DoublyLinkedList, value: number): InsertionAnimation {
    return new InsertionAnimation(model, value)
  }
}

export default class AddInTheMiddle extends ActionView<DoublyLinkedList> {
  protected readonly definition = new AddInTheMiddleDefinition()
}
