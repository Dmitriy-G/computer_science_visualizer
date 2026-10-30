import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { DoublyLinkedList } from '../DoublyLinkedList.ts'
import { SearchAnimation } from './SearchAnimation.ts'
import './SearchByValue.css'

class SearchByValueDefinition implements ActionDefinition<DoublyLinkedList> {
  public readonly title = 'Search by value'
  public readonly context = 'Doubly linked list / search by value'
  public readonly summary = 'Follow next pointers to the first match.'
  public readonly phases = ['Inspect', 'Compare', 'Finish']
  public readonly timelineHint = 'Follow next and prev'
  public readonly acceptsValue = true
  public readonly inputLabel = 'Value to find'
  public readonly initialValue = 50

  public create(model: DoublyLinkedList, value: number): SearchAnimation {
    return new SearchAnimation(model, value)
  }
}

export default class SearchByValue extends ActionView<DoublyLinkedList> {
  protected readonly definition = new SearchByValueDefinition()
}
