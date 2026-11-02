import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../FixedArray.ts'
import { DeletionAnimation } from './DeletionAnimation.ts'
import './DeleteByValue.css'

class DeletionDefinition implements ActionDefinition<FixedArray> {
  public readonly title = 'Delete by value'
  public readonly context = 'Fixed array / deletion'
  public readonly summary = 'Find and delete the first matching value. A missing value leaves the structure unchanged.'
  public readonly phases = ['Start', 'Search', 'Locate', 'Allocate', 'Copy', 'Finish']
  public readonly timelineHint = 'Commit only at the final step'
  public readonly inputLabel = 'Value to delete'
  public readonly initialValue = 50
  public create(model: FixedArray, value: number): DeletionAnimation { return new DeletionAnimation(model, value) }
}

export default class DeleteByValue extends ActionView<FixedArray> {
  protected readonly definition = new DeletionDefinition()
}
