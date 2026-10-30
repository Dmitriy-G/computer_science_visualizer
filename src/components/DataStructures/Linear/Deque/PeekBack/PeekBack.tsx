import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { Deque } from '../Deque.ts'
import { PeekAnimation } from './PeekAnimation.ts'
import './PeekBack.css'

class PeekBackDefinition implements ActionDefinition<Deque> {
  public readonly title = 'Peek back'
  public readonly context = 'Deque / peek back'
  public readonly summary = 'Read the back without removing it.'
  public readonly phases = ['Inspect', 'Read', 'Finish']
  public readonly timelineHint = 'Follow next and prev'
  public readonly acceptsValue = false

  public create(model: Deque, value: number): PeekAnimation {
    return new PeekAnimation(model)
  }
}

export default class PeekBack extends ActionView<Deque> {
  protected readonly definition = new PeekBackDefinition()
}
