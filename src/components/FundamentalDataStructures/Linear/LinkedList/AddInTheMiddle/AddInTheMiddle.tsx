import { Component } from 'react'
import ActionPlayback from '../../../../ActionPlayback/ActionPlayback.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import type { Scene } from '../../../../../visualization/Scene.ts'
import { LinkedList } from '../LinkedList.ts'
import { InsertionAnimation } from './InsertionAnimation.ts'
import './AddInTheMiddle.css'

interface AddInTheMiddleProps {
  readonly list: LinkedList
  readonly value?: number
  readonly onSceneChange: (scene: Scene, list: LinkedList) => void
  readonly onComplete?: () => void
}

class LinkedListInsertionDefinition implements ActionDefinition<LinkedList> {
  public readonly title = 'Insert in the middle'

  public create(list: LinkedList, value: number): InsertionAnimation {
    return new InsertionAnimation(list, value)
  }
}

export default class AddInTheMiddle extends Component<
  AddInTheMiddleProps,
  Record<string, never>
> {
  private readonly definition = new LinkedListInsertionDefinition()

  public render() {
    return (
      <div className="linked-list-middle-insertion">
        <ActionPlayback<LinkedList>
          model={this.props.list}
          definition={this.definition}
          value={this.props.value}
          onSceneChange={this.props.onSceneChange}
          onComplete={this.props.onComplete}
        />
      </div>
    )
  }
}
