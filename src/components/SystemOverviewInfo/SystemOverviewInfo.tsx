import { PureComponent, createRef } from 'react'
import type { MouseEvent, ReactNode, SyntheticEvent } from 'react'
import type { SystemOverviewInformation } from '../../visualization/SystemOverviewInformation.ts'
import type { AlgorithmTechnology } from '../../visualization/AlgorithmInformation.ts'
import './SystemOverviewInfo.css'

interface SystemOverviewInfoProps {
  readonly information: SystemOverviewInformation | null
  readonly onClose: () => void
}

export default class SystemOverviewInfo extends PureComponent<SystemOverviewInfoProps> {
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

  private renderTechnologies(technologies: readonly AlgorithmTechnology[]): ReactNode[] {
    const items: ReactNode[] = []
    for (const technology of technologies) {
      items.push(
        <li key={technology.url}>
          <a href={technology.url} target="_blank" rel="noreferrer">{technology.name}</a>
          {' — '}{technology.usage}
        </li>,
      )
    }
    return items
  }

  private renderInformation(information: SystemOverviewInformation): ReactNode {
    const usage = information.realWorldUsage
    const steps: ReactNode[] = []
    for (const step of information.steps) steps.push(<li key={step}>{step}</li>)
    return <>
      <h2 id="system-overview-title">{information.name}</h2>
      <section className="system-overview-section system-overview-introduction" aria-labelledby="system-overview-description-title">
        <h3 id="system-overview-description-title">What it is</h3>
        <p id="system-overview-summary" className="system-overview-summary">{information.summary}</p>
      </section>
      <section className="system-overview-section" aria-labelledby="system-overview-problem-title">
        <h3 id="system-overview-problem-title">Problem it solves</h3>
        <p>{information.problem}</p>
      </section>
      <section className="system-overview-section" aria-labelledby="system-overview-flow-title">
        <h3 id="system-overview-flow-title">Step-by-step flow</h3>
        <ol>{steps}</ol>
      </section>
      {usage && (
        <section className="system-overview-section" aria-labelledby="system-overview-technologies-title">
          <h3 id="system-overview-technologies-title">Real technologies</h3>
          {information.implementationNote && <p className="system-overview-implementation-note">{information.implementationNote}</p>}
          {usage.technologies.length > 0
            ? <ul>{this.renderTechnologies(usage.technologies)}</ul>
            : <p>{usage.note ?? 'No verified real technologies.'}</p>}
        </section>
      )}
    </>
  }

  public render(): ReactNode {
    return (
      <dialog
        id="system-components-overview"
        className="system-overview-info"
        ref={this.dialog}
        onCancel={this.handleCancel}
        onClick={this.handleBackdrop}
        aria-labelledby="system-overview-title"
        aria-describedby="system-overview-summary"
      >
        <div className="system-overview-heading">
          <span className="eyebrow">System Components overview</span>
          <button type="button" className="icon-button" onClick={this.props.onClose} aria-label="Close system components overview">
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
