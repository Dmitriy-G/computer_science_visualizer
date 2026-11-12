import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { DoublyLinkedList } from '../DoublyLinkedList.ts'
import { SearchAnimation } from './SearchAnimation.ts'
import './SearchByValue.css'

class SearchByValueDefinition implements ActionDefinition<DoublyLinkedList> {
  public readonly title = 'Search by value'
  public readonly initialValue = 50

  public create(model: DoublyLinkedList, value: number): SearchAnimation {
    return new SearchAnimation(model, value)
  }
}

export default class SearchByValue extends ActionView<DoublyLinkedList> {
  protected readonly definition = new SearchByValueDefinition()
}
