import { Component, createRef } from 'react'
import type { MouseEvent, SyntheticEvent, ReactNode } from 'react'
import { StructureCatalog } from '../../visualization/StructureCatalog.ts'
import type { StructureKind } from '../../visualization/Scene.ts'
import './MainMenu.css'

interface MainMenuProps {
  readonly open: boolean
  readonly screen: 'structures' | 'actions'
  readonly selected: StructureKind | null
  readonly onClose: () => void
  readonly onStructureSelected: (kind: StructureKind) => void
  readonly onShowStructures: () => void
  readonly onActionSelected: () => void
}

export default class MainMenu extends Component<
  MainMenuProps,
  Record<string, never>
> {
  private readonly dialog = createRef<HTMLDialogElement>()
  private readonly title = createRef<HTMLHeadingElement>()

  public componentDidMount(): void {
    this.syncDialog()
  }

  public componentDidUpdate(previous: MainMenuProps): void {
    this.syncDialog()
    if (
      this.props.open &&
      (previous.screen !== this.props.screen ||
        previous.selected !== this.props.selected)
    ) {
      this.title.current?.focus()
    }
  }

  private syncDialog(): void {
    const dialog = this.dialog.current
    if (!dialog) return
    if (this.props.open && !dialog.open) dialog.showModal()
    if (!this.props.open && dialog.open) dialog.close()
  }

  private handleCancel = (event: SyntheticEvent<HTMLDialogElement>): void => {
    event.preventDefault()
    this.props.onClose()
  }

  private handleBackdrop = (event: MouseEvent<HTMLDialogElement>): void => {
    if (event.target === event.currentTarget) this.props.onClose()
  }

  private handleSelection = (event: MouseEvent<HTMLButtonElement>): void => {
    const kind = event.currentTarget.dataset.kind
    for (const structure of StructureCatalog.structures) {
      if (structure.kind === kind) {
        this.props.onStructureSelected(structure.kind)
        return
      }
    }
  }

  private renderStructures(): ReactNode[] {
    const buttons: ReactNode[] = []
    for (const structure of StructureCatalog.structures) {
      buttons.push(
        <button
          className="structure-choice"
          key={structure.kind}
          data-kind={structure.kind}
          onClick={this.handleSelection}
        >
          <span className="structure-symbol" aria-hidden="true">
            {structure.symbol}
          </span>
          <span>
            <strong>{structure.name}</strong>
            <small>{structure.description}</small>
          </span>
          <span className="choice-arrow" aria-hidden="true">
            ↗
          </span>
        </button>,
      )
    }
    return buttons
  }

  public render() {
    const actions =
      this.props.screen === 'actions' && this.props.selected !== null
    return (
      <dialog
        id="main-menu"
        className="main-menu"
        ref={this.dialog}
        onCancel={this.handleCancel}
        onClick={this.handleBackdrop}
        aria-labelledby="menu-title"
      >
        <div className="menu-content">
          <div className="menu-topline">
            <span className="eyebrow">Explore & understand</span>
            <button
              className="icon-button"
              aria-label="Close menu"
              onClick={this.props.onClose}
            >
              ×
            </button>
          </div>
          <h2 id="menu-title" ref={this.title} tabIndex={-1}>
            {actions ? 'Choose an action' : 'Data structures'}
          </h2>
          <p className="menu-description">
            {actions
              ? `Explore ${StructureCatalog.getName(this.props.selected!)} step by step.`
              : 'Pick a structure. Start with 10 elements.'}
          </p>
          <nav
            aria-label={actions ? 'Data structure actions' : 'Data structures'}
          >
            {actions ? (
              <>
                <button
                  className="back-button"
                  onClick={this.props.onShowStructures}
                >
                  ← All structures
                </button>
                <p className="menu-section-label">
                  {StructureCatalog.getName(this.props.selected!)}
                </p>
                {this.props.selected === 'linked-list' ? (
                  <button
                    className="action-choice"
                    onClick={this.props.onActionSelected}
                  >
                    <span className="action-choice-tag">
                      POINTERS · INSERTION
                    </span>
                    <strong>Insert in the middle</strong>
                    <span>Traverse, make space, insert, and reconnect.</span>
                    <small>
                      7 phases · detailed animation{' '}
                      <span aria-hidden="true">→</span>
                    </small>
                  </button>
                ) : (
                  <p className="menu-notice">
                    The 10-element preview is ready. Animated actions for this
                    structure are not implemented yet. Choose Linked list to
                    explore middle insertion.
                  </p>
                )}
              </>
            ) : (
              this.renderStructures()
            )}
          </nav>
          <p className="menu-footer">
            Every change has a story. See how it works.
          </p>
        </div>
      </dialog>
    )
  }
}
