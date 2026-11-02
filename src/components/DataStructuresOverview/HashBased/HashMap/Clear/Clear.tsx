import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { HashMap } from '../HashMap.ts'
import { ClearAnimation } from './ClearAnimation.ts'
import './Clear.css'

class ClearDefinition implements ActionDefinition<HashMap> {
  public readonly title = 'Clear'
  public readonly context = 'HashMap / Clear'
  public readonly summary = 'Clear using deterministic hash probes.'
  public readonly phases = ['Start', 'Hash', 'Access storage', 'Finish']
  public readonly timelineHint = 'Follow each hash and storage access'
  public readonly initialValue = 99

  public create(model: HashMap, value: number, storedValue?: number): ClearAnimation {
    return new ClearAnimation(model, value, storedValue)
  }
}

export default class Clear extends ActionView<HashMap> {
  protected readonly definition = new ClearDefinition()
}
