import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { AVLTree } from '../AVLTree.ts'
import { SearchAnimation } from './SearchAnimation.ts'
import './SearchByKey.css'

class SearchByKeyDefinition implements ActionDefinition<AVLTree> {
  public readonly title = 'Search by key'
  public readonly initialValue = 50

  public create(model: AVLTree, value: number): SearchAnimation {
    return new SearchAnimation(model, value)
  }
}

export default class SearchByKey extends ActionView<AVLTree> {
  protected readonly definition = new SearchByKeyDefinition()
}
