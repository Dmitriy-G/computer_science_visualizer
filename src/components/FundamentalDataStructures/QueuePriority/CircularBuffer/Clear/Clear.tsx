import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { CircularBuffer } from '../CircularBuffer.ts'
import { ClearAnimation } from './ClearAnimation.ts'
import './Clear.css'

class ClearDefinition implements ActionDefinition<CircularBuffer> {
  public readonly title = 'Clear'

  public create(model: CircularBuffer, value: number): ClearAnimation {
    return new ClearAnimation(model)
  }
}

export default class Clear extends ActionView<CircularBuffer> {
  protected readonly definition = new ClearDefinition()
}
