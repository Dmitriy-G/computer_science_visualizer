import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { RedBlackTree } from '../RedBlackTree.ts'
import { SearchAnimation } from './SearchAnimation.ts'
import './SearchByKey.css'

class SearchByKeyDefinition implements ActionDefinition<RedBlackTree> {
  public readonly title = 'Search by key'
  public readonly initialValue = 50

  public create(model: RedBlackTree, value: number): SearchAnimation {
    return new SearchAnimation(model, value)
  }
}

export default class SearchByKey extends ActionView<RedBlackTree> {
  protected readonly definition = new SearchByKeyDefinition()
}
