import { Component } from 'react'
import type { ChangeEvent, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimationController } from '../../visualization/AnimationController.ts'
import type { TimelineObserver } from '../../visualization/AnimationController.ts'
import type {
  ActionModel,
  ActionPlan,
  ActionPlaybackProps,
} from '../../visualization/ActionDefinition.ts'
import './ActionPlayback.css'

interface ActionPlaybackState {
  readonly index: number
  readonly playing: boolean
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
    const initialValue = props.definition.initialValue ?? 99
    this.animation = props.definition.create(this.original, initialValue)
    this.controller = new AnimationController(this.animation.steps, this)
    this.state = {
      index: 0,
      playing: false,
      toolbarHost: null,
      codeHost: null,
    }
  }

  public componentDidMount(): void {
    this.setState({
      toolbarHost: document.getElementById('playback-toolbar'),
      codeHost: document.getElementById('renderer-code'),
    })
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.controller.seek(0)
    } else {
      this.controller.play()
    }
  }

  public componentWillUnmount(): void {
    this.controller.dispose()
  }

  public pausePlayback(): void {
    this.controller.pause()
  }

  public onTimelineChange(index: number, playing: boolean): void {
    this.setState({ index, playing })
    const list =
      index === this.animation.steps.length - 1
        ? this.animation.result
        : this.original
    this.props.onSceneChange(this.animation.steps[index].scene, list)
  }

  private togglePlayback = (): void => {
    if (this.state.playing) this.controller.pause()
    else this.controller.play()
  }

  private seek = (event: ChangeEvent<HTMLInputElement>): void => {
    this.controller.seek(Number(event.currentTarget.value))
  }

  private renderToolbar(): ReactNode {
    const step = this.animation.steps[this.state.index]
    const last = this.state.index === this.animation.steps.length - 1
    return (
      <div className="playback-toolbar" role="group" aria-label="Animation playback">
        <button
          className="primary-button header-action-button"
          onClick={this.togglePlayback}
          aria-label={this.state.playing ? 'Pause animation' : last ? 'Replay animation' : 'Play animation'}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d={this.state.playing
                ? 'M9 5v14M15 5v14'
                : last
                  ? 'M4 10a8 8 0 1 1 1.8 7M4 4v6h6'
                  : 'm8 5 11 7-11 7Z'}
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div className="playback-timeline">
          <p
            id="timeline-description"
            className="timeline-description"
            aria-live="polite"
            aria-atomic="true"
          >
            {step.description}
          </p>
          <input
            id="insertion-timeline"
            className="timeline-slider"
            type="range"
            min="0"
            max={this.animation.steps.length - 1}
            value={this.state.index}
            onChange={this.seek}
            aria-label="Animation timeline"
            aria-describedby="timeline-description"
            aria-valuetext={`Step ${this.state.index + 1}: ${step.title}`}
          />
        </div>
      </div>
    )
  }

  public render() {
    const step = this.animation.steps[this.state.index]
    return (
      <>
        {this.state.toolbarHost && createPortal(this.renderToolbar(), this.state.toolbarHost)}
        {this.state.codeHost && createPortal(
          <pre className="step-code" role="region" aria-label="Current step pseudocode" tabIndex={0}>
            <code>{step.code}</code>
          </pre>,
          this.state.codeHost,
        )}
      </>
    )
  }
}
