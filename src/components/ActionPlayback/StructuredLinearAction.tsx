import { Component } from 'react'
import ActionPlayback from './ActionPlayback.tsx'
import type { LinearAnimation } from '../../visualization/LinearAnimation.ts'
import type { LinearInputValues, LinearModel } from '../../visualization/LinearModel.ts'
import type { ActionDefinition } from '../../visualization/ActionDefinition.ts'
import type { Scene } from '../../visualization/Scene.ts'

export interface StructuredLinearActionProps {
  readonly model: LinearModel
  readonly input?: LinearInputValues
  readonly onSceneChange: (scene: Scene, model: LinearModel) => void
  readonly onComplete?: () => void
}

export interface LinearSequenceConstructor {
  new(model: LinearModel, input: LinearInputValues): LinearAnimation
  readonly title: string
  readonly summary: string
  readonly pseudocode?: string
}

class LinearDefinition implements ActionDefinition<LinearModel> {
  public readonly title: string
  public readonly summary: string
  public readonly pseudocode?: string
  public readonly context = 'Linear structure operation'
  public readonly phases = ['Inspect', 'Traverse', 'Modify', 'Finish']
  public readonly timelineHint = 'Follow the current operation'
  private readonly sequence: LinearSequenceConstructor
  private readonly input: LinearInputValues

  constructor(sequence: LinearSequenceConstructor, input: LinearInputValues) {
    this.sequence = sequence
    this.input = input
    this.title = sequence.title
    this.summary = sequence.summary
    this.pseudocode = sequence.pseudocode
  }

  public create(model: LinearModel): LinearAnimation { return new this.sequence(model, this.input) }
}

export default abstract class StructuredLinearAction extends Component<StructuredLinearActionProps, Record<string, never>> {
  protected abstract readonly sequence: LinearSequenceConstructor
  public render() {
    return <ActionPlayback model={this.props.model} definition={new LinearDefinition(this.sequence, this.props.input ?? {})}
      onSceneChange={this.props.onSceneChange} onComplete={this.props.onComplete} />
  }
}
