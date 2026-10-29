import { Stack } from '../DataStructures/Stack/Stack.ts'
import StackPush from '../DataStructures/Stack/Push/Push.tsx'
import { PushAnimation as StackPushSequence } from '../DataStructures/Stack/Push/PushAnimation.ts'
import StackPop from '../DataStructures/Stack/Pop/Pop.tsx'
import { PopAnimation as StackPopSequence } from '../DataStructures/Stack/Pop/PopAnimation.ts'
import StackPeek from '../DataStructures/Stack/Peek/Peek.tsx'
import { PeekAnimation as StackPeekSequence } from '../DataStructures/Stack/Peek/PeekAnimation.ts'
import StackClear from '../DataStructures/Stack/Clear/Clear.tsx'
import { ClearAnimation as StackClearSequence } from '../DataStructures/Stack/Clear/ClearAnimation.ts'
import StackSearchByValue from '../DataStructures/Stack/SearchByValue/SearchByValue.tsx'
import { SearchAnimation as StackSearchByValueSequence } from '../DataStructures/Stack/SearchByValue/SearchAnimation.ts'
import type { ReactNode } from 'react'
import { ActionCatalog } from '../../visualization/ActionCatalog.ts'
import type { ActionKind } from '../../visualization/ActionCatalog.ts'
import { Graph } from '../DataStructures/Graph/Graph.ts'
import GraphDeleteByValue from '../DataStructures/Graph/DeleteByValue/DeleteByValue.tsx'
import { DeletionAnimation as GraphDeleteByValueSequence } from '../DataStructures/Graph/DeleteByValue/DeletionAnimation.ts'
import GraphSearchByValue from '../DataStructures/Graph/SearchByValue/SearchByValue.tsx'
import { SearchAnimation as GraphSearchByValueSequence } from '../DataStructures/Graph/SearchByValue/SearchAnimation.ts'
import BinaryTreeDeleteByValue from '../DataStructures/BinaryTree/DeleteByValue/DeleteByValue.tsx'
import { DeletionAnimation as BinaryTreeDeleteByValueSequence } from '../DataStructures/BinaryTree/DeleteByValue/DeletionAnimation.ts'
import BinaryTreeSearchByValue from '../DataStructures/BinaryTree/SearchByValue/SearchByValue.tsx'
import { SearchAnimation as BinaryTreeSearchByValueSequence } from '../DataStructures/BinaryTree/SearchByValue/SearchAnimation.ts'
import ArrayDeleteByValue from '../DataStructures/Array/DeleteByValue/DeleteByValue.tsx'
import { DeletionAnimation as ArrayDeleteByValueSequence } from '../DataStructures/Array/DeleteByValue/DeletionAnimation.ts'
import ArraySearchByValue from '../DataStructures/Array/SearchByValue/SearchByValue.tsx'
import { SearchAnimation as ArraySearchByValueSequence } from '../DataStructures/Array/SearchByValue/SearchAnimation.ts'
import ArraySearchByIndex from '../DataStructures/Array/SearchByIndex/SearchByIndex.tsx'
import { SearchAnimation as ArraySearchByIndexSequence } from '../DataStructures/Array/SearchByIndex/SearchAnimation.ts'
import ArrayAddAtEnd from '../DataStructures/Array/AddAtEnd/AddAtEnd.tsx'
import { InsertionAnimation as ArrayAddAtEndSequence } from '../DataStructures/Array/AddAtEnd/InsertionAnimation.ts'
import ArrayAddAtStart from '../DataStructures/Array/AddAtStart/AddAtStart.tsx'
import { InsertionAnimation as ArrayAddAtStartSequence } from '../DataStructures/Array/AddAtStart/InsertionAnimation.ts'
import LinkedListDeleteByValue from '../DataStructures/LinkedList/DeleteByValue/DeleteByValue.tsx'
import { DeletionAnimation as LinkedListDeleteByValueSequence } from '../DataStructures/LinkedList/DeleteByValue/DeletionAnimation.ts'
import LinkedListSearchByValue from '../DataStructures/LinkedList/SearchByValue/SearchByValue.tsx'
import { SearchAnimation as LinkedListSearchByValueSequence } from '../DataStructures/LinkedList/SearchByValue/SearchAnimation.ts'
import LinkedListSearchByIndex from '../DataStructures/LinkedList/SearchByIndex/SearchByIndex.tsx'
import { SearchAnimation as LinkedListSearchByIndexSequence } from '../DataStructures/LinkedList/SearchByIndex/SearchAnimation.ts'
import LinkedListAddAtEnd from '../DataStructures/LinkedList/AddAtEnd/AddAtEnd.tsx'
import { InsertionAnimation as LinkedListAddAtEndSequence } from '../DataStructures/LinkedList/AddAtEnd/InsertionAnimation.ts'
import LinkedListAddAtStart from '../DataStructures/LinkedList/AddAtStart/AddAtStart.tsx'
import { InsertionAnimation as LinkedListAddAtStartSequence } from '../DataStructures/LinkedList/AddAtStart/InsertionAnimation.ts'
import { Component, createRef } from 'react'
import MainMenu from '../MainMenu/MainMenu.tsx'
import { MenuNavigation } from '../MainMenu/MenuNavigation.ts'
import type { StructureGroupKind } from '../../visualization/StructureCatalog.ts'
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
  readonly menu: MenuNavigation
  readonly scene: Scene | null
  readonly actionOpen: boolean
  readonly selectedAction: ActionKind | null
  readonly actionSession: number
  readonly algorithmInformation: AlgorithmInformation | null
}

