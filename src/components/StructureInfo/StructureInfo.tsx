import { PureComponent, createRef } from 'react'
import type { MouseEvent, SyntheticEvent } from 'react'
import { StructureCatalog } from '../../visualization/StructureCatalog.ts'
import type { StructureKind } from '../../visualization/Scene.ts'
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

  public render() {
    const name = this.props.structure ? StructureCatalog.getName(this.props.structure) : 'data structure'
    return (
      <dialog
        id="structure-overview"
        className="structure-info"
        ref={this.dialog}
        onCancel={this.handleCancel}
        onClick={this.handleBackdrop}
        aria-label={`About ${name}`}
      >
        <button className="icon-button close-structure-info" onClick={this.props.onClose} aria-label="Close structure information">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        </button>
        <div className="structure-info-content">
          {/* Add the selected structure's general information here. */}
        </div>
      </dialog>
    )
  }
}
