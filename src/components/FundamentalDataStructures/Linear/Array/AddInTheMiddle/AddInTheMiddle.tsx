import { Component } from 'react'
import ActionPlayback from '../../../../ActionPlayback/ActionPlayback.tsx'
import type { ActionDefinition } from '../../../../../visualization/ActionDefinition.ts'
import type { Scene } from '../../../../../visualization/Scene.ts'
import { FixedArray } from '../FixedArray.ts'
import { InsertionAnimation } from './InsertionAnimation.ts'
import './AddInTheMiddle.css'

interface AddInTheMiddleProps {
  readonly array: FixedArray
  readonly value?: number
  readonly onSceneChange: (scene: Scene, array: FixedArray) => void
  readonly onComplete?: () => void
}

class ArrayInsertionDefinition implements ActionDefinition<FixedArray> {
  public readonly title = 'Insert in the middle'

  public create(array: FixedArray, value: number): InsertionAnimation {
    return new InsertionAnimation(array, value)
  }
}

export default class AddInTheMiddle extends Component<
  AddInTheMiddleProps,
  Record<string, never>
> {
  private readonly definition = new ArrayInsertionDefinition()

  public render() {
    return (
      <div className="array-middle-insertion">
        <ActionPlayback<FixedArray>
          model={this.props.array}
          definition={this.definition}
          value={this.props.value}
          onSceneChange={this.props.onSceneChange}
          onComplete={this.props.onComplete}
        />
      </div>
    )
  }
}
