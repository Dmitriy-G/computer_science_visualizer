import { Component, createRef } from 'react'
import type { MouseEvent, SyntheticEvent, ReactNode } from 'react'
import { StructureCatalog } from '../../visualization/StructureCatalog.ts'
import type { StructureGroupKind } from '../../visualization/StructureCatalog.ts'
import { MenuNavigation } from './MenuNavigation.ts'
import type { StructureKind } from '../../visualization/Scene.ts'
import { ActionCatalog } from '../../visualization/ActionCatalog.ts'
import type { ActionKind } from '../../visualization/ActionCatalog.ts'
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
  readonly onActionSelected: (action: ActionKind) => void
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
            {structure.symbol}
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

  private handleAction = (event: MouseEvent<HTMLButtonElement>): void => {
    if (!this.props.selected) return
    for (const action of ActionCatalog.getActions(this.props.selected)) {
      if (action.kind === event.currentTarget.dataset.action) {
        this.props.onActionSelected(action.kind)
        return
      }
    }
  }

  private renderActions(): ReactNode[] {
    const buttons: ReactNode[] = []
    if (!this.props.selected) return buttons
    for (const action of ActionCatalog.getActions(this.props.selected)) {
      buttons.push(
        <button className="action-choice" key={action.kind} data-action={action.kind} onClick={this.handleAction}>
          <strong>{action.title}</strong>
          <span>{action.description}</span>
          <small>Step-by-step animation <span aria-hidden="true">→</span></small>
        </button>,
      )
    }
    return buttons
  }

  private renderPath(): ReactNode {
    const path = this.props.navigation.getPath(this.props.selected)
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
      case 'actions': return `Explore ${this.props.selected ? StructureCatalog.getName(this.props.selected) : 'a structure'} step by step.`
    }
  }

  private renderChoices(): ReactNode {
    switch (this.props.navigation.screen) {
      case 'categories': return this.renderCategories()
      case 'groups': return this.renderGroups()
      case 'structures': return this.renderStructures()
      case 'actions': return this.renderActions()
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
          <nav aria-label={navigation.screen === 'actions' ? 'Data structure actions' : navigation.title}>
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
