import { PureComponent, createRef } from 'react'
import type { MouseEvent, ReactNode } from 'react'
import { ActionCatalog } from '../../../visualization/ActionCatalog.ts'
import { ActionInputRequest } from '../../../visualization/ActionInputRequest.ts'
import type { ActionKind } from '../../../visualization/ActionCatalog.ts'
import { StructureCatalog } from '../../../visualization/StructureCatalog.ts'
import type { StructureKind } from '../../../visualization/Scene.ts'
import './ActionMenu.css'

interface ActionMenuProps {
  readonly structure: StructureKind
  readonly selectedAction: ActionKind | null
  readonly actionsDisabled?: boolean
  readonly onActionSelected: (action: ActionKind) => void
  readonly onActionInformationRequested: (action: ActionKind) => void
  readonly onStructureInformationRequested: () => void
}

export default class ActionMenu extends PureComponent<
  ActionMenuProps,
  Record<string, never>
> {
  private readonly firstAction = createRef<HTMLButtonElement>()

  public focusFirstAction(): void {
    this.firstAction.current?.focus()
  }

  private selectAction = (event: MouseEvent<HTMLButtonElement>): void => {
    for (const action of ActionCatalog.getActions(this.props.structure)) {
      if (action.kind === event.currentTarget.dataset.action) {
        this.props.onActionSelected(action.kind)
        return
      }
    }
  }

  private renderActions(): ReactNode[] {
    const buttons: ReactNode[] = []
    for (const action of ActionCatalog.getActions(this.props.structure)) {
      const selected = action.kind === this.props.selectedAction
      const requiresInput = ActionInputRequest.requiresInput(this.props.structure, action.kind)
      buttons.push(
        <div className="canvas-action-row" key={action.kind}>
          <button
            className="canvas-action"
            ref={buttons.length === 0 ? this.firstAction : undefined}
            data-action={action.kind}
            onClick={this.selectAction}
            disabled={this.props.actionsDisabled}
            aria-haspopup={requiresInput ? 'dialog' : undefined}
            aria-controls={requiresInput ? 'action-input-dialog' : undefined}
            aria-current={selected ? 'true' : undefined}
          >
            <span className="canvas-action-heading">
              <strong>{action.title}</strong>
            </span>
            <span className="canvas-action-description">{action.description}</span>
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
    for (const action of ActionCatalog.getActions(this.props.structure)) {
      if (action.kind === event.currentTarget.dataset.action) {
        this.props.onActionInformationRequested(action.kind)
        return
      }
    }
  }

  public render() {
    return (
      <aside className="action-menu" aria-labelledby="action-menu-title">
        <div className="action-menu-topline">
          <span className="eyebrow">Available actions</span>
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
        <h2 id="action-menu-title">{StructureCatalog.getName(this.props.structure)}</h2>
        <p className="action-menu-summary">Choose an action to explore step by step.</p>
        <nav aria-label="Data structure actions" aria-busy={Boolean(this.props.actionsDisabled)}>{this.renderActions()}</nav>
      </aside>
    )
  }
}
