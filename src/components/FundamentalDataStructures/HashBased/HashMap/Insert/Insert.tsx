import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { HashMap } from '../HashMap.ts'
import { InsertAnimation } from './InsertAnimation.ts'
import './Insert.css'

class InsertDefinition implements ActionDefinition<HashMap> {
  public readonly title = 'Insert / update'
  public readonly initialValue = 99

  public create(model: HashMap, value: number, storedValue?: number): InsertAnimation {
    return new InsertAnimation(model, value, storedValue)
  }
}

export default class Insert extends ActionView<HashMap> {
  protected readonly definition = new InsertDefinition()
}
