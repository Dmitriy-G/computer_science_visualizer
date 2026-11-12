import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { CircularBuffer } from '../CircularBuffer.ts'
import { SearchAnimation } from './SearchAnimation.ts'
import './SearchByValue.css'

class SearchByValueDefinition implements ActionDefinition<CircularBuffer> {
  public readonly title = 'Search by value'
  public readonly initialValue = 50

  public create(model: CircularBuffer, value: number): SearchAnimation {
    return new SearchAnimation(model, value)
  }
}

export default class SearchByValue extends ActionView<CircularBuffer> {
  protected readonly definition = new SearchByValueDefinition()
}
