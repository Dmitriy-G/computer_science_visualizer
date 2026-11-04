import { Component, createRef } from 'react'
import type { MouseEvent, SyntheticEvent, ReactNode } from 'react'
import { StructureCatalog } from '../../visualization/StructureCatalog.ts'
import type { StructureGroupKind } from '../../visualization/StructureCatalog.ts'
import { MenuNavigation } from './MenuNavigation.ts'
import type { MenuCategoryKind, AlgorithmGroupKind } from './MenuNavigation.ts'
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
  readonly onGroupSelected: (group: StructureGroupKind) => void
  readonly onAlgorithmGroupSelected: (group: AlgorithmGroupKind) => void
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

  private renderSearchIcon = (result: MenuSearchResult): ReactNode => {
    return this.renderStructureIcon(result.structure, result.symbol)
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

  private orderChoices<T extends MenuChoice>(choices: readonly T[]): T[] {
    const ordered = [...choices]
    ordered.sort((first, second) =>
      first.name.localeCompare(second.name, 'en', { sensitivity: 'base' }) ||
      first.kind.localeCompare(second.kind, 'en'),
    )
    return ordered
  }

  private renderAlgorithmGroups(): ReactNode[] {
    const buttons: ReactNode[] = []
    for (const group of this.orderChoices(MenuNavigation.algorithmGroups)) {
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
    for (const category of this.orderChoices(MenuNavigation.categories)) {
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
    for (const group of this.orderChoices(StructureCatalog.groups)) {
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
      case 'suffix-array':
      case 'fm-index':
      case 'sparse-table':
      case 'adjacency-matrix':
        drawing = <><rect x="3" y="3" width="26" height="26" rx="2" /><path d="M3 12h26M3 21h26M12 3v26M21 3v26m-5-20v1m9 7v1M7 25v1" /></>
        break
      case 'adjacency-list':
      case 'edge-list':
      case 'compressed-sparse-row':
        drawing = <><path d="M3 7h26M3 16h20M3 25h26m-19-21v6m0 3v6m0 3v6" />{kind === 'compressed-sparse-row' && <path d="M18 4v6m0 12v6m8-24v6m0 12v6" />}</>
        break
      case 'bipartite-graph':
        drawing = <><path d="m7 6 18 19M7 25 25 6M7 6h18" /><circle cx="6" cy="6" r="4" /><circle cx="26" cy="6" r="4" /><circle cx="6" cy="26" r="4" /><circle cx="26" cy="26" r="4" /></>
        break
      case 'hypergraph':
        drawing = <><path d="M16 14 5 5m11 9L27 5m-11 9v13" /><rect x="11" y="10" width="10" height="10" rx="1" /><circle cx="5" cy="5" r="3" /><circle cx="27" cy="5" r="3" /><circle cx="16" cy="27" r="3" /></>
        break
      case 'complete-graph':
      case 'tree-graph':
      case 'flow-network':
      case 'functional-graph':
        drawing = <><path d="M16 7 6 25M16 7l10 18" />{kind !== 'tree-graph' && <path d="M6 25h20" />}<circle cx="16" cy="6" r="4" /><circle cx="6" cy="26" r="4" /><circle cx="26" cy="26" r="4" />{(kind === 'flow-network' || kind === 'functional-graph') && <path d="m11 12-1 6 5-2m3 9 4 1-3 3" />}</>
        break
      case 'priority-queue':
      case 'binary-max-heap':
      case 'binomial-heap':
      case 'fibonacci-heap':
      case 'pairing-heap':
      case 'leftist-heap':
      case 'skew-heap':
      case 'indexed-priority-queue':
        drawing = <><path d="M16 7 7 22m9-15 9 15" /><circle cx="16" cy="6" r="4" /><circle cx="7" cy="25" r="4" /><circle cx="25" cy="25" r="4" />{kind === 'indexed-priority-queue' && <path d="M2 14h6m16 0h6" />}</>
        break
      case 'consistent-hashing-ring':
        drawing = <><circle cx="16" cy="16" r="12" /><circle cx="16" cy="4" r="3" /><circle cx="5" cy="22" r="3" /><circle cx="27" cy="22" r="3" /><path d="m27 12 2 4 2-4" /></>
        break
      case 'monotonic-queue':
        drawing = <><path d="M3 27h26M7 10v13m9-8v8m9-3v3M3 5h25m-4-3 4 3-4 3" /></>
        break
      case 'skip-list':
        drawing = <><path d="M3 8h26M3 24h26M7 8v16m9-16v16m9-16v16" /><circle cx="7" cy="24" r="3" /><circle cx="16" cy="24" r="3" /><circle cx="25" cy="24" r="3" /></>
        break
      case 'unrolled-linked-list':
        drawing = <><rect x="2" y="8" width="11" height="17" rx="2" /><rect x="20" y="8" width="10" height="17" rx="2" /><path d="M2 16h11m7 0h10M13 12h7m-3-3 3 3-3 3" /></>
        break
      case 'xor-linked-list':
        drawing = <><rect x="2" y="9" width="8" height="14" rx="2" /><rect x="22" y="9" width="8" height="14" rx="2" /><circle cx="16" cy="16" r="4" /><path d="m13 13 6 6m0-6-6 6M10 16h2m8 0h2" /></>
        break
      case 'gap-buffer':
        drawing = <><rect x="2" y="7" width="28" height="19" rx="2" /><path d="M9 7v19m14-19v19M15 11v11m3-11v11" strokeDasharray="2 3" /></>
        break
      case 'rope':
        drawing = <><path d="M16 8 7 21m9-13 9 13" /><circle cx="16" cy="7" r="4" /><rect x="1" y="21" width="12" height="8" rx="2" /><rect x="19" y="21" width="12" height="8" rx="2" /></>
        break
      case 'bit-set':
        drawing = <><rect x="2" y="7" width="28" height="19" rx="2" /><path d="M9 7v19m7-19v19m7-19v19M5 12v9m14-9v9" /></>
        break
      case 'disjoint-set':
        drawing = <><circle cx="9" cy="7" r="4" /><circle cx="24" cy="7" r="4" /><circle cx="5" cy="26" r="3" /><circle cx="15" cy="26" r="3" /><circle cx="27" cy="26" r="3" /><path d="m6 23 3-12m5 12L9 11m18 12-3-12" /></>
        break
      case 'ordered-set':
        drawing = <><circle cx="16" cy="6" r="4" /><circle cx="6" cy="25" r="4" /><circle cx="26" cy="25" r="4" /><path d="M14 10 8 21m10-11 6 11M2 16h6m16 0h6" /></>
        break
      case 'multiset':
        drawing = <><rect x="2" y="5" width="12" height="22" rx="2" /><rect x="18" y="5" width="12" height="22" rx="2" /><path d="M5 12h6m-6 7h6m10-7h6m-6 7h6m-3-10v6" /></>
        break
      case 'interval-set':
        drawing = <><path d="M2 16h28M4 7v6m0-3h12m0-3v6m4 6v6m0-3h9m0-3v6" /></>
        break
      case 'sparse-array':
        drawing = <><rect x="2" y="9" width="7" height="14" rx="1" /><rect x="23" y="9" width="7" height="14" rx="1" /><path d="M13 16h1m4 0h1" /></>
        break
      case 'free-list':
        drawing = <><rect x="2" y="4" width="9" height="9" rx="2" /><rect x="21" y="4" width="9" height="9" rx="2" /><rect x="12" y="21" width="9" height="9" rx="2" /><path d="M11 8h10m4 5-6 8M12 25 6 13" /></>
        break
      case 'open-addressing-hash-table':
      case 'separate-chaining-hash-table':
      case 'robin-hood-hash-table':
      case 'cuckoo-hash-table':
      case 'hopscotch-hashing':
      case 'extendible-hashing':
      case 'linear-hashing':
      case 'perfect-hash-table':
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
      case 'counting-bloom-filter':
      case 'cuckoo-filter':
      case 'quotient-filter':
      case 'count-min-sketch':
      case 'hyperloglog':
        drawing = (
          <>
            <rect x="3" y="4" width="26" height="24" rx="3" />
            <path d="M3 12h26M3 20h26M12 4v24M20 4v24" />
            <path d="m6 8 2 1m7 7 2 1m6 7 2 1" />
          </>
        )
        break
      case 'reservoir-sampling-buffer':
        drawing = (
          <>
            <path d="M3 7h26M8 3v8m8-8v8m8-8v8M8 12l8 7 8-7" />
            <rect x="5" y="21" width="22" height="8" rx="2" />
            <path d="M12 21v8m8-8v8" />
          </>
        )
        break
      case 'suffix-automaton':
      case 'aho-corasick-automaton':
      case 'dawg':
      case 'radix-tree':
      case 'ternary-search-tree':
      case 'suffix-tree':
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
      case 'kd-tree':
      case 'quadtree':
      case 'octree':
      case 'bvh':
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
      case 'general-tree':
      case 'unordered-binary-tree':
      case 'complete-binary-tree':
      case 'threaded-binary-tree':
      case 'splay-tree':
      case 'treap':
      case 'cartesian-tree':
      case 'scapegoat-tree':
      case 'aa-tree':
      case 'interval-tree':
      case 'order-statistic-tree':
      case 'persistent-segment-tree':
      case 'merkle-tree':
      case 'van-emde-boas-tree':
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
      case 'two-three-tree':
      case 'two-three-four-tree':
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
                renderIcon={this.renderSearchIcon}
              />
            ) : <nav aria-label={navigation.title}>{this.renderChoices()}</nav>}
          </div>
        </div>
      </dialog>
    )
  }
}
