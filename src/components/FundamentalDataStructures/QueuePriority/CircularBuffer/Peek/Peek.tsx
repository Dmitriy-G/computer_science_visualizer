import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { CircularBuffer } from '../CircularBuffer.ts'
import { PeekAnimation } from './PeekAnimation.ts'
import './Peek.css'

class PeekDefinition implements ActionDefinition<CircularBuffer> {
  public readonly title = 'Peek (oldest)'
  public readonly context = 'Circular buffer / peek (oldest)'
  public readonly summary = 'Read the oldest value without advancing read.'
  public readonly phases = ['Inspect', 'Read', 'Finish']
  public readonly timelineHint = 'Fixed capacity / FIFO order'
  public readonly acceptsValue = false

  public create(model: CircularBuffer, value: number): PeekAnimation {
    return new PeekAnimation(model)
  }
}

export default class Peek extends ActionView<CircularBuffer> {
  protected readonly definition = new PeekDefinition()
}
