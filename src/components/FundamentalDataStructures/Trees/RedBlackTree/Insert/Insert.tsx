import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { RedBlackTree } from '../RedBlackTree.ts'
import { InsertionAnimation } from './InsertionAnimation.ts'
import './Insert.css'

class InsertDefinition implements ActionDefinition<RedBlackTree> {
  public readonly title = 'Insert a key'
  public readonly initialValue = 99

  public create(model: RedBlackTree, value: number): InsertionAnimation {
    return new InsertionAnimation(model, value)
  }
}

export default class Insert extends ActionView<RedBlackTree> {
  protected readonly definition = new InsertDefinition()
}
