import { Component, createRef } from 'react'
import type { MouseEvent, SyntheticEvent, ReactNode } from 'react'
import type { MenuStructureGroupKind } from './MenuStructureCatalog.ts'
import { MenuNavigation } from './MenuNavigation.ts'
import type { MenuCategoryKind, AlgorithmGroupKind } from './MenuNavigation.ts'
import type { AdvancedAlgorithmGroupKind } from './AdvancedAlgorithmCatalog.ts'
import type { HardwareAlgorithmKind } from '../RealSystemsAlgorithms/Hardware/Complex/HardwareModel.ts'
import type { CpuAlgorithmKind } from '../RealSystemsAlgorithms/Hardware/Fundamental/CPU/CpuModel.ts'
import type { StructureKind } from '../../visualization/Scene.ts'
import { ActionCatalog } from '../../visualization/ActionCatalog.ts'
import { StructureInformation } from '../StructureInfo/StructureInformation.ts'
import MenuSearch from './Search/MenuSearch.tsx'
import type { DescribeSearchAlgorithm, MenuSearchResult } from './Search/MenuSearchIndex.ts'
import './UsageTag.css'
import './MainMenu.css'

interface MenuChoice {
  readonly kind: string
  readonly name: string
}

interface MainMenuProps {
  readonly open: boolean
  readonly searchOpen: boolean
  readonly navigation: MenuNavigation
  readonly selected: StructureKind | null
  readonly onClose: () => void
  readonly onStructureSelected: (kind: StructureKind) => void
  readonly onCategorySelected: (category: MenuCategoryKind) => void
  readonly onGroupSelected: (group: MenuStructureGroupKind) => void
  readonly onAlgorithmGroupSelected: (group: AlgorithmGroupKind) => void
  readonly onAdvancedAlgorithmGroupSelected: (group: AdvancedAlgorithmGroupKind) => void
  readonly onHardwareAlgorithmSelected: (algorithm: HardwareAlgorithmKind) => void
  readonly onCpuAlgorithmSelected: (algorithm: CpuAlgorithmKind) => void
  readonly onBack: () => void
  readonly describeSearchAlgorithm: DescribeSearchAlgorithm
  readonly onSearchResultSelected: (result: MenuSearchResult) => void
}

export default class MainMenu extends Component<MainMenuProps> {
  private readonly dialog = createRef<HTMLDialogElement>()
  private readonly title = createRef<HTMLHeadingElement>()
  private readonly search = createRef<MenuSearch>()

  public componentDidMount(): void {
    this.syncDialog()
  }

  public componentDidUpdate(previous: MainMenuProps): void {
    this.syncDialog()
    if (
      this.props.open && !this.props.searchOpen &&
      (previous.navigation !== this.props.navigation ||
        previous.selected !== this.props.selected)
    ) {
      this.title.current?.focus()
    }
  }

