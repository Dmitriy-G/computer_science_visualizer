import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { Deque } from '../Deque.ts'
import { RemovalAnimation } from './RemovalAnimation.ts'
import './PopBack.css'

class PopBackDefinition implements ActionDefinition<Deque> {
  public readonly title = 'Pop back'

  public create(model: Deque, value: number): RemovalAnimation {
    return new RemovalAnimation(model)
  }
}

export default class PopBack extends ActionView<Deque> {
  protected readonly definition = new PopBackDefinition()
}
