import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { Queue } from '../Queue.ts'
import { SearchAnimation } from './SearchAnimation.ts'
import './SearchByValue.css'

class SearchByValueDefinition implements ActionDefinition<Queue> {
  public readonly title = 'Search by value'
  public readonly context = 'Queue / search by value'
  public readonly summary = 'Find the first match from the front without changing order.'
  public readonly phases = ['Inspect', 'Compare', 'Finish']
  public readonly timelineHint = 'First in, first out'
  public readonly acceptsValue = true
  public readonly inputLabel = 'Value to find'
  public readonly initialValue = 50

  public create(model: Queue, value: number): SearchAnimation {
    return new SearchAnimation(model, value)
  }
}

export default class SearchByValue extends ActionView<Queue> {
  protected readonly definition = new SearchByValueDefinition()
}
