import { Component, createRef } from 'react'
import type { MouseEvent, SyntheticEvent, ReactNode } from 'react'
import { StructureCatalog } from '../../visualization/StructureCatalog.ts'
import type { StructureGroupKind } from '../../visualization/StructureCatalog.ts'
import { MenuNavigation } from './MenuNavigation.ts'
import type { MenuCategoryKind, AlgorithmGroupKind } from './MenuNavigation.ts'
import type { StructureKind } from '../../visualization/Scene.ts'
import { ActionCatalog } from '../../visualization/ActionCatalog.ts'
import './MainMenu.css'

interface MainMenuProps {
  readonly open: boolean
  readonly navigation: MenuNavigation
  readonly selected: StructureKind | null
  readonly onClose: () => void
  readonly onStructureSelected: (kind: StructureKind) => void
  readonly onCategorySelected: (category: MenuCategoryKind) => void
  readonly onGroupSelected: (group: StructureGroupKind) => void
  readonly onAlgorithmGroupSelected: (group: AlgorithmGroupKind) => void
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
    const kind = event.currentTarget.dataset.kind
    for (const structure of this.props.navigation.getStructures()) {
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

  private handleCategory = (event: MouseEvent<HTMLButtonElement>): void => {
    for (const category of MenuNavigation.categories) {
      if (category.kind === event.currentTarget.dataset.category) {
        this.props.onCategorySelected(category.kind)
        return
      }
    }
  }

  private handleAlgorithmGroup = (event: MouseEvent<HTMLButtonElement>): void => {
    for (const group of MenuNavigation.algorithmGroups) {
      if (group.kind === event.currentTarget.dataset.algorithmGroup) {
        this.props.onAlgorithmGroupSelected(group.kind)
        return
      }
    }
  }

  private renderAlgorithmGroups(): ReactNode[] {
    const buttons: ReactNode[] = []
    for (const group of MenuNavigation.algorithmGroups) {
      buttons.push(
        <button className="structure-choice" key={group.kind} data-algorithm-group={group.kind} onClick={this.handleAlgorithmGroup}>
          <span className="structure-symbol" aria-hidden="true">{group.symbol}</span>
            <span className="choice-copy"><strong title={group.name}>{group.name}</strong><small title={group.description}>{group.description}</small></span>
        </button>,
      )
    }
    return buttons
  }

  private renderCategories(): ReactNode[] {
    const buttons: ReactNode[] = []
    for (const category of MenuNavigation.categories) {
      buttons.push(
        <button className="structure-choice" key={category.kind} data-category={category.kind} onClick={this.handleCategory}>
          <span className="structure-symbol" aria-hidden="true">{category.symbol}</span>
          <span className="choice-copy">
              <strong title={category.name}>{category.name}</strong>
              <small title={category.description}>{category.description}</small>
          </span>
        </button>,
      )
    }
    return buttons
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
              <strong title={group.name}>{group.name}</strong>
              <small title={group.description}>{group.description}</small>
          </span>
        </button>,
      )
    }
    return buttons
  }

  private renderStructureIcon(kind: StructureKind, fallback: string): ReactNode {
    let drawing: ReactNode
    switch (kind) {
      case 'hash-map':
      case 'hash-set':
        drawing = (
          <>
            <path d="M10 4 6 28M24 4l-4 24M3 12h26M2 21h26" />
            {kind === 'hash-set' && <circle cx="27" cy="27" r="3" />}
          </>
        )
        break
      case 'bloom-filter':
        drawing = (
          <>
            <rect x="3" y="4" width="26" height="24" rx="3" />
            <path d="M3 12h26M3 20h26M12 4v24M20 4v24" />
            <path d="m6 8 2 1m7 7 2 1m6 7 2 1" />
          </>
        )
        break
      case 'trie':
      case 'ast':
        drawing = (
          <>
            <path d="M16 8 7 21m9-13 9 13" />
            <text x="13" y="9" stroke="none" fill="currentColor" fontSize="11">{kind === 'ast' ? '+' : 'a'}</text>
            <text x="3" y="29" stroke="none" fill="currentColor" fontSize="11">{kind === 'ast' ? '2' : 'b'}</text>
            <text x="23" y="29" stroke="none" fill="currentColor" fontSize="11">{kind === 'ast' ? '3' : 'c'}</text>
          </>
        )
        break
      case 'heap':
        drawing = (
          <>
            <path d="M16 10 7 22m9-12 9 12" />
            <circle cx="16" cy="6" r="4" />
            <circle cx="6" cy="25" r="4" />
            <circle cx="26" cy="25" r="4" />
          </>
        )
        break
      case 'segment-tree':
        drawing = (
          <>
            <rect x="10" y="3" width="12" height="7" rx="2" />
            <path d="m13 10-7 10m13-10 7 10" />
            <rect x="1" y="21" width="11" height="7" rx="2" />
            <rect x="20" y="21" width="11" height="7" rx="2" />
            <path d="M14 6h4M16 4v4" />
          </>
        )
        break
      case 'fenwick-tree':
        drawing = <path d="M4 27V17h6v10m5 0V10h6v17m5 0V3h5v24M7 17V8h11m0 2V3h11" />
        break
      case 'r-tree':
        drawing = (
          <>
            <rect x="2" y="3" width="28" height="26" rx="2" />
            <rect x="5" y="7" width="14" height="13" rx="1" />
            <rect x="14" y="15" width="12" height="10" rx="1" />
          </>
        )
        break
      case 'lsm-tree':
        drawing = (
          <>
            <rect x="11" y="2" width="10" height="6" rx="1" />
            <path d="M16 9v3m-2-2 2 2 2-2" />
            <rect x="6" y="14" width="20" height="6" rx="1" />
            <rect x="2" y="24" width="28" height="6" rx="1" />
            <path d="M12 14v6m8-6v6M9 24v6m7-6v6m7-6v6" />
          </>
        )
        break
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
    for (const structure of this.props.navigation.getStructures()) {
      let description = structure.description
      const examples = this.props.navigation.actionScope !== 'overview'
      if (examples) {
        const titles: string[] = []
        const actions = ActionCatalog.getScopedActions(structure.kind, this.props.navigation.actionScope)
        for (const action of actions) {
          if (titles.length === 2) break
          titles.push(action.title)
        }
        description = titles.join(', ')
        if (actions.length > titles.length) description += ', …'
      }
      buttons.push(
        <button
          className={examples ? 'structure-choice structure-choice-examples' : 'structure-choice'}
          key={structure.kind}
          data-kind={structure.kind}
          onClick={this.handleSelection}
        >
          <span className="structure-symbol" aria-hidden="true">
            {this.renderStructureIcon(structure.kind, structure.symbol)}
          </span>
          <span className="choice-copy">
              <strong title={structure.name}>{structure.name}</strong>
              <small title={description}>{description}</small>
          </span>
        </button>,
      )
    }
    return buttons
  }

  private getDescription(): string | null {
    switch (this.props.navigation.screen) {
      case 'categories': return 'Choose a category to explore.'
      case 'groups': return null
      case 'structures': return null
      case 'algorithms': return null
      case 'algorithm-structures': return null
      case 'sorting': return null
    }
  }

  private renderChoices(): ReactNode {
    switch (this.props.navigation.screen) {
      case 'categories': return this.renderCategories()
      case 'groups': return this.renderGroups()
      case 'structures': return this.renderStructures()
      case 'algorithm-structures': return this.renderStructures()
      case 'algorithms': return this.renderAlgorithmGroups()
      case 'sorting': return this.renderStructures()
    }
  }

  public render() {
    const navigation = this.props.navigation
    const description = this.getDescription()
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
          {description && <p className="menu-description">{description}</p>}
          {navigation.screen !== 'categories' && (
            <button className="back-button" onClick={this.props.onBack}>
              <span aria-hidden="true">←</span> {navigation.backLabel}
            </button>
          )}
          <nav aria-label={navigation.title}>
            {this.renderChoices()}
          </nav>
        </div>
      </dialog>
    )
  }
}
