import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { Deque } from '../Deque.ts'
import { PeekAnimation } from './PeekAnimation.ts'
import './PeekBack.css'

class PeekBackDefinition implements ActionDefinition<Deque> {
  public readonly title = 'Peek back'

  public create(model: Deque, value: number): PeekAnimation {
    return new PeekAnimation(model)
  }
}

export default class PeekBack extends ActionView<Deque> {
  protected readonly definition = new PeekBackDefinition()
}
