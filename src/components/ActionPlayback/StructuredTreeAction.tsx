import { Component } from 'react'
import ActionPlayback from './ActionPlayback.tsx'
import type { AdditionalTreeModel, TreeInputValues } from '../../visualization/AdditionalTreeModel.ts'
import type { AdditionalTreeAnimation } from '../../visualization/AdditionalTreeAnimation.ts'
import type { ActionDefinition } from '../../visualization/ActionDefinition.ts'
import type { Scene } from '../../visualization/Scene.ts'

export interface StructuredTreeActionProps {
  readonly model: AdditionalTreeModel
  readonly input?: TreeInputValues
  readonly onSceneChange: (scene: Scene, model: AdditionalTreeModel) => void
  readonly onComplete?: () => void
}

export interface TreeSequenceConstructor {
  new(model: AdditionalTreeModel, input: TreeInputValues): AdditionalTreeAnimation
  readonly title: string
  readonly summary: string
}

class StructuredTreeDefinition implements ActionDefinition<AdditionalTreeModel> {
  public readonly title: string
  public readonly summary: string
  public readonly context = 'Tree operation'
  public readonly phases = ['Inspect', 'Traverse', 'Modify', 'Repair', 'Finish']
  public readonly timelineHint = 'Follow the current operation'
  private readonly sequence: TreeSequenceConstructor
  private readonly input: TreeInputValues

  constructor(sequence: TreeSequenceConstructor, input: TreeInputValues) {
    this.sequence = sequence
    this.input = input
    this.title = sequence.title
    this.summary = sequence.summary
  }

  public create(model: AdditionalTreeModel): AdditionalTreeAnimation { return new this.sequence(model, this.input) }
}

export default abstract class StructuredTreeAction extends Component<StructuredTreeActionProps, Record<string, never>> {
  protected abstract readonly sequence: TreeSequenceConstructor
  public render() {
    return <ActionPlayback model={this.props.model} definition={new StructuredTreeDefinition(this.sequence, this.props.input ?? {})}
      onSceneChange={this.props.onSceneChange} onComplete={this.props.onComplete} />
  }
}
