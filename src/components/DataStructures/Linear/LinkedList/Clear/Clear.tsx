import ActionView from '../../../../ActionPlayback/ActionView.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import { LinkedList } from '../LinkedList.ts'
import { ClearAnimation } from './ClearAnimation.ts'
import './Clear.css'

class ClearDefinition implements ActionDefinition<LinkedList> {
  public readonly title = 'Clear'
  public readonly context = 'LinkedList / clear'
  public readonly summary = 'Save each successor and release nodes from the head.'
  public readonly phases = ['Inspect', 'Save next', 'Release', 'Finish']
  public readonly timelineHint = 'Release nodes from head to tail'
  public readonly acceptsValue = false

  public create(model: LinkedList): ClearAnimation {
    return new ClearAnimation(model)
  }
}

export default class Clear extends ActionView<LinkedList> {
  protected readonly definition = new ClearDefinition()
}
