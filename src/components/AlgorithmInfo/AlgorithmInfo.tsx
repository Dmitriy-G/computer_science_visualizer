import { PureComponent, createRef } from 'react'
import type { MouseEvent, ReactNode, SyntheticEvent } from 'react'
import type {
  AlgorithmInformation,
  ComplexityInformation,
} from '../../visualization/AlgorithmInformation.ts'
import './AlgorithmInfo.css'

interface AlgorithmInfoProps {
  readonly information: AlgorithmInformation | null
  readonly onClose: () => void
}

export default class AlgorithmInfo extends PureComponent<
  AlgorithmInfoProps,
  Record<string, never>
> {
  private readonly dialog = createRef<HTMLDialogElement>()

  public componentDidMount(): void {
    this.syncDialog()
  }

  public componentDidUpdate(): void {
    this.syncDialog()
  }

  public componentWillUnmount(): void {
    this.dialog.current?.close()
  }

  private syncDialog(): void {
    const dialog = this.dialog.current
    if (!dialog) return
    if (this.props.information && !dialog.open) dialog.showModal()
    if (!this.props.information && dialog.open) dialog.close()
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

  private renderComplexity(
    label: string,
    information: ComplexityInformation,
  ): ReactNode {
    return (
      <section className="algorithm-complexity" aria-label={label}>
        <h3>{label}</h3>
        <dl>
          <div>
            <dt>Best case</dt>
            <dd><code>{information.best}</code></dd>
          </div>
          <div>
            <dt>Average case</dt>
            <dd><code>{information.average}</code></dd>
          </div>
          <div>
            <dt>Worst case</dt>
            <dd><code>{information.worst}</code></dd>
          </div>
        </dl>
      </section>
    )
  }

  private renderTerms(information: AlgorithmInformation): ReactNode[] {
    const terms: ReactNode[] = []
    for (const term of information.terms) {
      terms.push(
        <div key={term.symbol}>
          <dt>
            <code>{term.symbol}</code>
          </dt>
          <dd>{term.meaning}</dd>
        </div>,
      )
    }
    return terms
  }

  private renderInformation(information: AlgorithmInformation): ReactNode {
    return (
      <>
        <h2 id="algorithm-info-title">{information.name}</h2>
        <p id="algorithm-info-summary" className="algorithm-summary">{information.summary}</p>
        <div className="algorithm-complexities">
          {this.renderComplexity('Time complexity', information.time)}
          {this.renderComplexity('Additional memory', information.memory)}
        </div>
        <p className="complexity-explanation">
          <strong>Time.</strong> {information.time.explanation}
        </p>
        <p className="complexity-explanation">
          <strong>Memory.</strong> {information.memory.explanation}
        </p>
        {information.terms.length > 0 && (
          <>
            <h3>Terms used in this action</h3>
            <dl className="algorithm-terms">{this.renderTerms(information)}</dl>
          </>
        )}
      </>
    )
  }

  public render() {
    return (
      <dialog
        id="algorithm-overview"
        className="algorithm-info"
        ref={this.dialog}
        onCancel={this.handleCancel}
        onClick={this.handleBackdrop}
        aria-labelledby="algorithm-info-title"
        aria-describedby="algorithm-info-summary"
      >
        <div className="algorithm-dialog-heading">
          <span className="eyebrow">Algorithm overview</span>
          <button className="icon-button" onClick={this.props.onClose} aria-label="Close algorithm overview">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        {this.props.information && this.renderInformation(this.props.information)}
      </dialog>
    )
  }
}
