import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { FixedArray } from '../FixedArray.ts'
import { InsertionAnimation } from './InsertionAnimation.ts'
import './AddAtEnd.css'

class InsertionDefinition implements ActionDefinition<FixedArray> {
  public readonly title = 'Insert at the end'
  public readonly context = 'Fixed array / insertion'
  public readonly summary = 'Allocate exactly one more slot. Copy the original elements, then append the new value.'
  public readonly phases = ['Locate', 'Allocate', 'Prefix', 'Insert', 'Suffix', 'Replace', 'Finish']
  public readonly timelineHint = 'Copy into a new fixed array'
  public create(model: FixedArray, value: number): InsertionAnimation { return new InsertionAnimation(model, value) }
}

export default class AddAtEnd extends ActionView<FixedArray> {
  protected readonly definition = new InsertionDefinition()
}
