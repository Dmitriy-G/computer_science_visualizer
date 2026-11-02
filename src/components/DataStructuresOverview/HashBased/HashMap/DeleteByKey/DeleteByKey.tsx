import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { HashMap } from '../HashMap.ts'
import { DeleteByKeyAnimation } from './DeleteByKeyAnimation.ts'
import './DeleteByKey.css'

class DeleteByKeyDefinition implements ActionDefinition<HashMap> {
  public readonly title = 'Delete a key'
  public readonly context = 'HashMap / Delete a key'
  public readonly summary = 'Delete a key using deterministic hash probes.'
  public readonly phases = ['Start', 'Hash', 'Access storage', 'Finish']
  public readonly timelineHint = 'Follow each hash and storage access'
  public readonly initialValue = 99

  public create(model: HashMap, value: number, storedValue?: number): DeleteByKeyAnimation {
    return new DeleteByKeyAnimation(model, value, storedValue)
  }
}

export default class DeleteByKey extends ActionView<HashMap> {
  protected readonly definition = new DeleteByKeyDefinition()
}
