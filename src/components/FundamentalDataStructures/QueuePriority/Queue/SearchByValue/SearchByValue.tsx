import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { Queue } from '../Queue.ts'
import { SearchAnimation } from './SearchAnimation.ts'
import './SearchByValue.css'

class SearchByValueDefinition implements ActionDefinition<Queue> {
  public readonly title = 'Search by value'
  public readonly initialValue = 50

  public create(model: Queue, value: number): SearchAnimation {
    return new SearchAnimation(model, value)
  }
}

export default class SearchByValue extends ActionView<Queue> {
  protected readonly definition = new SearchByValueDefinition()
}
