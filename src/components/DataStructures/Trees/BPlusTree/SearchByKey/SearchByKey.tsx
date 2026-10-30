import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { BPlusTree } from '../BPlusTree.ts'
import { SearchAnimation } from './SearchAnimation.ts'
import './SearchByKey.css'

class SearchByKeyDefinition implements ActionDefinition<BPlusTree> {
  public readonly title = 'Search by key'
  public readonly context = 'B+ Tree / search by key'
  public readonly summary = 'Follow ordered comparisons to a matching key without changing the tree.'
  public readonly phases = ['Inspect', 'Traverse', 'Modify', 'Repair', 'Finish']
  public readonly timelineHint = 'Unique keys / order 4'
  public readonly acceptsValue = true
  public readonly inputLabel = 'Key to find'
  public readonly initialValue = 50

  public create(model: BPlusTree, value: number): SearchAnimation {
    return new SearchAnimation(model, value)
  }
}

export default class SearchByKey extends ActionView<BPlusTree> {
  protected readonly definition = new SearchByKeyDefinition()
}
