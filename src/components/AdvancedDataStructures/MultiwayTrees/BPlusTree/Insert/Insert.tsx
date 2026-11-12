import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { BPlusTree } from '../BPlusTree.ts'
import { InsertionAnimation } from './InsertionAnimation.ts'
import './Insert.css'

class InsertDefinition implements ActionDefinition<BPlusTree> {
  public readonly title = 'Insert a key'
  public readonly initialValue = 99

  public create(model: BPlusTree, value: number): InsertionAnimation {
    return new InsertionAnimation(model, value)
  }
}

export default class Insert extends ActionView<BPlusTree> {
  protected readonly definition = new InsertDefinition()
}
