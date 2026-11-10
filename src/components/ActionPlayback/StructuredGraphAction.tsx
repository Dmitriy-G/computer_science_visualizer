import { Component } from 'react'
import ActionPlayback from './ActionPlayback.tsx'
import type { GraphModel, GraphInputValues } from '../../visualization/GraphModel.ts'
import type { GraphAnimation } from '../../visualization/GraphAnimation.ts'
import type { ActionDefinition } from '../../visualization/ActionDefinition.ts'
import type { Scene } from '../../visualization/Scene.ts'

export interface StructuredGraphActionProps {
  readonly model: GraphModel
  readonly input?: GraphInputValues
  readonly onSceneChange: (scene: Scene, model: GraphModel) => void
  readonly onComplete?: () => void
}

export interface GraphSequenceConstructor {
  new(model: GraphModel, input: GraphInputValues): GraphAnimation
  readonly title: string
  readonly summary: string
  readonly pseudocode?: string
}

class StructuredGraphDefinition implements ActionDefinition<GraphModel> {
  public readonly title: string
  public readonly summary: string
  public readonly pseudocode?: string
  public readonly context = 'Graph operation'
  public readonly phases = ['Inspect', 'Traverse / modify', 'Finish']
  public readonly timelineHint = 'Follow vertices and highlighted edges'
  private readonly sequence: GraphSequenceConstructor
  private readonly input: GraphInputValues

  constructor(sequence: GraphSequenceConstructor, input: GraphInputValues) {
    this.sequence = sequence
    this.input = input
    this.title = sequence.title
    this.summary = sequence.summary
    this.pseudocode = sequence.pseudocode
  }

  public create(model: GraphModel): GraphAnimation { return new this.sequence(model, this.input) }
}

export default abstract class StructuredGraphAction extends Component<StructuredGraphActionProps, Record<string, never>> {
  protected abstract readonly sequence: GraphSequenceConstructor
  public render() {
    return <ActionPlayback model={this.props.model} definition={new StructuredGraphDefinition(this.sequence, this.props.input ?? {})}
      onSceneChange={this.props.onSceneChange} onComplete={this.props.onComplete} />
  }
}
