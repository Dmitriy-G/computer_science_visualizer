import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { BTree } from '../BTree.ts'
import { DeletionAnimation } from './DeletionAnimation.ts'
import './DeleteByKey.css'

class DeleteByKeyDefinition implements ActionDefinition<BTree> {
  public readonly title = 'Delete a key'
  public readonly context = 'B-Tree / delete by key'
  public readonly summary = 'Remove one key and restore the tree rules; missing keys leave the tree unchanged.'
  public readonly phases = ['Inspect', 'Traverse', 'Modify', 'Repair', 'Finish']
  public readonly timelineHint = 'Unique keys / order 4'
  public readonly acceptsValue = true
  public readonly inputLabel = 'Key to delete'
  public readonly initialValue = 50

  public create(model: BTree, value: number): DeletionAnimation {
    return new DeletionAnimation(model, value)
  }
}

export default class DeleteByKey extends ActionView<BTree> {
  protected readonly definition = new DeleteByKeyDefinition()
}
