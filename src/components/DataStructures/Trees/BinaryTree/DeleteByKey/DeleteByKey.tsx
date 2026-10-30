import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { BinaryTree } from '../BinaryTree.ts'
import { DeletionAnimation } from './DeletionAnimation.ts'
import './DeleteByKey.css'

class DeletionDefinition implements ActionDefinition<BinaryTree> {
  public readonly title = 'Delete a key'
  public readonly context = 'Binary search tree / deletion'
  public readonly summary = 'Find and delete the matching key. A missing key leaves the tree unchanged.'
  public readonly phases = ['Start', 'Search', 'Locate', 'Disconnect', 'Reconnect / remove', 'Finish']
  public readonly timelineHint = 'Commit only at the final step'
  public readonly inputLabel = 'Key to delete'
  public readonly initialValue = 50
  public create(model: BinaryTree, value: number): DeletionAnimation { return new DeletionAnimation(model, value) }
}

export default class DeleteByKey extends ActionView<BinaryTree> {
  protected readonly definition = new DeletionDefinition()
}
