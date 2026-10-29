import ActionView from '../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../FixedArray.ts'
import { InsertionAnimation } from './InsertionAnimation.ts'
import './AddAtStart.css'

class InsertionDefinition implements ActionDefinition<FixedArray> {
  public readonly title = 'Insert at the start'
  public readonly context = 'Fixed array / insertion'
  public readonly summary = 'Allocate exactly one more slot. Insert at index 0, then copy the original elements after it.'
  public readonly phases = ['Locate', 'Allocate', 'Prefix', 'Insert', 'Suffix', 'Replace', 'Finish']
  public readonly timelineHint = 'Copy into a new fixed array'
  public create(model: FixedArray, value: number): InsertionAnimation { return new InsertionAnimation(model, value) }
}

export default class AddAtStart extends ActionView<FixedArray> {
  protected readonly definition = new InsertionDefinition()
}
