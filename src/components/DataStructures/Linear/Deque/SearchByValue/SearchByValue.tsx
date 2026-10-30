import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { Deque } from '../Deque.ts'
import { SearchAnimation } from './SearchAnimation.ts'
import './SearchByValue.css'

class SearchByValueDefinition implements ActionDefinition<Deque> {
  public readonly title = 'Search by value'
  public readonly context = 'Deque / search by value'
  public readonly summary = 'Find the first match from the front without changing order.'
  public readonly phases = ['Inspect', 'Compare', 'Finish']
  public readonly timelineHint = 'Follow next and prev'
  public readonly acceptsValue = true
  public readonly inputLabel = 'Value to find'
  public readonly initialValue = 50

  public create(model: Deque, value: number): SearchAnimation {
    return new SearchAnimation(model, value)
  }
}

export default class SearchByValue extends ActionView<Deque> {
  protected readonly definition = new SearchByValueDefinition()
}