export default class App extends Component<Record<string, never>, AppState> {
  private list = LinkedList.createDefault()
  private array = FixedArray.createDefault()
  private tree = BinaryTree.createDefault()
  private readonly menuButton = createRef<HTMLButtonElement>()
  private graph = Graph.createDefault()
  private stack = Stack.createDefault()
  private activePanel: { pausePlayback(): void } | null = null

  private setActionPanel = (panel: { pausePlayback(): void } | null): void => {
    this.activePanel = panel
  }

  constructor(props: Record<string, never>) {
    super(props)
    this.state = {
      selected: null,
      menuOpen: false,
      menu: new MenuNavigation(),
      scene: null,
      actionOpen: false,
      selectedAction: null,
      actionSession: 0,
      algorithmInformation: null,
    }
  }

  private openMenu = (): void => {
    this.activePanel?.pausePlayback()
    this.setState({
      menuOpen: true,
      menu: this.state.selected ? MenuNavigation.forStructure(this.state.selected) : new MenuNavigation(),
    })
  }

  private closeMenu = (): void => {
    this.setState({ menuOpen: false }, this.restoreMenuFocus)
  }

  private restoreMenuFocus = (): void => {
    this.menuButton.current?.focus()
  }

  private selectCategory = (): void => {
    this.setState({ menu: this.state.menu.selectCategory() })
  }

  private selectGroup = (group: StructureGroupKind): void => {
    this.setState({ menu: this.state.menu.selectGroup(group) })
  }

  private backInMenu = (): void => {
    this.setState({ menu: this.state.menu.back() })
  }

  private selectStructure = (kind: StructureKind): void => {
    const menu = this.state.menu.selectStructure(kind)
    this.list = LinkedList.createDefault()
    this.array = FixedArray.createDefault()
    this.tree = BinaryTree.createDefault()
    this.graph = Graph.createDefault()
    this.stack = Stack.createDefault()
    this.setState({
      selected: kind,
      scene: StructureCatalog.createPreview(
        kind,
        this.list,
        this.array,
        this.tree,
        this.graph,
        this.stack,
      ),
      actionOpen: false,
      selectedAction: null,
      menu,
      algorithmInformation: null,
      actionSession: this.state.actionSession + 1,
    })
  }

  private selectAction = (action: ActionKind): void => {
    if (!this.state.selected) return
    if (!ActionCatalog.getActions(this.state.selected).some((choice) => choice.kind === action)) return
    this.setState({
      actionOpen: true,
      selectedAction: action,
      menuOpen: false,
      algorithmInformation: this.describeAction(action),
      actionSession: this.state.actionSession + 1,
    })
  }

