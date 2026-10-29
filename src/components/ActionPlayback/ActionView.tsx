import { Component, createRef } from 'react'
import ActionPlayback from './ActionPlayback.tsx'
import type { ActionDefinition, ActionModel } from '../../visualization/ActionDefinition.ts'
import type { Scene } from '../../visualization/Scene.ts'

export interface ActionViewProps<TModel> {
  readonly model: TModel
  readonly onSceneChange: (scene: Scene, model: TModel) => void
}

export default abstract class ActionView<TModel extends ActionModel<TModel>> extends Component<ActionViewProps<TModel>, Record<string, never>> {
  protected abstract readonly definition: ActionDefinition<TModel>
  private readonly player = createRef<ActionPlayback<TModel>>()

  public pausePlayback(): void {
    this.player.current?.pausePlayback()
  }

  public render() {
    return <ActionPlayback<TModel> ref={this.player} model={this.props.model} definition={this.definition} onSceneChange={this.props.onSceneChange} />
  }
}
