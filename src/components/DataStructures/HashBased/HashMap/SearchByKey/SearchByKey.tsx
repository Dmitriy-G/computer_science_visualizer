import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { HashMap } from '../HashMap.ts'
import { SearchByKeyAnimation } from './SearchByKeyAnimation.ts'
import './SearchByKey.css'

class SearchByKeyDefinition implements ActionDefinition<HashMap> {
  public readonly title = 'Look up a key'
  public readonly context = 'HashMap / Look up a key'
  public readonly summary = 'Look up a key using deterministic hash probes.'
  public readonly phases = ['Start', 'Hash', 'Access storage', 'Finish']
  public readonly timelineHint = 'Follow each hash and storage access'
  public readonly initialValue = 99

  public create(model: HashMap, value: number, storedValue?: number): SearchByKeyAnimation {
    return new SearchByKeyAnimation(model, value, storedValue)
  }
}

export default class SearchByKey extends ActionView<HashMap> {
  protected readonly definition = new SearchByKeyDefinition()
}
