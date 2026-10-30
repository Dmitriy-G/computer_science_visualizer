import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { Queue } from '../Queue.ts'
import { RemovalAnimation } from './RemovalAnimation.ts'
import './Dequeue.css'

class DequeueDefinition implements ActionDefinition<Queue> {
  public readonly title = 'Dequeue'
  public readonly context = 'Queue / dequeue'
  public readonly summary = 'Remove and return the front value.'
  public readonly phases = ['Inspect', 'Locate', 'Unlink', 'Finish']
  public readonly timelineHint = 'First in, first out'
  public readonly acceptsValue = false

  public create(model: Queue, value: number): RemovalAnimation {
    return new RemovalAnimation(model)
  }
}

export default class Dequeue extends ActionView<Queue> {
  protected readonly definition = new DequeueDefinition()
}
