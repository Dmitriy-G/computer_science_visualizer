import { Component, createRef } from 'react'
import type { ChangeEvent, ReactNode } from 'react'
import { AnimationController } from '../../visualization/AnimationController.ts'
import type { TimelineObserver } from '../../visualization/AnimationController.ts'
import type {
  ActionModel,
  ActionPlan,
  ActionPlaybackProps,
} from '../../visualization/ActionDefinition.ts'
import './ActionPlayback.css'

interface ActionPlaybackState {
  readonly panelOpen: boolean
  readonly index: number
  readonly playing: boolean
  readonly value: string
  readonly error: string
  readonly speed: string
}

export default class ActionPlayback<TModel extends ActionModel<TModel>>
  extends Component<ActionPlaybackProps<TModel>, ActionPlaybackState>
  implements TimelineObserver
{
  private readonly original: TModel
  private animation: ActionPlan<TModel>
  private controller: AnimationController
  private readonly controlsToggle = createRef<HTMLButtonElement>()

  constructor(props: ActionPlaybackProps<TModel>) {
    super(props)
    this.original = props.model.clone()
    const initialValue = props.definition.initialValue ?? 99
    this.animation = props.definition.create(this.original, initialValue)
    this.controller = new AnimationController(this.animation.steps, this)
    this.state = {
      panelOpen: true,
      index: 0,
      playing: false,
      value: String(initialValue),
      error: '',
      speed: '1',
    }
  }

  public componentDidMount(): void {
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

  private togglePanel = (): void => {
    this.setState({ panelOpen: !this.state.panelOpen })
  }

  private closePanel = (): void => {
    this.setState({ panelOpen: false }, this.focusControlsToggle)
  }

  private focusControlsToggle = (): void => {
    this.controlsToggle.current?.focus()
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
    if (this.state.error) return
    if (this.state.playing) this.controller.pause()
    else this.controller.play()
  }

  private previous = (): void => {
    this.controller.previous()
  }

  private next = (): void => {
    if (!this.state.error) this.controller.next()
  }

  private reset = (): void => {
    this.controller.seek(0)
  }

  private seek = (event: ChangeEvent<HTMLInputElement>): void => {
    if (!this.state.error)
      this.controller.seek(Number(event.currentTarget.value))
  }

  private changeSpeed = (event: ChangeEvent<HTMLSelectElement>): void => {
    const speed = event.currentTarget.value
    this.controller.setSpeed(Number(speed))
    this.setState({ speed })
  }

  private changeValue = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = event.currentTarget.value
    const parsed = Number(value)
    const minimum = this.props.definition.inputMinimum ?? -999
    const maximum = this.props.definition.inputMaximum ?? 999
    if (
      value.trim() === '' ||
      !Number.isInteger(parsed) ||
      parsed < minimum ||
      parsed > maximum
    ) {
      this.controller.pause()
      this.setState({ value, error: `Enter a whole number from ${minimum} to ${maximum}.` })
      return
    }
    this.controller.dispose()
    this.animation = this.props.definition.create(this.original, parsed)
    this.controller = new AnimationController(this.animation.steps, this)
    this.controller.setSpeed(Number(this.state.speed))
    this.setState({ value, error: '' })
    this.controller.seek(0)
  }

  private renderPhases(): ReactNode[] {
    const phases: ReactNode[] = []
    const current = this.animation.steps[this.state.index].phase
    const usedPhases = new Set<number>()
    for (const step of this.animation.steps) usedPhases.add(step.phase)
    let visiblePhase = 0
    for (
      let index = 0;
      index < this.props.definition.phases.length;
      index += 1
    ) {
      const phase = index + 1
      if (!usedPhases.has(phase)) continue
      visiblePhase += 1
      phases.push(
        <li
          key={phase}
          className={
            phase === current
              ? 'phase-current'
              : phase < current
                ? 'phase-done'
                : ''
          }
          aria-current={phase === current ? 'step' : undefined}
        >
          <span className="phase-number">{phase < current ? '✓' : visiblePhase}</span>
          <span>{this.props.definition.phases[index]}</span>
        </li>,
      )
    }
    return phases
  }

  public render() {
    const step = this.animation.steps[this.state.index]
    const last = this.state.index === this.animation.steps.length - 1
    const inputLocked = this.state.playing || this.state.index !== 0
    return (
      <section
        className="insertion-action"
        aria-label={`${this.props.definition.context}: ${this.props.definition.title}`}
      >
        <div className="action-panel-bar">
          <button
            className="action-panel-toggle"
            ref={this.controlsToggle}
            onClick={this.togglePanel}
            aria-expanded={this.state.panelOpen}
            aria-controls="insertion-controls"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M4 7h16M4 17h16M9 4v6M15 14v6"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
            <span>Animation controls</span>
            <span className="controls-action-name">
              {this.props.definition.title}
            </span>
            <svg
              className="controls-chevron"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="m6 15 6-6 6 6"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <span className={`playback-status${last ? ' status-complete' : ''}`}>
            {last ? 'Complete' : this.state.playing ? 'Playing' : 'Paused'}
          </span>
          {this.state.panelOpen && (
            <button
              className="icon-button close-action-panel"
              onClick={this.closePanel}
              aria-label="Hide animation controls"
              title="Hide animation controls"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="m6 6 12 12M18 6 6 18"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}
        </div>
        <div
          id="insertion-controls"
          className="insertion-panel"
          hidden={!this.state.panelOpen}
        >
          <div className="action-controls">
            <span className="eyebrow">{this.props.definition.context}</span>
            <h2>{this.props.definition.title}</h2>
            <p className="action-summary">{this.props.definition.summary}</p>
            <div className={this.props.definition.acceptsValue === false ? 'action-inputs action-inputs-no-value' : 'action-inputs'}>
              {this.props.definition.acceptsValue !== false && (
                <label htmlFor="insert-value">
                  {this.props.definition.inputLabel ?? 'New value'}
                  <input
                    id="insert-value"
                    type="number"
                    min={this.props.definition.inputMinimum ?? -999}
                    max={this.props.definition.inputMaximum ?? 999}
                    step="1"
                    value={this.state.value}
                    onChange={this.changeValue}
                    disabled={inputLocked}
                    aria-invalid={Boolean(this.state.error)}
                    aria-describedby="value-hint"
                  />
                </label>
              )}
              <label htmlFor="animation-speed">
                Speed
                <select
                  id="animation-speed"
                  value={this.state.speed}
                  onChange={this.changeSpeed}
                >
                  <option value="0.5">0.5×</option>
                  <option value="1">1×</option>
                  <option value="1.5">1.5×</option>
                  <option value="2">2×</option>
                </select>
              </label>
            </div>
            {this.props.definition.acceptsValue !== false && (
              <p
                id="value-hint"
                className={`input-hint${this.state.error ? ' input-error' : ''}`}
              >
                {this.state.error ||
                  'Reset to the first step to change the input.'}
              </p>
            )}
            <div className="playback-controls">
              <button
                className="primary-button play-button"
                onClick={this.togglePlayback}
                disabled={Boolean(this.state.error)}
              >
                <span aria-hidden="true">{this.state.playing ? 'Ⅱ' : '▷'}</span>
                {this.state.playing
                  ? 'Pause'
                  : last
                    ? 'Replay'
                    : this.state.index === 0
                      ? 'Play'
                      : 'Resume'}
              </button>
              <button
                className="icon-button"
                onClick={this.previous}
                disabled={this.state.index === 0}
                aria-label="Previous animation step"
                title="Previous step"
              >
                ←
              </button>
              <button
                className="icon-button"
                onClick={this.next}
                disabled={last || Boolean(this.state.error)}
                aria-label="Next animation step"
                title="Next step"
              >
                →
              </button>
              <button
                className="icon-button"
                onClick={this.reset}
                aria-label="Reset animation"
                title="Reset animation"
              >
                ↺
              </button>
            </div>
          </div>

          <div className="action-explanation">
            <ol className="animation-phases" aria-label="Action phases">
              {this.renderPhases()}
            </ol>
            <div className="step-heading">
              <span className="step-counter">
                STEP {String(this.state.index + 1).padStart(2, '0')} /{' '}
                {this.animation.steps.length}
              </span>
              <span
                className={`playback-status${last ? ' status-complete' : ''}`}
              >
                {last ? 'Complete' : this.state.playing ? 'Playing' : 'Paused'}
              </span>
            </div>
            <div
              className="step-description"
              aria-live="polite"
              aria-atomic="true"
            >
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
            <pre className="step-code">
              <code>{step.code}</code>
            </pre>
            <label className="timeline-label" htmlFor="insertion-timeline">
              <span>Animation timeline</span>
              <span>{this.props.definition.timelineHint}</span>
            </label>
            <input
              id="insertion-timeline"
              className="timeline-slider"
              type="range"
              min="0"
              max={this.animation.steps.length - 1}
              value={this.state.index}
              onChange={this.seek}
              disabled={Boolean(this.state.error)}
              aria-valuetext={`Step ${this.state.index + 1}: ${step.title}`}
            />
          </div>
        </div>
      </section>
    )
  }
}