  private syncDialog(): void {
    const dialog = this.dialog.current
    if (!dialog) return
    if (this.props.open && !dialog.open) {
      dialog.showModal()
      if (this.props.searchOpen) this.search.current?.focusInput()
    }
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
    for (const group of this.props.navigation.getGroups()) {
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

  private orderChoices<T extends MenuChoice>(choices: readonly T[]): T[] {
    const ordered = [...choices]
    ordered.sort((first, second) =>
      first.name.localeCompare(second.name, 'en', { sensitivity: 'base' }) ||
      first.kind.localeCompare(second.kind, 'en'),
    )
    return ordered
  }

  private handleAdvancedAlgorithmGroup = (event: MouseEvent<HTMLButtonElement>): void => {
    for (const group of this.props.navigation.getAdvancedAlgorithmGroups()) {
      if (group.kind === event.currentTarget.dataset.advancedAlgorithmGroup) {
        this.props.onAdvancedAlgorithmGroupSelected(group.kind)
        return
      }
    }
  }

  private renderAdvancedAlgorithmGroups(): ReactNode {
    const hardwareAlgorithms = this.props.navigation.getHardwareAlgorithms()
    if (hardwareAlgorithms.length) {
      const buttons: ReactNode[] = []
      for (const algorithm of hardwareAlgorithms) buttons.push(
        <button type="button" className="structure-choice structure-choice--labeled" key={algorithm.kind} data-hardware-algorithm={algorithm.kind} onClick={this.handleHardwareAlgorithm}>
          <span className="usage-tags"><span className="usage-tag usage-tag--real-systems">Real Systems</span></span>
          <span className="choice-copy"><strong title={algorithm.name}>{algorithm.name}</strong><small title={algorithm.description}>{algorithm.description}</small></span>
        </button>,
      )
      return buttons
    }
    const cpuAlgorithms = this.props.navigation.getCpuAlgorithms()
    if (cpuAlgorithms.length) {
      const buttons: ReactNode[] = []
      for (const algorithm of cpuAlgorithms) buttons.push(
        <button type="button" className="structure-choice structure-choice--labeled" key={algorithm.kind} data-cpu-algorithm={algorithm.kind} onClick={this.handleCpuAlgorithm}>
          <span className="usage-tags"><span className="usage-tag usage-tag--real-systems">Real Systems</span></span>
          <span className="choice-copy"><strong title={algorithm.name}>{algorithm.name}</strong><small title={algorithm.description}>{algorithm.description}</small></span>
        </button>,
      )
      return buttons
    }
    const groups = this.props.navigation.getAdvancedAlgorithmGroups()
    if (!groups.length) return <p className="menu-empty-state">No algorithms have been added to this category yet.</p>
    const buttons: ReactNode[] = []
    const parent = this.props.navigation.advancedAlgorithmGroup
    const fixedOrder = parent === 'hardware' || parent === 'network' || parent === 'network-fundamental'
    const ordered = fixedOrder ? groups : this.orderChoices(groups)
    for (const group of ordered) {
      buttons.push(
        <button className="structure-choice" key={group.kind} data-advanced-algorithm-group={group.kind} onClick={this.handleAdvancedAlgorithmGroup}>
          <span className="choice-copy">
            <strong title={group.name}>{group.name}</strong>
            <small title={group.description}>{group.description}</small>
          </span>
        </button>,
      )
    }
    return buttons
  }

  private handleHardwareAlgorithm = (event: MouseEvent<HTMLButtonElement>): void => {
    for (const algorithm of this.props.navigation.getHardwareAlgorithms()) {
      if (algorithm.kind === event.currentTarget.dataset.hardwareAlgorithm) this.props.onHardwareAlgorithmSelected(algorithm.kind)
    }
  }

  private handleCpuAlgorithm = (event: MouseEvent<HTMLButtonElement>): void => {
    for (const algorithm of this.props.navigation.getCpuAlgorithms()) {
      if (algorithm.kind === event.currentTarget.dataset.cpuAlgorithm) this.props.onCpuAlgorithmSelected(algorithm.kind)
    }
  }

  private renderAlgorithmGroups(): ReactNode[] {
    const buttons: ReactNode[] = []
    for (const group of this.orderChoices(MenuNavigation.algorithmGroups)) {
      buttons.push(
        <button className="structure-choice" key={group.kind} data-algorithm-group={group.kind} onClick={this.handleAlgorithmGroup}>
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
    for (const group of this.orderChoices(this.props.navigation.getGroups())) {
      buttons.push(
        <button
          className="structure-choice"
          key={group.kind}
          data-group={group.kind}
          onClick={this.handleGroup}
        >
          <span className="choice-copy">
              <strong title={group.name}>{group.name}</strong>
              <small title={group.description}>{group.description}</small>
          </span>
        </button>,
      )
    }
    return buttons
  }

  private renderStructures(): ReactNode[] {
    const buttons: ReactNode[] = []
    for (const structure of this.orderChoices(this.props.navigation.getStructures())) {
      let description = structure.description
      const technologyCount = StructureInformation.get(structure.kind).technologies.length
      const hasTechnologies = technologyCount > 0
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
          className={`structure-choice${examples ? ' structure-choice-examples' : ' structure-choice--labeled'}`}
          key={structure.kind}
          data-kind={structure.kind}
          onClick={this.handleSelection}
        >
          {!examples && (
            <span className="usage-tags">
              <span
                className={`usage-tag usage-tag--${hasTechnologies ? 'real-systems' : 'educational'}`}
                title={hasTechnologies ? 'Used in one or more technologies listed in the structure description.' : 'No real technologies are listed in the structure description.'}
              >
                {hasTechnologies ? 'Real Systems' : 'Educational'}
              </span>
              {technologyCount >= 3 && (
                <span className="usage-tag usage-tag--popular" title="Has at least three documented real examples.">
                  Popular
                </span>
              )}
            </span>
          )}
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
      case 'advanced-algorithms': return null
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
      case 'advanced-algorithms': return this.renderAdvancedAlgorithmGroups()
    }
  }

  public render() {
    const navigation = this.props.navigation
    const searching = this.props.searchOpen
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
              aria-label={searching ? 'Close search' : 'Close menu'}
              onClick={this.props.onClose}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="m5 5 14 14M19 5 5 19" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <div className="menu-heading-row">
            <h2 id="menu-title" ref={this.title} tabIndex={-1}>
              {searching ? 'Search' : navigation.title}
            </h2>
          </div>
          {!searching && description && <p className="menu-description">{description}</p>}
          {!searching && navigation.screen !== 'categories' && (
            <button className="back-button" onClick={this.props.onBack}>
              <span aria-hidden="true">←</span> {navigation.backLabel}
            </button>
          )}
          <div id="menu-root-content">
            {searching ? (
              <MenuSearch
                ref={this.search}
                describeAlgorithm={this.props.describeSearchAlgorithm}
                onResultSelected={this.props.onSearchResultSelected}
              />
            ) : <nav aria-label={navigation.title}>{this.renderChoices()}</nav>}
          </div>
        </div>
      </dialog>
    )
  }
}
