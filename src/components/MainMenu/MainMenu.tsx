import { Component, createRef } from 'react'
import type { MouseEvent, SyntheticEvent, ReactNode } from 'react'
import { StructureCatalog } from '../../visualization/StructureCatalog.ts'
import type { StructureGroupKind } from '../../visualization/StructureCatalog.ts'
import { MenuNavigation } from './MenuNavigation.ts'
import type { StructureKind } from '../../visualization/Scene.ts'
import './MainMenu.css'

interface MainMenuProps {
  readonly open: boolean
  readonly navigation: MenuNavigation
  readonly selected: StructureKind | null
  readonly onClose: () => void
  readonly onStructureSelected: (kind: StructureKind) => void
  readonly onCategorySelected: () => void
  readonly onGroupSelected: (group: StructureGroupKind) => void
  readonly onBack: () => void
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
      (previous.navigation !== this.props.navigation ||
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
    if (!this.props.navigation.group) return
    const kind = event.currentTarget.dataset.kind
    for (const structure of StructureCatalog.getStructures(this.props.navigation.group)) {
      if (structure.kind === kind) {
        this.props.onStructureSelected(structure.kind)
        return
      }
    }
  }

  private handleGroup = (event: MouseEvent<HTMLButtonElement>): void => {
    for (const group of StructureCatalog.groups) {
      if (group.kind === event.currentTarget.dataset.group) {
        this.props.onGroupSelected(group.kind)
        return
      }
    }
  }

  private renderCategories(): ReactNode {
    return (
      <button className="structure-choice" onClick={this.props.onCategorySelected}>
        <span className="structure-symbol" aria-hidden="true">≡</span>
        <span className="choice-copy">
          <strong>{MenuNavigation.categoryName}</strong>
          <small>Insertion, search, and deletion</small>
        </span>
        <span className="choice-arrow" aria-hidden="true">→</span>
      </button>
    )
  }

  private renderGroups(): ReactNode[] {
    const buttons: ReactNode[] = []
    for (const group of StructureCatalog.groups) {
      buttons.push(
        <button
          className="structure-choice"
          key={group.kind}
          data-group={group.kind}
          onClick={this.handleGroup}
        >
          <span className="structure-symbol" aria-hidden="true">{group.symbol}</span>
          <span className="choice-copy">
            <strong>{group.name}</strong>
            <small>{group.description}</small>
          </span>
          <span className="choice-arrow" aria-hidden="true">→</span>
        </button>,
      )
    }
    return buttons
  }

  private renderStructureIcon(kind: StructureKind, fallback: string): ReactNode {
    let drawing: ReactNode
    switch (kind) {
      case 'binary-tree':
      case 'avl-tree':
      case 'red-black-tree':
        drawing = (
          <>
            <path d="M16 10 7 21m9-11 9 11" />
            <circle cx="16" cy="7" r="4" />
            <circle cx="6" cy="25" r="4" fill={kind === 'red-black-tree' ? '#a93c45' : 'none'} />
            <circle cx="26" cy="25" r="4" fill={kind === 'red-black-tree' ? 'currentColor' : 'none'} />
            {kind === 'avl-tree' && <path d="M10 15h12" />}
          </>
        )
        break
      case 'b-tree':
      case 'b-plus-tree':
        drawing = (
          <>
            <rect x="9" y="3" width="14" height="7" rx="2" />
            <path d="M16 3v7m-3 0-6 9m12-9 6 9" />
            <rect x="2" y="19" width="10" height="8" rx="2" />
            <rect x="20" y="19" width="10" height="8" rx="2" />
            {kind === 'b-plus-tree' && <path d="M13 23h6m-2-2 2 2-2 2" />}
          </>
        )
        break
      case 'queue':
        drawing = (
          <>
            <rect x="6" y="14" width="8" height="11" rx="2" />
            <rect x="18" y="14" width="8" height="11" rx="2" />
            <path d="M4 7h24m-4-4 4 4-4 4" />
          </>
        )
        break
      case 'deque':
        drawing = (
          <>
            <rect x="6" y="14" width="8" height="11" rx="2" />
            <rect x="18" y="14" width="8" height="11" rx="2" />
            <path d="M4 7h24M8 3 4 7l4 4m16-8 4 4-4 4" />
          </>
        )
        break
      case 'doubly-linked-list':
        drawing = (
          <>
            <rect x="3" y="10" width="7" height="14" rx="2" />
            <rect x="22" y="10" width="7" height="14" rx="2" />
            <path d="M11 13h10m-3-3 3 3-3 3M21 21H11m3-3-3 3 3 3" />
          </>
        )
        break
      case 'circular-buffer':
        drawing = (
          <>
            <path d="M27 12a11 11 0 1 0 0 8M27 5v7h-7" />
            <rect x="12" y="12" width="8" height="8" rx="2" />
          </>
        )
        break
      default:
        return fallback
    }
    return (
      <svg
        className="structure-icon"
        viewBox="0 0 32 32"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        {drawing}
      </svg>
    )
  }

  private renderStructures(): ReactNode[] {
    const buttons: ReactNode[] = []
    if (!this.props.navigation.group) return buttons
    for (const structure of StructureCatalog.getStructures(this.props.navigation.group)) {
      buttons.push(
        <button
          className="structure-choice"
          key={structure.kind}
          data-kind={structure.kind}
          onClick={this.handleSelection}
        >
          <span className="structure-symbol" aria-hidden="true">
            {this.renderStructureIcon(structure.kind, structure.symbol)}
          </span>
          <span className="choice-copy">
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

  private renderPath(): ReactNode {
    const path = this.props.navigation.getPath()
    if (path.length < 2) return null
    const segments: ReactNode[] = []
    for (let index = 0; index < path.length; index += 1) {
      segments.push(
        <li key={index} aria-current={index === path.length - 1 ? 'page' : undefined}>
          {path[index]}
        </li>,
      )
    }
    return <nav aria-label="Menu path"><ol className="menu-path">{segments}</ol></nav>
  }

  private getDescription(): string {
    switch (this.props.navigation.screen) {
      case 'categories': return 'Choose a category to explore.'
      case 'groups': return 'Choose a data structure group.'
      case 'structures': return 'Pick a structure. Start with 10 elements.'
    }
  }

  private renderChoices(): ReactNode {
    switch (this.props.navigation.screen) {
      case 'categories': return this.renderCategories()
      case 'groups': return this.renderGroups()
      case 'structures': return this.renderStructures()
    }
  }

  public render() {
    const navigation = this.props.navigation
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
            {navigation.title}
          </h2>
          <p className="menu-description">
            {this.getDescription()}
          </p>
          {navigation.screen !== 'categories' && (
            <button className="back-button" onClick={this.props.onBack}>
              <span aria-hidden="true">←</span> {navigation.backLabel}
            </button>
          )}
          {this.renderPath()}
          <nav aria-label={navigation.title}>
            {this.renderChoices()}
          </nav>
          <p className="menu-footer">
            Every change has a story. See how it works.
          </p>
        </div>
      </dialog>
    )
  }
}
