import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { DoublyLinkedList } from '../DoublyLinkedList.ts'
import { RemovalAnimation } from './RemovalAnimation.ts'
import './DeleteAtEnd.css'

class DeleteAtEndDefinition implements ActionDefinition<DoublyLinkedList> {
  public readonly title = 'Delete at the end'

  public create(model: DoublyLinkedList, value: number): RemovalAnimation {
    return new RemovalAnimation(model)
  }
}

export default class DeleteAtEnd extends ActionView<DoublyLinkedList> {
  protected readonly definition = new DeleteAtEndDefinition()
}
