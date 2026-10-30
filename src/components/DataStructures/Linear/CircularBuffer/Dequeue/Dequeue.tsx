import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { CircularBuffer } from '../CircularBuffer.ts'
import { DequeueAnimation } from './DequeueAnimation.ts'
import './Dequeue.css'

class DequeueDefinition implements ActionDefinition<CircularBuffer> {
  public readonly title = 'Dequeue'
  public readonly context = 'Circular buffer / dequeue'
  public readonly summary = 'Read and release the oldest slot, then advance read.'
  public readonly phases = ['Inspect', 'Read', 'Release', 'Advance', 'Finish']
  public readonly timelineHint = 'Fixed capacity / FIFO order'
  public readonly acceptsValue = false

  public create(model: CircularBuffer, value: number): DequeueAnimation {
    return new DequeueAnimation(model)
  }
}

export default class Dequeue extends ActionView<CircularBuffer> {
  protected readonly definition = new DequeueDefinition()
}
