import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { Deque } from '../Deque.ts'
import { ClearAnimation } from './ClearAnimation.ts'
import './Clear.css'

class ClearDefinition implements ActionDefinition<Deque> {
  public readonly title = 'Clear'
  public readonly context = 'Deque / clear'
  public readonly summary = 'Release every node from front to back.'
  public readonly phases = ['Inspect', 'Release', 'Finish']
  public readonly timelineHint = 'Follow next and prev'
  public readonly acceptsValue = false

  public create(model: Deque, value: number): ClearAnimation {
    return new ClearAnimation(model)
  }
}

export default class Clear extends ActionView<Deque> {
  protected readonly definition = new ClearDefinition()
}
