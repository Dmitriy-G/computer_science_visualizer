import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { RedBlackTree } from '../RedBlackTree.ts'
import { SearchAnimation } from './SearchAnimation.ts'
import './SearchByValue.css'

class SearchByValueDefinition implements ActionDefinition<RedBlackTree> {
  public readonly title = 'Search by value'
  public readonly context = 'Red-Black tree / search by value'
  public readonly summary = 'Follow ordered comparisons to a matching key without changing the tree.'
  public readonly phases = ['Inspect', 'Traverse', 'Modify', 'Repair', 'Finish']
  public readonly timelineHint = 'Unique keys / balanced search tree'
  public readonly acceptsValue = true
  public readonly inputLabel = 'Key to find'
  public readonly initialValue = 50

  public create(model: RedBlackTree, value: number): SearchAnimation {
    return new SearchAnimation(model, value)
  }
}

export default class SearchByValue extends ActionView<RedBlackTree> {
  protected readonly definition = new SearchByValueDefinition()
}
