import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { RedBlackTree } from '../RedBlackTree.ts'
import { DeletionAnimation } from './DeletionAnimation.ts'
import './DeleteByKey.css'

class DeleteByKeyDefinition implements ActionDefinition<RedBlackTree> {
  public readonly title = 'Delete a key'
  public readonly initialValue = 50

  public create(model: RedBlackTree, value: number): DeletionAnimation {
    return new DeletionAnimation(model, value)
  }
}

export default class DeleteByKey extends ActionView<RedBlackTree> {
  protected readonly definition = new DeleteByKeyDefinition()
}
