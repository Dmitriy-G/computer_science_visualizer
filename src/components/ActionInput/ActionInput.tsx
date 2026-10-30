import { Component, createRef } from 'react'
import type { ChangeEvent, FormEvent, MouseEvent, SyntheticEvent } from 'react'
import type { ActionInputRequest } from '../../visualization/ActionInputRequest.ts'
import { StructureCatalog } from '../../visualization/StructureCatalog.ts'
import './ActionInput.css'

interface ActionInputProps {
  readonly request: ActionInputRequest
  readonly onConfirm: (value: number) => void
  readonly onClose: () => void
}

interface ActionInputState {
  readonly value: string
  readonly error: string
}

export default class ActionInput extends Component<ActionInputProps, ActionInputState> {
  private readonly dialog = createRef<HTMLDialogElement>()
  private readonly input = createRef<HTMLInputElement>()

  constructor(props: ActionInputProps) {
    super(props)
    this.state = { value: '', error: '' }
  }

  public componentDidMount(): void {
    this.dialog.current?.showModal()
    if (this.props.request.available) {
      this.input.current?.focus()
      this.input.current?.select()
    }
  }

  public componentWillUnmount(): void {
    this.dialog.current?.close()
  }

  private handleCancel = (event: SyntheticEvent<HTMLDialogElement>): void => {
    event.preventDefault()
    this.props.onClose()
  }

  private handleBackdrop = (event: MouseEvent<HTMLDialogElement>): void => {
    if (event.target !== event.currentTarget) return
    const bounds = event.currentTarget.getBoundingClientRect()
    if (
      event.clientX < bounds.left || event.clientX > bounds.right ||
      event.clientY < bounds.top || event.clientY > bounds.bottom
    ) this.props.onClose()
  }

  private changeValue = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = event.currentTarget.value
    if (!this.props.request.acceptsDraft(value)) return
    this.setState({ value, error: '' })
  }

  private submit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const error = this.props.request.validate(this.state.value)
    if (error) {
      this.setState({ error })
      this.input.current?.focus()
      return
    }
    this.props.onConfirm(Number(this.state.value))
  }

  public render() {
    const request = this.props.request
    return (
      <dialog
        id="action-input-dialog"
        className="action-input-dialog"
        ref={this.dialog}
        onCancel={this.handleCancel}
        onClick={this.handleBackdrop}
        aria-labelledby="action-input-title"
        aria-describedby="action-input-description"
      >
        <div className="action-input-heading">
          <span className="eyebrow">{StructureCatalog.getName(request.structure)}</span>
          <button className="icon-button" onClick={this.props.onClose} aria-label="Close action input">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <h2 id="action-input-title">{request.title}</h2>
        <p id="action-input-description">{request.description}</p>
        <form onSubmit={this.submit} noValidate>
          <label htmlFor="action-input-value">{request.label}</label>
          <input
            id="action-input-value"
            ref={this.input}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            value={this.state.value}
            onChange={this.changeValue}
            disabled={!request.available}
            required
            aria-invalid={Boolean(this.state.error)}
            aria-describedby={this.state.error ? 'action-input-hint action-input-error' : 'action-input-hint'}
          />
          <p id="action-input-hint" className="action-input-hint">{request.hint}</p>
          {this.state.error && <p id="action-input-error" className="action-input-error" role="alert">{this.state.error}</p>}
          <div className="action-input-buttons">
            <button type="button" className="text-button" onClick={this.props.onClose}>Cancel</button>
            <button type="submit" className="primary-button" disabled={!request.available}>Start animation</button>
          </div>
        </form>
      </dialog>
    )
  }
}
