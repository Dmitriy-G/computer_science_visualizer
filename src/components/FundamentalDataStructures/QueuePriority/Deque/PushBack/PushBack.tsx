import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { Deque } from '../Deque.ts'
import { InsertionAnimation } from './InsertionAnimation.ts'
import './PushBack.css'

class PushBackDefinition implements ActionDefinition<Deque> {
  public readonly title = 'Push back'
  public readonly initialValue = 99

  public create(model: Deque, value: number): InsertionAnimation {
    return new InsertionAnimation(model, value)
  }
}

export default class PushBack extends ActionView<Deque> {
  protected readonly definition = new PushBackDefinition()
}
