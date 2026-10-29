import ActionView from '../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../visualization/ActionDefinition.ts'
import { LinkedList } from '../LinkedList.ts'
import { SearchAnimation } from './SearchAnimation.ts'
import './SearchByValue.css'

class SearchDefinition implements ActionDefinition<LinkedList> {
  public readonly title = 'Search by value'
  public readonly context = 'Linked list / search'
  public readonly summary = 'Scan from the beginning and stop at the first equal value.'
  public readonly phases = ['Start', 'Examine', 'Result', 'Finish']
  public readonly timelineHint = 'Follow the highlighted search path'
  public readonly inputLabel = 'Value to find'
  public readonly initialValue = 70

  public create(model: LinkedList, value: number): SearchAnimation { return new SearchAnimation(model, value) }
}

export default class SearchByValue extends ActionView<LinkedList> {
  protected readonly definition = new SearchDefinition()
}
