import { Component, createRef } from 'react'
import ActionPlayback from '../../../ActionPlayback/ActionPlayback.tsx'
import type { ActionDefinition } from '../../../../visualization/ActionDefinition.ts'
import type { Scene } from '../../../../visualization/Scene.ts'
import { LinkedList } from '../LinkedList.ts'
import { InsertionAnimation } from './InsertionAnimation.ts'
import './AddInTheMiddle.css'

interface AddInTheMiddleProps {
  readonly list: LinkedList
  readonly onSceneChange: (scene: Scene, list: LinkedList) => void
}

class LinkedListInsertionDefinition implements ActionDefinition<LinkedList> {
  public readonly title = 'Insert in the middle'
  public readonly context = 'Linked list / insertion'
  public readonly summary = 'Follow the pointers. See every connection.'
  public readonly phases = [
    'Start',
    'Traverse',
    'Middle',
    'Create',
    'Make space',
    'Insert',
    'Connect',
  ]
  public readonly timelineHint = 'O(n) traversal · O(1) pointer update'

  public create(list: LinkedList, value: number): InsertionAnimation {
    return new InsertionAnimation(list, value)
  }
}

export default class AddInTheMiddle extends Component<
  AddInTheMiddleProps,
  Record<string, never>
> {
  private readonly definition = new LinkedListInsertionDefinition()
  private readonly player = createRef<ActionPlayback<LinkedList>>()

  public pausePlayback(): void {
    this.player.current?.pausePlayback()
  }

  public render() {
    return (
      <div className="linked-list-middle-insertion">
        <ActionPlayback<LinkedList>
          ref={this.player}
          model={this.props.list}
          definition={this.definition}
          onSceneChange={this.props.onSceneChange}
        />
      </div>
    )
  }
}
