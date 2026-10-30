import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { Deque } from '../Deque.ts'
import { RemovalAnimation } from './RemovalAnimation.ts'
import './PopFront.css'

class PopFrontDefinition implements ActionDefinition<Deque> {
  public readonly title = 'Pop front'
  public readonly context = 'Deque / pop front'
  public readonly summary = 'Remove and return the front value.'
  public readonly phases = ['Inspect', 'Locate', 'Unlink', 'Finish']
  public readonly timelineHint = 'Follow next and prev'
  public readonly acceptsValue = false

  public create(model: Deque, value: number): RemovalAnimation {
    return new RemovalAnimation(model)
  }
}

export default class PopFront extends ActionView<Deque> {
  protected readonly definition = new PopFrontDefinition()
}
