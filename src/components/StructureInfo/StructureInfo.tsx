import { PureComponent, createRef } from 'react'
import type { MouseEvent, ReactNode, SyntheticEvent } from 'react'
import { StructureCatalog } from '../../visualization/StructureCatalog.ts'
import type { StructureKind } from '../../visualization/Scene.ts'
import { StructureInformation } from './StructureInformation.ts'
import type { StructureOverview } from './StructureInformation.ts'
import './StructureInfo.css'

interface StructureInfoProps {
  readonly structure: StructureKind | null
  readonly onClose: () => void
}

export default class StructureInfo extends PureComponent<
  StructureInfoProps,
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
    if (this.props.structure && !dialog.open) dialog.showModal()
    if (!this.props.structure && dialog.open) dialog.close()
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

  private renderUseCases(information: StructureOverview): ReactNode[] {
    const rows: ReactNode[] = []
    for (const useCase of information.useCases) {
      rows.push(
        <tr key={useCase.area}>
          <th scope="row">{useCase.area}</th>
          <td>{useCase.description}</td>
        </tr>,
      )
    }
    return rows
  }

  private renderTechnologies(information: StructureOverview): ReactNode[] {
    const items: ReactNode[] = []
    for (const technology of information.technologies) {
      items.push(
        <li key={technology.name}>
          <a href={technology.url} target="_blank" rel="noreferrer">{technology.name}</a>
          {' — '}{technology.usage}
        </li>,
      )
    }
    return items
  }

  public render() {
    const name = this.props.structure ? StructureCatalog.getName(this.props.structure) : 'data structure'
    const information = this.props.structure ? StructureInformation.get(this.props.structure) : null
    return (
      <dialog
        id="structure-overview"
        className="structure-info"
        ref={this.dialog}
        onCancel={this.handleCancel}
        onClick={this.handleBackdrop}
        aria-labelledby="structure-info-title"
        aria-describedby={information ? 'structure-info-summary' : undefined}
      >
        <div className="structure-info-heading">
          <span className="eyebrow">Structure overview</span>
          <button className="icon-button close-structure-info" onClick={this.props.onClose} aria-label="Close structure information">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="structure-info-content">
          <h2 id="structure-info-title">{name}</h2>
          {information && (
            <>
              <p id="structure-info-summary" className="structure-info-summary">{information.summary}</p>
              <table className="structure-use-cases">
                <caption>Where it is used</caption>
                <thead>
                  <tr>
                    <th scope="col">Area of use</th>
                    <th scope="col">How it is used and what it solves</th>
                  </tr>
                </thead>
                <tbody>{this.renderUseCases(information)}</tbody>
              </table>
              <section className="structure-technologies" aria-labelledby="structure-technologies-title">
                <h3 id="structure-technologies-title">Real technologies</h3>
                {information.technologies.length > 0
                  ? <ul>{this.renderTechnologies(information)}</ul>
                  : <p>No use in a production system, language runtime, or established application library has been verified for this structure.</p>}
              </section>
            </>
          )}
        </div>
      </dialog>
    )
  }
}
