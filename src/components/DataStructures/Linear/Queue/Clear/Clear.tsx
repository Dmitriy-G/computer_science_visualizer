import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { Queue } from '../Queue.ts'
import { ClearAnimation } from './ClearAnimation.ts'
import './Clear.css'

class ClearDefinition implements ActionDefinition<Queue> {
  public readonly title = 'Clear'
  public readonly context = 'Queue / clear'
  public readonly summary = 'Release all nodes from front to rear.'
  public readonly phases = ['Inspect', 'Release', 'Finish']
  public readonly timelineHint = 'First in, first out'
  public readonly acceptsValue = false

  public create(model: Queue, value: number): ClearAnimation {
    return new ClearAnimation(model)
  }
}

export default class Clear extends ActionView<Queue> {
  protected readonly definition = new ClearDefinition()
}
