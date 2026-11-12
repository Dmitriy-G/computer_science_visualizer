import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { DoublyLinkedList } from '../DoublyLinkedList.ts'
import { SearchAnimation } from './SearchAnimation.ts'
import './SearchByIndex.css'

class SearchByIndexDefinition implements ActionDefinition<DoublyLinkedList> {
  public readonly title = 'Search by index'
  public readonly initialValue = 5

  public create(model: DoublyLinkedList, value: number): SearchAnimation {
    return new SearchAnimation(model, value)
  }
}

export default class SearchByIndex extends ActionView<DoublyLinkedList> {
  protected readonly definition = new SearchByIndexDefinition()
}
