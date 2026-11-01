import { PureComponent, createRef } from 'react'
import type { ChangeEvent, MouseEvent, ReactNode } from 'react'
import { ActionCatalog } from '../../../visualization/ActionCatalog.ts'
import { ActionInputRequest } from '../../../visualization/ActionInputRequest.ts'
import { AlgorithmTechnologyCatalog } from '../../../visualization/AlgorithmTechnologyCatalog.ts'
import type { ActionKind, ActionScope } from '../../../visualization/ActionCatalog.ts'
import { StructureCatalog } from '../../../visualization/StructureCatalog.ts'
import type { StructureKind } from '../../../visualization/Scene.ts'
import type { AlgorithmInformation } from '../../../visualization/AlgorithmInformation.ts'
import { ActionOrdering } from './ActionOrdering.ts'
import type { ActionOrder } from './ActionOrdering.ts'
import './ActionMenu.css'

interface ActionMenuProps {
  readonly scope: ActionScope
  readonly structure: StructureKind
  readonly selectedAction: ActionKind | null
  readonly actionsDisabled?: boolean
  readonly onBack: () => void
  readonly onActionSelected: (action: ActionKind) => void
  readonly onActionInformationRequested: (action: ActionKind) => void
  readonly onStructureInformationRequested: () => void
  readonly informationForAction: (action: ActionKind) => AlgorithmInformation | null
}

interface ActionMenuState {
  readonly order: ActionOrder
}

export default class ActionMenu extends PureComponent<
  ActionMenuProps,
  ActionMenuState
> {
  public state: ActionMenuState = { order: 'alphabetical' }
  private readonly firstAction = createRef<HTMLButtonElement>()

  public focusFirstAction(): void {
    this.firstAction.current?.focus()
  }

  private selectAction = (event: MouseEvent<HTMLButtonElement>): void => {
    for (const action of ActionCatalog.getScopedActions(this.props.structure, this.props.scope)) {
      if (action.kind === event.currentTarget.dataset.action) {
        this.props.onActionSelected(action.kind)
        return
      }
    }
  }

  private renderActions(): ReactNode[] {
    const buttons: ReactNode[] = []
    const choices = ActionCatalog.getScopedActions(this.props.structure, this.props.scope)
    const actions = this.props.scope === 'overview' ? choices : ActionOrdering.arrange(choices, this.state.order, this.props.informationForAction)
    for (const action of actions) {
      const selected = action.kind === this.props.selectedAction
      const requiresInput = ActionInputRequest.requiresInput(this.props.structure, action.kind)
      const usageLabel = AlgorithmTechnologyCatalog.getLabel(this.props.structure, action.kind, this.props.scope)
      buttons.push(
        <div className="canvas-action-row" key={action.kind}>
          <button
            className={`canvas-action${usageLabel ? ' canvas-action--labeled' : ''}`}
            ref={buttons.length === 0 ? this.firstAction : undefined}
            data-action={action.kind}
            onClick={this.selectAction}
            disabled={this.props.actionsDisabled}
            aria-haspopup={requiresInput ? 'dialog' : undefined}
            aria-controls={requiresInput ? 'action-input-dialog' : undefined}
            aria-current={selected ? 'true' : undefined}
          >
            {usageLabel && (
              <span className={`algorithm-usage-tag algorithm-usage-tag--${usageLabel.kind}`} title={usageLabel.description}>
                {usageLabel.text}
              </span>
            )}
            <span className="canvas-action-heading">
              <strong title={action.title}>{action.title}</strong>
            </span>
            <span className="canvas-action-description" title={action.description}>{action.description}</span>
          </button>
          <button
            className="action-info-button"
            data-action={action.kind}
            onClick={this.showInformation}
            aria-label={`About ${action.title}`}
            aria-haspopup="dialog"
            aria-controls="algorithm-overview"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 11v6" strokeLinecap="round" />
              <circle cx="12" cy="7.5" r="0.8" fill="currentColor" />
            </svg>
          </button>
        </div>,
      )
    }
    return buttons
  }

  private showInformation = (event: MouseEvent<HTMLButtonElement>): void => {
    for (const action of ActionCatalog.getScopedActions(this.props.structure, this.props.scope)) {
      if (action.kind === event.currentTarget.dataset.action) {
        this.props.onActionInformationRequested(action.kind)
        return
      }
    }
  }

  private changeOrder = (event: ChangeEvent<HTMLSelectElement>): void => {
    const order = event.currentTarget.value
    if (order === 'alphabetical' || order === 'average-time' || order === 'average-memory') this.setState({ order })
  }

  public render() {
    const group = StructureCatalog.getGroup(StructureCatalog.getGroupForStructure(this.props.structure))
    const traversal = this.props.scope === 'graph-traversal'
    const sorting = this.props.scope === 'sorting'
    const backTitle = sorting ? 'Sorting' : traversal ? 'Graphs Traversal' : group.name
    return (
      <aside className="action-menu" aria-labelledby="action-menu-title">
        <div className="action-menu-topline">
          <button
            className="back-button action-menu-back-button"
            onClick={this.props.onBack}
            aria-label={`Back to ${backTitle} structures`}
            aria-haspopup="dialog"
            aria-controls="main-menu"
          >
            <span aria-hidden="true">←</span> {backTitle}
          </button>
          <div className="action-menu-tools">
            {(sorting || traversal) && (
              <label className="action-sort-control" title={`Sort algorithm actions: ${ActionOrdering.labels[this.state.order]}. ${ActionOrdering.complexityHint}`}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 6h10M3 12h7M3 18h4M18 5v14m-3-3 3 3 3-3" />
                </svg>
                <select className="action-sort-select" aria-label="Sort algorithm actions" value={this.state.order} onChange={this.changeOrder}>
                  <option value="alphabetical">{ActionOrdering.labels.alphabetical}</option>
                  <option value="average-time">{ActionOrdering.labels['average-time']}</option>
                  <option value="average-memory">{ActionOrdering.labels['average-memory']}</option>
                </select>
              </label>
            )}
            <button
              className="action-info-button structure-info-button"
              onClick={this.props.onStructureInformationRequested}
              aria-label={`About ${StructureCatalog.getName(this.props.structure)}`}
              aria-haspopup="dialog"
              aria-controls="structure-overview"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 11v6" strokeLinecap="round" />
                <circle cx="12" cy="7.5" r="0.8" fill="currentColor" />
              </svg>
            </button>
          </div>
        </div>
        <h2 id="action-menu-title">{StructureCatalog.getName(this.props.structure)}</h2>
        <p className="action-menu-summary">{sorting ? 'Choose a sorting algorithm to explore step by step.' : traversal ? 'Choose a graph algorithm to explore step by step.' : 'Choose an action to explore step by step.'}</p>
        <nav tabIndex={0} aria-label={sorting ? 'Array sorting examples' : traversal ? 'Graph traversal examples' : 'Data structure actions'} aria-busy={Boolean(this.props.actionsDisabled)}>{this.renderActions()}</nav>
      </aside>
    )
  }
}
