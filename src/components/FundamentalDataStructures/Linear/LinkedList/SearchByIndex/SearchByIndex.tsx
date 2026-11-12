import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { LinkedList } from '../LinkedList.ts'
import { SearchAnimation } from './SearchAnimation.ts'
import './SearchByIndex.css'

class SearchDefinition implements ActionDefinition<LinkedList> {
  public readonly title = 'Search by index'
  public readonly initialValue = 4

  public create(model: LinkedList, value: number): SearchAnimation { return new SearchAnimation(model, value) }
}

export default class SearchByIndex extends ActionView<LinkedList> {
  protected readonly definition = new SearchDefinition()
}
