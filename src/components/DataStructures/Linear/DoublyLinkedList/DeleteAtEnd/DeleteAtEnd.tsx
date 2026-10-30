import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { DoublyLinkedList } from '../DoublyLinkedList.ts'
import { RemovalAnimation } from './RemovalAnimation.ts'
import './DeleteAtEnd.css'

class DeleteAtEndDefinition implements ActionDefinition<DoublyLinkedList> {
  public readonly title = 'Delete at the end'
  public readonly context = 'Doubly linked list / delete at the end'
  public readonly summary = 'Remove the tail and clear the new tail next pointer.'
  public readonly phases = ['Inspect', 'Locate', 'Unlink', 'Finish']
  public readonly timelineHint = 'Follow next and prev'
  public readonly acceptsValue = false

  public create(model: DoublyLinkedList, value: number): RemovalAnimation {
    return new RemovalAnimation(model)
  }
}

export default class DeleteAtEnd extends ActionView<DoublyLinkedList> {
  protected readonly definition = new DeleteAtEndDefinition()
}
