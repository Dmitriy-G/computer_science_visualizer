import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { DoublyLinkedList } from '../DoublyLinkedList.ts'
import { RemovalAnimation } from './RemovalAnimation.ts'
import './DeleteByValue.css'

class DeleteByValueDefinition implements ActionDefinition<DoublyLinkedList> {
  public readonly title = 'Delete by value'
  public readonly context = 'Doubly linked list / delete by value'
  public readonly summary = 'Find the first match and reconnect next and prev.'
  public readonly phases = ['Inspect', 'Locate', 'Unlink', 'Finish']
  public readonly timelineHint = 'Follow next and prev'
  public readonly acceptsValue = true
  public readonly inputLabel = 'Value to delete'
  public readonly initialValue = 50

  public create(model: DoublyLinkedList, value: number): RemovalAnimation {
    return new RemovalAnimation(model, value)
  }
}

export default class DeleteByValue extends ActionView<DoublyLinkedList> {
  protected readonly definition = new DeleteByValueDefinition()
}
