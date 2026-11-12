import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { Queue } from '../Queue.ts'
import { RemovalAnimation } from './RemovalAnimation.ts'
import './Dequeue.css'

class DequeueDefinition implements ActionDefinition<Queue> {
  public readonly title = 'Dequeue'

  public create(model: Queue, value: number): RemovalAnimation {
    return new RemovalAnimation(model)
  }
}

export default class Dequeue extends ActionView<Queue> {
  protected readonly definition = new DequeueDefinition()
}
