import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { Queue } from '../Queue.ts'
import { PeekAnimation } from './PeekAnimation.ts'
import './Peek.css'

class PeekDefinition implements ActionDefinition<Queue> {
  public readonly title = 'Peek (front)'

  public create(model: Queue, value: number): PeekAnimation {
    return new PeekAnimation(model)
  }
}

export default class Peek extends ActionView<Queue> {
  protected readonly definition = new PeekDefinition()
}
