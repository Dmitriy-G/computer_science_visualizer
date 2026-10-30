import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../FixedArray.ts'
import { ClearAnimation } from './ClearAnimation.ts'
import './Clear.css'

class ClearDefinition implements ActionDefinition<FixedArray> {
  public readonly title = 'Clear'
  public readonly context = 'Array / clear'
  public readonly summary = 'Replace the selected fixed array with an empty array.'
  public readonly phases = ['Inspect', 'Allocate', 'Replace', 'Finish']
  public readonly timelineHint = 'Empty result; original allocation unchanged'
  public readonly acceptsValue = false

  public create(model: FixedArray): ClearAnimation {
    return new ClearAnimation(model)
  }
}

export default class Clear extends ActionView<FixedArray> {
  protected readonly definition = new ClearDefinition()
}