  private describeAction(action: ActionKind): AlgorithmInformation | null {
    if (this.state.selected === 'stack') {
      switch (action) {
        case 'push': return StackPushSequence.describe(this.stack.length)
        case 'pop': return StackPopSequence.describe(this.stack.length)
        case 'peek': return StackPeekSequence.describe(this.stack.length)
        case 'clear': return StackClearSequence.describe(this.stack.length)
        case 'search-value': return StackSearchByValueSequence.describe(this.stack.length)
      }
    }
    if (this.state.selected === 'linked-list') {
      switch (action) {
        case 'insert-middle': return InsertionAnimation.describe(this.list.length)
        case 'insert-start': return LinkedListAddAtStartSequence.describe(this.list.length)
        case 'insert-end': return LinkedListAddAtEndSequence.describe(this.list.length)
        case 'search-index': return LinkedListSearchByIndexSequence.describe(this.list.length)
        case 'search-value': return LinkedListSearchByValueSequence.describe(this.list.length)
        case 'delete-value': return LinkedListDeleteByValueSequence.describe(this.list.length)
      }
    }
    if (this.state.selected === 'array') {
      switch (action) {
        case 'insert-middle': return ArrayInsertionAnimation.describe(this.array.length)
        case 'insert-start': return ArrayAddAtStartSequence.describe(this.array.length)
        case 'insert-end': return ArrayAddAtEndSequence.describe(this.array.length)
        case 'search-index': return ArraySearchByIndexSequence.describe(this.array.length)
        case 'search-value': return ArraySearchByValueSequence.describe(this.array.length)
        case 'delete-value': return ArrayDeleteByValueSequence.describe(this.array.length)
      }
    }
    if (this.state.selected === 'binary-tree') {
      switch (action) {
        case 'insert': return TreeInsertionAnimation.describe(this.tree.length)
        case 'search-value': return BinaryTreeSearchByValueSequence.describe(this.tree.length)
        case 'delete-value': return BinaryTreeDeleteByValueSequence.describe(this.tree.length)
      }
    }
    if (this.state.selected === 'graph') {
      switch (action) {
        case 'search-value': return GraphSearchByValueSequence.describe(this.graph.length)
        case 'delete-value': return GraphDeleteByValueSequence.describe(this.graph.length)
      }
    }
    return null
  }

