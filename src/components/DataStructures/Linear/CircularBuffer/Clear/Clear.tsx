import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { CircularBuffer } from '../CircularBuffer.ts'
import { ClearAnimation } from './ClearAnimation.ts'
import './Clear.css'

class ClearDefinition implements ActionDefinition<CircularBuffer> {
  public readonly title = 'Clear'
  public readonly context = 'Circular buffer / clear'
  public readonly summary = 'Release occupied slots in FIFO order.'
  public readonly phases = ['Inspect', 'Release', 'Finish']
  public readonly timelineHint = 'Fixed capacity / FIFO order'
  public readonly acceptsValue = false

  public create(model: CircularBuffer, value: number): ClearAnimation {
    return new ClearAnimation(model)
  }
}

export default class Clear extends ActionView<CircularBuffer> {
  protected readonly definition = new ClearDefinition()
}
