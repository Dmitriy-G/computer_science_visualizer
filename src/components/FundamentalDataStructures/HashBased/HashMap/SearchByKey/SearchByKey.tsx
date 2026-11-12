import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { HashMap } from '../HashMap.ts'
import { SearchByKeyAnimation } from './SearchByKeyAnimation.ts'
import './SearchByKey.css'

class SearchByKeyDefinition implements ActionDefinition<HashMap> {
  public readonly title = 'Look up a key'
  public readonly initialValue = 99

  public create(model: HashMap, value: number, storedValue?: number): SearchByKeyAnimation {
    return new SearchByKeyAnimation(model, value, storedValue)
  }
}

export default class SearchByKey extends ActionView<HashMap> {
  protected readonly definition = new SearchByKeyDefinition()
}
