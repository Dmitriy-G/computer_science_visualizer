import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { RedBlackTree } from '../RedBlackTree.ts'
import { InsertionAnimation } from './InsertionAnimation.ts'
import './Insert.css'

class InsertDefinition implements ActionDefinition<RedBlackTree> {
  public readonly title = 'Insert a key'
  public readonly context = 'Red-Black tree / insert a key'
  public readonly summary = 'Insert one unique key, then restore the tree rules.'
  public readonly phases = ['Inspect', 'Traverse', 'Modify', 'Repair', 'Finish']
  public readonly timelineHint = 'Unique keys / balanced search tree'
  public readonly acceptsValue = true
  public readonly inputLabel = 'Key to insert'
  public readonly initialValue = 99

  public create(model: RedBlackTree, value: number): InsertionAnimation {
    return new InsertionAnimation(model, value)
  }
}

export default class Insert extends ActionView<RedBlackTree> {
  protected readonly definition = new InsertDefinition()
}
