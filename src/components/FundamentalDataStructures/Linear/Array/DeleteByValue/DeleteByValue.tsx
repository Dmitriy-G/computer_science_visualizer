import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../FixedArray.ts'
import { DeletionAnimation } from './DeletionAnimation.ts'
import './DeleteByValue.css'

class DeletionDefinition implements ActionDefinition<FixedArray> {
  public readonly title = 'Delete by value'
  public readonly initialValue = 50
  public create(model: FixedArray, value: number): DeletionAnimation { return new DeletionAnimation(model, value) }
}

export default class DeleteByValue extends ActionView<FixedArray> {
  protected readonly definition = new DeletionDefinition()
}
