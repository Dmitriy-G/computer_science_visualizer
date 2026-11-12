import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { AVLTree } from '../AVLTree.ts'
import { InsertionAnimation } from './InsertionAnimation.ts'
import './Insert.css'

class InsertDefinition implements ActionDefinition<AVLTree> {
  public readonly title = 'Insert a key'
  public readonly initialValue = 99

  public create(model: AVLTree, value: number): InsertionAnimation {
    return new InsertionAnimation(model, value)
  }
}

export default class Insert extends ActionView<AVLTree> {
  protected readonly definition = new InsertDefinition()
}
