import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { BTree } from '../BTree.ts'
import { InsertionAnimation } from './InsertionAnimation.ts'
import './Insert.css'

class InsertDefinition implements ActionDefinition<BTree> {
  public readonly title = 'Insert a key'
  public readonly initialValue = 99

  public create(model: BTree, value: number): InsertionAnimation {
    return new InsertionAnimation(model, value)
  }
}

export default class Insert extends ActionView<BTree> {
  protected readonly definition = new InsertDefinition()
}
