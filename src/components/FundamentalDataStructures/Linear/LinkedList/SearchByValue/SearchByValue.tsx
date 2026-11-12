import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { LinkedList } from '../LinkedList.ts'
import { SearchAnimation } from './SearchAnimation.ts'
import './SearchByValue.css'

class SearchDefinition implements ActionDefinition<LinkedList> {
  public readonly title = 'Search by value'
  public readonly initialValue = 70

  public create(model: LinkedList, value: number): SearchAnimation { return new SearchAnimation(model, value) }
}

export default class SearchByValue extends ActionView<LinkedList> {
  protected readonly definition = new SearchDefinition()
}
