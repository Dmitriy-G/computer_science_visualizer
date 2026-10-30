import { PureComponent, createRef } from 'react'
import type { MouseEvent, ReactNode } from 'react'
import { ActionCatalog } from '../../../visualization/ActionCatalog.ts'
import type { ActionKind } from '../../../visualization/ActionCatalog.ts'
import { StructureCatalog } from '../../../visualization/StructureCatalog.ts'
import type { StructureKind } from '../../../visualization/Scene.ts'
import './ActionMenu.css'

interface ActionMenuProps {
  readonly structure: StructureKind
  readonly selectedAction: ActionKind | null
  readonly onActionSelected: (action: ActionKind) => void
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
      buttons.push(
        <button
          className="canvas-action"
          key={action.kind}
          ref={buttons.length === 0 ? this.firstAction : undefined}
          data-action={action.kind}
          onClick={this.selectAction}
          aria-current={selected ? 'true' : undefined}
        >
          <span className="canvas-action-heading">
            <strong>{action.title}</strong>
            {selected && <span className="canvas-action-selected">Selected</span>}
          </span>
          <span className="canvas-action-description">{action.description}</span>
        </button>,
      )
    }
    return buttons
  }

  public render() {
    return (
      <aside className="action-menu" aria-labelledby="action-menu-title">
        <span className="eyebrow">Available actions</span>
        <h2 id="action-menu-title">{StructureCatalog.getName(this.props.structure)}</h2>
        <p className="action-menu-summary">Choose an action to explore step by step.</p>
        <nav aria-label="Data structure actions">{this.renderActions()}</nav>
      </aside>
    )
  }
}
