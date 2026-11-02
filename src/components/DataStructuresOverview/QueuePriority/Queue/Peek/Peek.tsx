import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { Queue } from '../Queue.ts'
import { PeekAnimation } from './PeekAnimation.ts'
import './Peek.css'

class PeekDefinition implements ActionDefinition<Queue> {
  public readonly title = 'Peek (front)'
  public readonly context = 'Queue / peek (front)'
  public readonly summary = 'Read the front without removing it.'
  public readonly phases = ['Inspect', 'Read', 'Finish']
  public readonly timelineHint = 'First in, first out'
  public readonly acceptsValue = false

  public create(model: Queue, value: number): PeekAnimation {
    return new PeekAnimation(model)
  }
}

export default class Peek extends ActionView<Queue> {
  protected readonly definition = new PeekDefinition()
}
