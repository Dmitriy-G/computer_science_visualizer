import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { BTree } from '../BTree.ts'
import { InsertionAnimation } from './InsertionAnimation.ts'
import './Insert.css'

class InsertDefinition implements ActionDefinition<BTree> {
  public readonly title = 'Insert a key'
  public readonly context = 'B-Tree / insert a key'
  public readonly summary = 'Insert one unique key, then restore the tree rules.'
  public readonly phases = ['Inspect', 'Traverse', 'Modify', 'Repair', 'Finish']
  public readonly timelineHint = 'Unique keys / order 4'
  public readonly acceptsValue = true
  public readonly inputLabel = 'Key to insert'
  public readonly initialValue = 99

  public create(model: BTree, value: number): InsertionAnimation {
    return new InsertionAnimation(model, value)
  }
}

export default class Insert extends ActionView<BTree> {
  protected readonly definition = new InsertDefinition()
}
