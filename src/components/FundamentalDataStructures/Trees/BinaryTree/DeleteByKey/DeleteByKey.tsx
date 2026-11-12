import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { BinaryTree } from '../BinaryTree.ts'
import { DeletionAnimation } from './DeletionAnimation.ts'
import './DeleteByKey.css'

class DeletionDefinition implements ActionDefinition<BinaryTree> {
  public readonly title = 'Delete a key'
  public readonly initialValue = 50
  public create(model: BinaryTree, value: number): DeletionAnimation { return new DeletionAnimation(model, value) }
}

export default class DeleteByKey extends ActionView<BinaryTree> {
  protected readonly definition = new DeletionDefinition()
}
