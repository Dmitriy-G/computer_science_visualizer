import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { Deque } from '../Deque.ts'
import { RemovalAnimation } from './RemovalAnimation.ts'
import './PopBack.css'

class PopBackDefinition implements ActionDefinition<Deque> {
  public readonly title = 'Pop back'
  public readonly context = 'Deque / pop back'
  public readonly summary = 'Remove and return the back value.'
  public readonly phases = ['Inspect', 'Locate', 'Unlink', 'Finish']
  public readonly timelineHint = 'Follow next and prev'
  public readonly acceptsValue = false

  public create(model: Deque, value: number): RemovalAnimation {
    return new RemovalAnimation(model)
  }
}

export default class PopBack extends ActionView<Deque> {
  protected readonly definition = new PopBackDefinition()
}
