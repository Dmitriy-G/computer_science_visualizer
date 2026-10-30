import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { Stack } from '../Stack.ts'
import { ClearAnimation } from './ClearAnimation.ts'
import './Clear.css'

class ClearDefinition implements ActionDefinition<Stack> {
  public readonly title = 'Clear'
  public readonly context = 'Stack / clear'
  public readonly summary = 'Remove every value from top to bottom.'
  public readonly phases = ['Start', 'Remove', 'Finish']
  public readonly timelineHint = 'O(n) removal of all elements'
  public readonly acceptsValue = false

  public create(model: Stack): ClearAnimation {
    return new ClearAnimation(model)
  }
}

export default class Clear extends ActionView<Stack> {
  protected readonly definition = new ClearDefinition()
}
