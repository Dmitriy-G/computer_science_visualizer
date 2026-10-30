import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { DoublyLinkedList } from '../DoublyLinkedList.ts'
import { InsertionAnimation } from './InsertionAnimation.ts'
import './AddAtEnd.css'

class AddAtEndDefinition implements ActionDefinition<DoublyLinkedList> {
  public readonly title = 'Insert at the end'
  public readonly context = 'Doubly linked list / insert at the end'
  public readonly summary = 'Insert a new tail and connect next and prev.'
  public readonly phases = ['Inspect', 'Locate', 'Create', 'Place', 'Connect', 'Finish']
  public readonly timelineHint = 'Follow next and prev'
  public readonly acceptsValue = true
  public readonly inputLabel = 'Value to insert'
  public readonly initialValue = 99

  public create(model: DoublyLinkedList, value: number): InsertionAnimation {
    return new InsertionAnimation(model, value)
  }
}

export default class AddAtEnd extends ActionView<DoublyLinkedList> {
  protected readonly definition = new AddAtEndDefinition()
}
