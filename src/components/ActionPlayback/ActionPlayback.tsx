import { Component } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimationController } from '../../visualization/AnimationController.ts'
import type { TimelineObserver } from '../../visualization/AnimationController.ts'
import type {
  ActionModel,
  ActionPlan,
  ActionPlaybackProps,
} from '../../visualization/ActionDefinition.ts'
import PseudocodeDialog from '../PseudocodeDialog/PseudocodeDialog.tsx'
import './ActionPlayback.css'

interface ActionPlaybackState {
  readonly index: number
  readonly toolbarHost: HTMLElement | null
  readonly codeHost: HTMLElement | null
}

export default class ActionPlayback<TModel extends ActionModel<TModel>>
  extends Component<ActionPlaybackProps<TModel>, ActionPlaybackState>
  implements TimelineObserver
{
  private readonly original: TModel
  private readonly animation: ActionPlan<TModel>
  private readonly controller: AnimationController

  constructor(props: ActionPlaybackProps<TModel>) {
    super(props)
    this.original = props.model.clone()
    const initialValue = props.value ?? props.definition.initialValue ?? 99
    this.animation = props.definition.create(this.original, initialValue, props.upperValue)
    this.controller = new AnimationController(this.animation.steps, this)
    this.state = {
      index: 0,
      toolbarHost: null,
      codeHost: null,
    }
  }

  public componentDidMount(): void {
    this.setState({
      toolbarHost: document.getElementById('playback-toolbar'),
      codeHost: document.getElementById('renderer-code'),
    })
    this.controller.play()
  }

  public componentWillUnmount(): void {
    this.controller.dispose()
  }

  public onTimelineChange(index: number): void {
    this.setState({ index })
    const list =
      index === this.animation.steps.length - 1
        ? this.animation.result
        : this.original
    this.props.onSceneChange(this.animation.steps[index].scene, list)
    if (index === this.animation.steps.length - 1) this.props.onComplete?.()
  }

  private renderToolbar(): ReactNode {
    const step = this.animation.steps[this.state.index]
    return (
      <div className="playback-toolbar" role="group" aria-label="Animation progress">
        <div className="playback-timeline">
          <progress
            className="timeline-progress"
            max={Math.max(1, this.animation.steps.length - 1)}
            value={this.animation.steps.length === 1 ? 1 : this.state.index}
            aria-label="Animation progress"
            aria-valuetext={`Step ${this.state.index + 1}: ${step.title}. ${step.description}`}
          />
        </div>
      </div>
    )
  }

  public render() {
    const pseudocode = this.props.definition.pseudocode
    return (
      <>
        {this.state.toolbarHost && createPortal(this.renderToolbar(), this.state.toolbarHost)}
        {this.state.codeHost && pseudocode && createPortal(
          <PseudocodeDialog title={this.props.definition.title} code={pseudocode} />,
          this.state.codeHost,
        )}
      </>
    )
  }
}
