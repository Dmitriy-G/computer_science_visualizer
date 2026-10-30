import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { Deque } from '../Deque.ts'
import { InsertionAnimation } from './InsertionAnimation.ts'
import './PushFront.css'

class PushFrontDefinition implements ActionDefinition<Deque> {
  public readonly title = 'Push front'
  public readonly context = 'Deque / push front'
  public readonly summary = 'Add a value before the front.'
  public readonly phases = ['Inspect', 'Locate', 'Create', 'Place', 'Connect', 'Finish']
  public readonly timelineHint = 'Follow next and prev'
  public readonly acceptsValue = true
  public readonly inputLabel = 'Value to insert'
  public readonly initialValue = 99

  public create(model: Deque, value: number): InsertionAnimation {
    return new InsertionAnimation(model, value)
  }
}

export default class PushFront extends ActionView<Deque> {
  protected readonly definition = new PushFrontDefinition()
}
