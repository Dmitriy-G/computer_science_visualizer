import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { Deque } from '../Deque.ts'
import { RemovalAnimation } from './RemovalAnimation.ts'
import './PopFront.css'

class PopFrontDefinition implements ActionDefinition<Deque> {
  public readonly title = 'Pop front'

  public create(model: Deque, value: number): RemovalAnimation {
    return new RemovalAnimation(model)
  }
}

export default class PopFront extends ActionView<Deque> {
  protected readonly definition = new PopFrontDefinition()
}
