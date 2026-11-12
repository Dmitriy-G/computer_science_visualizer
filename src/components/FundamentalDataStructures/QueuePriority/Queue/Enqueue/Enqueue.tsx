import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { Queue } from '../Queue.ts'
import { InsertionAnimation } from './InsertionAnimation.ts'
import './Enqueue.css'

class EnqueueDefinition implements ActionDefinition<Queue> {
  public readonly title = 'Enqueue'
  public readonly initialValue = 99

  public create(model: Queue, value: number): InsertionAnimation {
    return new InsertionAnimation(model, value)
  }
}

export default class Enqueue extends ActionView<Queue> {
  protected readonly definition = new EnqueueDefinition()
}
