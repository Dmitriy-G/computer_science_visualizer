import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { AVLTree } from '../AVLTree.ts'
import { DeletionAnimation } from './DeletionAnimation.ts'
import './DeleteByKey.css'

class DeleteByKeyDefinition implements ActionDefinition<AVLTree> {
  public readonly title = 'Delete a key'
  public readonly initialValue = 50

  public create(model: AVLTree, value: number): DeletionAnimation {
    return new DeletionAnimation(model, value)
  }
}

export default class DeleteByKey extends ActionView<AVLTree> {
  protected readonly definition = new DeleteByKeyDefinition()
}
