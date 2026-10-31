import { Component, createRef } from 'react'
import type { ChangeEvent, FormEvent, MouseEvent, ReactNode, SyntheticEvent } from 'react'
import type { ActionInputRequest } from '../../visualization/ActionInputRequest.ts'
import type { TreeInputValues } from '../../visualization/AdditionalTreeModel.ts'
import { StructureCatalog } from '../../visualization/StructureCatalog.ts'
import './ActionInput.css'

interface ActionInputProps {
  readonly request: ActionInputRequest
  readonly onConfirm: (value: number, upperValue?: number) => void
  readonly onConfirmStructured?: (values: TreeInputValues) => void
  readonly onClose: () => void
}

interface ActionInputState {
  readonly value: string
  readonly upperValue: string
  readonly error: string
  readonly upperError: string
  readonly fields: Readonly<Record<string, string>>
  readonly fieldErrors: Readonly<Record<string, string>>
}

export default class ActionInput extends Component<ActionInputProps, ActionInputState> {
  private readonly dialog = createRef<HTMLDialogElement>()
  private readonly input = createRef<HTMLInputElement>()
  private readonly upperInput = createRef<HTMLInputElement>()

  constructor(props: ActionInputProps) {
    super(props)
    this.state = { value: '', upperValue: '', error: '', upperError: '', fields: {}, fieldErrors: {} }
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
    this.setState({ value, error: '', upperError: '' })
  }

  private changeUpperValue = (event: ChangeEvent<HTMLInputElement>): void => {
    const upperValue = event.currentTarget.value
    if (!this.props.request.acceptsDraft(upperValue)) return
    this.setState({ upperValue, upperError: '' })
  }

  private submit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const structured = this.props.request.structured
    if (structured) {
      const fieldErrors = structured.validate(this.state.fields)
      const firstError = Object.keys(fieldErrors)[0]
      if (firstError) {
        this.setState({ fieldErrors }, () => {
          this.dialog.current?.querySelector<HTMLInputElement>(`[data-field="${firstError}"]`)?.focus()
        })
        return
      }
      this.props.onConfirmStructured?.(structured.parse(this.state.fields))
      return
    }
    const error = this.props.request.validate(this.state.value)
    const upperError = this.props.request.validateUpperBound(this.state.value, this.state.upperValue)
    if (error || upperError) {
      this.setState({ error: error ?? '', upperError: upperError ?? '' })
      if (error) this.input.current?.focus()
      else this.upperInput.current?.focus()
      return
    }
    this.props.onConfirm(
      Number(this.state.value),
      this.props.request.rangeInput || this.props.request.pairInput ? Number(this.state.upperValue) : undefined,
    )
  }

  private changeField = (event: ChangeEvent<HTMLInputElement>): void => {
    const name = event.currentTarget.dataset.field
    const structured = this.props.request.structured
    if (!name || !structured) return
    for (const field of structured.fields) {
      if (field.name !== name) continue
      const value = event.currentTarget.value
      if (!structured.acceptsDraft(field, value)) return
      this.setState({ fields: { ...this.state.fields, [name]: value }, fieldErrors: {} })
    }
  }

  private renderFields(): ReactNode {
    const structured = this.props.request.structured
    if (!structured) return null
    const fields: ReactNode[] = []
    for (let index = 0; index < structured.fields.length; index += 1) {
      const field = structured.fields[index]
      const id = `action-field-${field.name}`
      const error = this.state.fieldErrors[field.name]
      fields.push(
        <div key={field.name}>
          <label htmlFor={id}>{field.label}</label>
          <input id={id} ref={index === 0 ? this.input : undefined} type="text"
            inputMode={field.text ? 'text' : 'numeric'} autoComplete="off" autoCapitalize="none" spellCheck={false}
            data-field={field.name} value={this.state.fields[field.name] ?? ''} onChange={this.changeField}
            disabled={!structured.available} required aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-error structured-input-hint` : 'structured-input-hint'} />
          {error && <p id={`${id}-error`} className="action-input-error" role="alert">{error}</p>}
        </div>,
      )
    }
    return <>{fields}<p id="structured-input-hint" className="action-input-hint">{structured.hint}</p></>
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
          {request.structured ? this.renderFields() : <>
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
          {(request.rangeInput || request.pairInput) && (
            <>
              <label htmlFor="action-input-upper-value">{request.secondLabel}</label>
              <input
                id="action-input-upper-value"
                ref={this.upperInput}
                type="text"
                inputMode="numeric"
                autoComplete="off"
                value={this.state.upperValue}
                onChange={this.changeUpperValue}
                disabled={!request.available}
                required
                aria-invalid={Boolean(this.state.upperError)}
                aria-describedby={this.state.upperError ? 'action-input-upper-hint action-input-upper-error' : 'action-input-upper-hint'}
              />
              <p id="action-input-upper-hint" className="action-input-hint">{request.secondHint}</p>
              {this.state.upperError && <p id="action-input-upper-error" className="action-input-error" role="alert">{this.state.upperError}</p>}
            </>
          )}
          </>}
          <div className="action-input-buttons">
            <button type="button" className="text-button" onClick={this.props.onClose}>Cancel</button>
            <button type="submit" className="primary-button" disabled={!request.available}>Start animation</button>
          </div>
        </form>
      </dialog>
    )
  }
}
