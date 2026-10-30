import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { DoublyLinkedList } from '../DoublyLinkedList.ts'
import { SearchAnimation } from './SearchAnimation.ts'
import './SearchByIndex.css'

class SearchByIndexDefinition implements ActionDefinition<DoublyLinkedList> {
  public readonly title = 'Search by index'
  public readonly context = 'Doubly linked list / search by index'
  public readonly summary = 'Follow next or prev from the nearer end.'
  public readonly phases = ['Inspect', 'Traverse', 'Finish']
  public readonly timelineHint = 'Follow next and prev'
  public readonly acceptsValue = true
  public readonly inputLabel = 'Zero-based index'
  public readonly initialValue = 5
  public readonly inputMinimum = 0

  public create(model: DoublyLinkedList, value: number): SearchAnimation {
    return new SearchAnimation(model, value)
  }
}

export default class SearchByIndex extends ActionView<DoublyLinkedList> {
  protected readonly definition = new SearchByIndexDefinition()
}
