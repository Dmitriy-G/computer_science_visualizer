import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { BTree } from '../BTree.ts'
import { DeletionAnimation } from './DeletionAnimation.ts'
import './DeleteByKey.css'

class DeleteByKeyDefinition implements ActionDefinition<BTree> {
  public readonly title = 'Delete a key'
  public readonly initialValue = 50

  public create(model: BTree, value: number): DeletionAnimation {
    return new DeletionAnimation(model, value)
  }
}

export default class DeleteByKey extends ActionView<BTree> {
  protected readonly definition = new DeleteByKeyDefinition()
}
