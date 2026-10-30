import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { DoublyLinkedList } from '../DoublyLinkedList.ts'
import { RemovalAnimation } from './RemovalAnimation.ts'
import './DeleteAtStart.css'

class DeleteAtStartDefinition implements ActionDefinition<DoublyLinkedList> {
  public readonly title = 'Delete at the start'
  public readonly context = 'Doubly linked list / delete at the start'
  public readonly summary = 'Remove the head and clear the new head prev pointer.'
  public readonly phases = ['Inspect', 'Locate', 'Unlink', 'Finish']
  public readonly timelineHint = 'Follow next and prev'
  public readonly acceptsValue = false

  public create(model: DoublyLinkedList, value: number): RemovalAnimation {
    return new RemovalAnimation(model)
  }
}

export default class DeleteAtStart extends ActionView<DoublyLinkedList> {
  protected readonly definition = new DeleteAtStartDefinition()
}
