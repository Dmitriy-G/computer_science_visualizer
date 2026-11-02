import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { CircularBuffer } from '../CircularBuffer.ts'
import { EnqueueAnimation } from './EnqueueAnimation.ts'
import './Enqueue.css'

class EnqueueDefinition implements ActionDefinition<CircularBuffer> {
  public readonly title = 'Enqueue'
  public readonly context = 'Circular buffer / enqueue'
  public readonly summary = 'Write into the next free slot; reject when full.'
  public readonly phases = ['Inspect', 'Prepare', 'Write', 'Advance', 'Finish']
  public readonly timelineHint = 'Fixed capacity / FIFO order'
  public readonly acceptsValue = true
  public readonly inputLabel = 'Value to insert'
  public readonly initialValue = 99

  public create(model: CircularBuffer, value: number): EnqueueAnimation {
    return new EnqueueAnimation(model, value)
  }
}

export default class Enqueue extends ActionView<CircularBuffer> {
  protected readonly definition = new EnqueueDefinition()
}
