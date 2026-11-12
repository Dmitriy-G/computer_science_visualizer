import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { HashMap } from '../HashMap.ts'
import { ClearAnimation } from './ClearAnimation.ts'
import './Clear.css'

class ClearDefinition implements ActionDefinition<HashMap> {
  public readonly title = 'Clear'
  public readonly initialValue = 99

  public create(model: HashMap, value: number, storedValue?: number): ClearAnimation {
    return new ClearAnimation(model, value, storedValue)
  }
}

export default class Clear extends ActionView<HashMap> {
  protected readonly definition = new ClearDefinition()
}
