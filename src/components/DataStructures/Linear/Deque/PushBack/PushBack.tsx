import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { Deque } from '../Deque.ts'
import { InsertionAnimation } from './InsertionAnimation.ts'
import './PushBack.css'

class PushBackDefinition implements ActionDefinition<Deque> {
  public readonly title = 'Push back'
  public readonly context = 'Deque / push back'
  public readonly summary = 'Add a value after the back.'
  public readonly phases = ['Inspect', 'Locate', 'Create', 'Place', 'Connect', 'Finish']
  public readonly timelineHint = 'Follow next and prev'
  public readonly acceptsValue = true
  public readonly inputLabel = 'Value to insert'
  public readonly initialValue = 99

  public create(model: Deque, value: number): InsertionAnimation {
    return new InsertionAnimation(model, value)
  }
}

export default class PushBack extends ActionView<Deque> {
  protected readonly definition = new PushBackDefinition()
}
