import { Component, createRef } from 'react'
import MainMenu from '../MainMenu/MainMenu.tsx'
import Renderer from '../renderer/Renderer.tsx'
import AddInTheMiddle from '../DataStructures/LinkedList/AddInTheMiddle/AddInTheMiddle.tsx'
import { LinkedList } from '../DataStructures/LinkedList/LinkedList.ts'
import { StructureCatalog } from '../../visualization/StructureCatalog.ts'
import type { Scene, StructureKind } from '../../visualization/Scene.ts'
import './App.css'

interface AppState {
  readonly selected: StructureKind | null
  readonly menuOpen: boolean
  readonly menuScreen: 'structures' | 'actions'
  readonly scene: Scene | null
  readonly actionOpen: boolean
  readonly actionSession: number
}

export default class App extends Component<Record<string, never>, AppState> {
  private list = LinkedList.createDefault()
  private readonly menuButton = createRef<HTMLButtonElement>()
  private readonly actionPanel = createRef<AddInTheMiddle>()

  constructor(props: Record<string, never>) {
    super(props)
    this.state = {
      selected: null,
      menuOpen: false,
      menuScreen: 'structures',
      scene: null,
      actionOpen: false,
      actionSession: 0,
    }
  }

  private openMenu = (): void => {
    this.actionPanel.current?.pausePlayback()
    this.setState({
      menuOpen: true,
      menuScreen: this.state.selected ? 'actions' : 'structures',
    })
  }

  private closeMenu = (): void => {
    this.setState({ menuOpen: false }, this.restoreMenuFocus)
  }

  private restoreMenuFocus = (): void => {
    this.menuButton.current?.focus()
  }

  private showStructures = (): void => {
    this.setState({ menuScreen: 'structures' })
  }

  private selectStructure = (kind: StructureKind): void => {
    this.list = LinkedList.createDefault()
    this.setState({
      selected: kind,
      scene: StructureCatalog.createPreview(kind, this.list),
      actionOpen: false,
      menuScreen: 'actions',
      actionSession: this.state.actionSession + 1,
    })
  }

  private selectAction = (): void => {
    this.setState({
      actionOpen: true,
      menuOpen: false,
      actionSession: this.state.actionSession + 1,
    })
  }

  private resetStructure = (): void => {
    if (this.state.selected === null) return
    this.list = LinkedList.createDefault()
    this.setState({
      scene: StructureCatalog.createPreview(this.state.selected, this.list),
      actionOpen: false,
      actionSession: this.state.actionSession + 1,
    })
  }

  private updateScene = (scene: Scene, list: LinkedList): void => {
    this.list = list
    this.setState({ scene })
  }

  public render() {
    const { selected, scene } = this.state
    return (
      <div className="application">
        <header className="app-header">
          <button
            className="menu-trigger icon-button"
            ref={this.menuButton}
            onClick={this.openMenu}
            aria-label="Open visualization menu"
            aria-haspopup="dialog"
            aria-expanded={this.state.menuOpen}
            aria-controls="main-menu"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M4 6h16M4 12h16M4 18h16"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <div className="brand">
            <span className="brand-mark">ds.</span>
            <span>
              Data structures
              <span className="brand-caption">Visualize the idea.</span>
            </span>
          </div>
          <span className="header-divider" />
          <span className="selected-name">
            {selected ? StructureCatalog.getName(selected) : 'Empty canvas'}
          </span>
          {scene && <span className="count-badge">{scene.count} elements</span>}
          {selected && (
            <button
              className="text-button reset-structure"
              onClick={this.resetStructure}
            >
              Reset to 10 nodes
            </button>
          )}
        </header>

        <MainMenu
          open={this.state.menuOpen}
          screen={this.state.menuScreen}
          selected={selected}
          onClose={this.closeMenu}
          onStructureSelected={this.selectStructure}
          onShowStructures={this.showStructures}
          onActionSelected={this.selectAction}
        />

        <main className="workspace">
          <Renderer scene={scene} onOpenMenu={this.openMenu} />
          {this.state.actionOpen && selected === 'linked-list' && (
            <AddInTheMiddle
              key={this.state.actionSession}
              ref={this.actionPanel}
              list={this.list}
              onSceneChange={this.updateScene}
            />
          )}
          {selected && !this.state.actionOpen && (
            <section className="workspace-hint" aria-label="Next step">
              <div>
                <span className="eyebrow">Structure loaded</span>
                <h1>{StructureCatalog.getName(selected)}</h1>
              </div>
              <p>
                {selected === 'linked-list'
                  ? 'Choose an action to watch every pointer change, one step at a time.'
                  : 'Explore the 10-element preview. Animated actions for this structure are coming next.'}
              </p>
              <button className="primary-button" onClick={this.openMenu}>
                {selected === 'linked-list' ? 'Choose an action' : 'Open menu'}{' '}
                <span aria-hidden="true">↗</span>
              </button>
            </section>
          )}
        </main>
      </div>
    )
  }
}