  private renderAction(): ReactNode {
    if (!this.state.actionOpen) return null
    if (this.state.selected === 'stack') {
      switch (this.state.selectedAction) {
        case 'push': return <StackPush key={this.state.actionSession} ref={this.setActionPanel} model={this.stack} onSceneChange={this.updateStackScene} />
        case 'pop': return <StackPop key={this.state.actionSession} ref={this.setActionPanel} model={this.stack} onSceneChange={this.updateStackScene} />
        case 'peek': return <StackPeek key={this.state.actionSession} ref={this.setActionPanel} model={this.stack} onSceneChange={this.updateStackScene} />
        case 'clear': return <StackClear key={this.state.actionSession} ref={this.setActionPanel} model={this.stack} onSceneChange={this.updateStackScene} />
        case 'search-value': return <StackSearchByValue key={this.state.actionSession} ref={this.setActionPanel} model={this.stack} onSceneChange={this.updateStackScene} />
      }
    }
    if (this.state.selected === 'linked-list') {
      switch (this.state.selectedAction) {
        case 'insert-middle': return <AddInTheMiddle key={this.state.actionSession} ref={this.setActionPanel} list={this.list} onSceneChange={this.updateScene} />
        case 'insert-start': return <LinkedListAddAtStart key={this.state.actionSession} ref={this.setActionPanel} model={this.list} onSceneChange={this.updateScene} />
        case 'insert-end': return <LinkedListAddAtEnd key={this.state.actionSession} ref={this.setActionPanel} model={this.list} onSceneChange={this.updateScene} />
        case 'search-index': return <LinkedListSearchByIndex key={this.state.actionSession} ref={this.setActionPanel} model={this.list} onSceneChange={this.updateScene} />
        case 'search-value': return <LinkedListSearchByValue key={this.state.actionSession} ref={this.setActionPanel} model={this.list} onSceneChange={this.updateScene} />
        case 'delete-value': return <LinkedListDeleteByValue key={this.state.actionSession} ref={this.setActionPanel} model={this.list} onSceneChange={this.updateScene} />
      }
    }
    if (this.state.selected === 'array') {
      switch (this.state.selectedAction) {
        case 'insert-middle': return <ArrayAddInTheMiddle key={this.state.actionSession} ref={this.setActionPanel} array={this.array} onSceneChange={this.updateArrayScene} />
        case 'insert-start': return <ArrayAddAtStart key={this.state.actionSession} ref={this.setActionPanel} model={this.array} onSceneChange={this.updateArrayScene} />
        case 'insert-end': return <ArrayAddAtEnd key={this.state.actionSession} ref={this.setActionPanel} model={this.array} onSceneChange={this.updateArrayScene} />
        case 'search-index': return <ArraySearchByIndex key={this.state.actionSession} ref={this.setActionPanel} model={this.array} onSceneChange={this.updateArrayScene} />
        case 'search-value': return <ArraySearchByValue key={this.state.actionSession} ref={this.setActionPanel} model={this.array} onSceneChange={this.updateArrayScene} />
        case 'delete-value': return <ArrayDeleteByValue key={this.state.actionSession} ref={this.setActionPanel} model={this.array} onSceneChange={this.updateArrayScene} />
      }
    }
    if (this.state.selected === 'binary-tree') {
      switch (this.state.selectedAction) {
        case 'insert': return <TreeInsert key={this.state.actionSession} ref={this.setActionPanel} tree={this.tree} onSceneChange={this.updateTreeScene} />
        case 'search-value': return <BinaryTreeSearchByValue key={this.state.actionSession} ref={this.setActionPanel} model={this.tree} onSceneChange={this.updateTreeScene} />
        case 'delete-value': return <BinaryTreeDeleteByValue key={this.state.actionSession} ref={this.setActionPanel} model={this.tree} onSceneChange={this.updateTreeScene} />
      }
    }
    if (this.state.selected === 'graph') {
      switch (this.state.selectedAction) {
        case 'search-value': return <GraphSearchByValue key={this.state.actionSession} ref={this.setActionPanel} model={this.graph} onSceneChange={this.updateGraphScene} />
        case 'delete-value': return <GraphDeleteByValue key={this.state.actionSession} ref={this.setActionPanel} model={this.graph} onSceneChange={this.updateGraphScene} />
      }
    }
    return null
  }

  private resetStructure = (): void => {
    if (this.state.selected === null) return
    this.list = LinkedList.createDefault()
    this.array = FixedArray.createDefault()
    this.tree = BinaryTree.createDefault()
    this.graph = Graph.createDefault()
    this.stack = Stack.createDefault()
    this.setState({
      scene: StructureCatalog.createPreview(
        this.state.selected,
        this.list,
        this.array,
        this.tree,
        this.graph,
        this.stack,
      ),
      actionOpen: false,
      selectedAction: null,
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

  private updateGraphScene = (scene: Scene, graph: Graph): void => {
    this.graph = graph
    this.setState({ scene })
  }

  private updateStackScene = (scene: Scene, stack: Stack): void => {
    this.stack = stack
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
          navigation={this.state.menu}
          selected={selected}
          onClose={this.closeMenu}
          onStructureSelected={this.selectStructure}
          onCategorySelected={this.selectCategory}
          onGroupSelected={this.selectGroup}
          onBack={this.backInMenu}
          onActionSelected={this.selectAction}
        />

        <main className="workspace">
          <Renderer
            scene={scene}
            algorithmInformation={this.state.algorithmInformation}
            onOpenMenu={this.openMenu}
          />
          {this.renderAction()}
          {selected && !this.state.actionOpen && (
            <section className="workspace-hint" aria-label="Next step">
              <div>
                <span className="eyebrow">Structure loaded</span>
                <h1>{StructureCatalog.getName(selected)}</h1>
              </div>
              <p>
                Choose an action to explore insertion, search, and deletion step by step.
              </p>
              <button className="primary-button" onClick={this.openMenu}>
                Choose an action{' '}
                <span aria-hidden="true">↗</span>
              </button>
            </section>
          )}
        </main>
      </div>
    )
  }
}
