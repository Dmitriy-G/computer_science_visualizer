import ActionView from '../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../visualization/ActionDefinition.ts'
import { BinaryTree } from '../BinaryTree.ts'
import { SearchAnimation } from './SearchAnimation.ts'
import './SearchByValue.css'

class SearchDefinition implements ActionDefinition<BinaryTree> {
  public readonly title = 'Search by value'
  public readonly context = 'Binary search tree / search'
  public readonly summary = 'Compare along the ordered search path.'
  public readonly phases = ['Start', 'Examine', 'Result', 'Finish']
  public readonly timelineHint = 'Follow the highlighted search path'
  public readonly inputLabel = 'Value to find'
  public readonly initialValue = 70

  public create(model: BinaryTree, value: number): SearchAnimation { return new SearchAnimation(model, value) }
}

export default class SearchByValue extends ActionView<BinaryTree> {
  protected readonly definition = new SearchDefinition()
}
