import { Component, createRef } from 'react'
import MainMenu from '../MainMenu/MainMenu.tsx'
import Renderer from '../Renderer/Renderer.tsx'
import AddInTheMiddle from '../DataStructures/LinkedList/AddInTheMiddle/AddInTheMiddle.tsx'
import { InsertionAnimation } from '../DataStructures/LinkedList/AddInTheMiddle/InsertionAnimation.ts'
import ArrayAddInTheMiddle from '../DataStructures/Array/AddInTheMiddle/AddInTheMiddle.tsx'
import { InsertionAnimation as ArrayInsertionAnimation } from '../DataStructures/Array/AddInTheMiddle/InsertionAnimation.ts'
import { FixedArray } from '../DataStructures/Array/FixedArray.ts'
import { LinkedList } from '../DataStructures/LinkedList/LinkedList.ts'
import { BinaryTree } from '../DataStructures/BinaryTree/BinaryTree.ts'
import TreeInsert from '../DataStructures/BinaryTree/Insert/Insert.tsx'
import { InsertionAnimation as TreeInsertionAnimation } from '../DataStructures/BinaryTree/Insert/InsertionAnimation.ts'
import { StructureCatalog } from '../../visualization/StructureCatalog.ts'
import type { Scene, StructureKind } from '../../visualization/Scene.ts'
import type { AlgorithmInformation } from '../../visualization/AlgorithmInformation.ts'
import './App.css'

interface AppState {
  readonly selected: StructureKind | null
  readonly menuOpen: boolean
  readonly menuScreen: 'structures' | 'actions'
  readonly scene: Scene | null
  readonly actionOpen: boolean
  readonly actionSession: number
  readonly algorithmInformation: AlgorithmInformation | null
}

export default class App extends Component<Record<string, never>, AppState> {
  private list = LinkedList.createDefault()
  private array = FixedArray.createDefault()
  private tree = BinaryTree.createDefault()
  private readonly menuButton = createRef<HTMLButtonElement>()
  private readonly actionPanel = createRef<AddInTheMiddle>()
  private readonly arrayActionPanel = createRef<ArrayAddInTheMiddle>()
  private readonly treeActionPanel = createRef<TreeInsert>()

  constructor(props: Record<string, never>) {
    super(props)
    this.state = {
      selected: null,
      menuOpen: false,
      menuScreen: 'structures',
      scene: null,
      actionOpen: false,
      actionSession: 0,
      algorithmInformation: null,
    }
  }

  private openMenu = (): void => {
    this.actionPanel.current?.pausePlayback()
    this.arrayActionPanel.current?.pausePlayback()
    this.treeActionPanel.current?.pausePlayback()
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
    this.array = FixedArray.createDefault()
    this.tree = BinaryTree.createDefault()
    this.setState({
      selected: kind,
      scene: StructureCatalog.createPreview(
        kind,
        this.list,
        this.array,
        this.tree,
      ),
      actionOpen: false,
      menuScreen: 'actions',
      algorithmInformation: null,
      actionSession: this.state.actionSession + 1,
    })
  }

  private selectAction = (): void => {
    if (
      this.state.selected !== 'array' &&
      this.state.selected !== 'linked-list' &&
      this.state.selected !== 'binary-tree'
    )
      return
    this.setState({
      actionOpen: true,
      menuOpen: false,
      algorithmInformation:
        this.state.selected === 'array'
          ? ArrayInsertionAnimation.describe(this.array.length)
          : this.state.selected === 'binary-tree'
            ? TreeInsertionAnimation.describe(this.tree.length)
            : InsertionAnimation.describe(this.list.length),
      actionSession: this.state.actionSession + 1,
    })
  }

  private resetStructure = (): void => {
    if (this.state.selected === null) return
    this.list = LinkedList.createDefault()
    this.array = FixedArray.createDefault()
    this.tree = BinaryTree.createDefault()
    this.setState({
      scene: StructureCatalog.createPreview(
        this.state.selected,
        this.list,
        this.array,
        this.tree,
      ),
      actionOpen: false,
      actionSession: this.state.actionSession + 1,
      algorithmInformation: null,
    })
  }

  private updateScene = (scene: Scene, list: LinkedList): void => {
    this.list = list
    this.setState({ scene })
  }

  private updateArrayScene = (scene: Scene, array: FixedArray): void => {
    this.array = array
    this.setState({ scene })
  }

  private updateTreeScene = (scene: Scene, tree: BinaryTree): void => {
    this.tree = tree
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
          {selected && (
            <>
              <span className="header-divider" />
              <span className="selected-name">
                {StructureCatalog.getName(selected)}
              </span>
            </>
          )}
          {scene && <span className="count-badge">{scene.count} elements</span>}
          {selected && (
            <button
              className="primary-button reset-structure"
              onClick={this.resetStructure}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M4 10a8 8 0 1 1 1.8 7M4 4v6h6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Reset
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
          <Renderer
            scene={scene}
            algorithmInformation={this.state.algorithmInformation}
            onOpenMenu={this.openMenu}
          />
          {this.state.actionOpen && selected === 'linked-list' && (
            <AddInTheMiddle
              key={this.state.actionSession}
              ref={this.actionPanel}
              list={this.list}
              onSceneChange={this.updateScene}
            />
          )}
          {this.state.actionOpen && selected === 'array' && (
            <ArrayAddInTheMiddle
              key={this.state.actionSession}
              ref={this.arrayActionPanel}
              array={this.array}
              onSceneChange={this.updateArrayScene}
            />
          )}
          {this.state.actionOpen && selected === 'binary-tree' && (
            <TreeInsert
              key={this.state.actionSession}
              ref={this.treeActionPanel}
              tree={this.tree}
              onSceneChange={this.updateTreeScene}
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
                  : selected === 'array'
                    ? 'Choose an action to build a new fixed array, one copy at a time.'
                    : selected === 'binary-tree'
                      ? 'Compare values from the root and connect a new leaf in the binary search tree.'
                      : 'Explore the 10-element preview. Animated actions for this structure are coming next.'}
              </p>
              <button className="primary-button" onClick={this.openMenu}>
                {selected !== 'graph'
                  ? 'Choose an action'
                  : 'Open menu'}{' '}
                <span aria-hidden="true">↗</span>
              </button>
            </section>
          )}
        </main>
      </div>
    )
  }
}
