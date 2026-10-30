import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { AVLTree } from '../AVLTree.ts'
import { InsertionAnimation } from './InsertionAnimation.ts'
import './Insert.css'

class InsertDefinition implements ActionDefinition<AVLTree> {
  public readonly title = 'Insert a key'
  public readonly context = 'AVL tree / insert a key'
  public readonly summary = 'Insert one unique key, then restore the tree rules.'
  public readonly phases = ['Inspect', 'Traverse', 'Modify', 'Repair', 'Finish']
  public readonly timelineHint = 'Unique keys / balanced search tree'
  public readonly acceptsValue = true
  public readonly inputLabel = 'Key to insert'
  public readonly initialValue = 99

  public create(model: AVLTree, value: number): InsertionAnimation {
    return new InsertionAnimation(model, value)
  }
}

export default class Insert extends ActionView<AVLTree> {
  protected readonly definition = new InsertDefinition()
}
