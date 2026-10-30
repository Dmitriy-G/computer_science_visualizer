import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { BTree } from '../BTree.ts'
import { ClearAnimation } from './ClearAnimation.ts'
import './Clear.css'

class ClearDefinition implements ActionDefinition<BTree> {
  public readonly title = 'Clear'
  public readonly context = 'B-Tree / clear'
  public readonly summary = 'Release all nodes or pages after their children, without repeated balanced deletions.'
  public readonly phases = ['Inspect', 'Traverse', 'Release', 'Finalize', 'Finish']
  public readonly timelineHint = 'Unique keys / order 4'
  public readonly acceptsValue = false

  public create(model: BTree): ClearAnimation {
    return new ClearAnimation(model)
  }
}

export default class Clear extends ActionView<BTree> {
  protected readonly definition = new ClearDefinition()
}
