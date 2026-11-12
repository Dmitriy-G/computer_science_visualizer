import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { Deque } from '../Deque.ts'
import { SearchAnimation } from './SearchAnimation.ts'
import './SearchByValue.css'

class SearchByValueDefinition implements ActionDefinition<Deque> {
  public readonly title = 'Search by value'
  public readonly initialValue = 50

  public create(model: Deque, value: number): SearchAnimation {
    return new SearchAnimation(model, value)
  }
}

export default class SearchByValue extends ActionView<Deque> {
  protected readonly definition = new SearchByValueDefinition()
}
