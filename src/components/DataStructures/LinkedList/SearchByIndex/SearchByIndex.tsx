import ActionView from '../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../visualization/ActionDefinition.ts'
import { LinkedList } from '../LinkedList.ts'
import { SearchAnimation } from './SearchAnimation.ts'
import './SearchByIndex.css'

class SearchDefinition implements ActionDefinition<LinkedList> {
  public readonly title = 'Search by index'
  public readonly context = 'Linked list / search'
  public readonly summary = 'Follow next pointers to the requested zero-based index.'
  public readonly phases = ['Start', 'Examine', 'Result', 'Finish']
  public readonly timelineHint = 'Follow the highlighted search path'
  public readonly inputLabel = 'Index (zero-based)'
  public readonly initialValue = 4
  public readonly inputMinimum = 0
  public readonly inputMaximum = Number.MAX_SAFE_INTEGER

  public create(model: LinkedList, value: number): SearchAnimation { return new SearchAnimation(model, value) }
}

export default class SearchByIndex extends ActionView<LinkedList> {
  protected readonly definition = new SearchDefinition()
}
