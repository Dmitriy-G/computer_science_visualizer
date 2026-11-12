import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { BinaryTree } from '../BinaryTree.ts'
import { SearchAnimation } from './SearchAnimation.ts'
import './SearchByKey.css'

class SearchDefinition implements ActionDefinition<BinaryTree> {
  public readonly title = 'Search by key'
  public readonly initialValue = 70

  public create(model: BinaryTree, value: number): SearchAnimation { return new SearchAnimation(model, value) }
}

export default class SearchByKey extends ActionView<BinaryTree> {
  protected readonly definition = new SearchDefinition()
}
