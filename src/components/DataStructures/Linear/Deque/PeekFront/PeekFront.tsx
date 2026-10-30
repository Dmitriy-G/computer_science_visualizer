import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { Deque } from '../Deque.ts'
import { PeekAnimation } from './PeekAnimation.ts'
import './PeekFront.css'

class PeekFrontDefinition implements ActionDefinition<Deque> {
  public readonly title = 'Peek front'
  public readonly context = 'Deque / peek front'
  public readonly summary = 'Read the front without removing it.'
  public readonly phases = ['Inspect', 'Read', 'Finish']
  public readonly timelineHint = 'Follow next and prev'
  public readonly acceptsValue = false

  public create(model: Deque, value: number): PeekAnimation {
    return new PeekAnimation(model)
  }
}

export default class PeekFront extends ActionView<Deque> {
  protected readonly definition = new PeekFrontDefinition()
}
