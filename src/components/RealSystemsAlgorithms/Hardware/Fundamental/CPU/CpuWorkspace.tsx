import { Component, createRef } from 'react'
import type { MouseEvent, ReactNode } from 'react'
import type { Scene } from '../../../../../visualization/Scene.ts'
import Renderer from '../../../../Renderer/Renderer.tsx'
import { CpuAlgorithmCatalog } from './CpuAlgorithmCatalog.ts'
import { CpuModel } from './CpuModel.ts'
import type { CpuAlgorithmKind } from './CpuModel.ts'
import { CpuLayout } from './CpuLayout.ts'
import BranchPrediction from './BranchPrediction/BranchPrediction.tsx'
import OutOfOrder from './OutOfOrder/OutOfOrder.tsx'
import RegisterRenaming from './RegisterRenaming/RegisterRenaming.tsx'
import ReturnStack from './ReturnStack/ReturnStack.tsx'
import '../../../../MainMenu/ActionMenu/ActionMenu.css'
import './CpuWorkspace.css'

interface CpuWorkspaceProps {
  readonly algorithm: CpuAlgorithmKind
  readonly onBack: () => void
  readonly onSelect: (algorithm: CpuAlgorithmKind) => void
  readonly onInformation: (algorithm: CpuAlgorithmKind) => void
  readonly onReset: () => void
}

interface CpuWorkspaceState {
  readonly scene: Scene
  readonly active: boolean
  readonly running: boolean
}

export default class CpuWorkspace extends Component<CpuWorkspaceProps, CpuWorkspaceState> {
  private readonly model = new CpuModel()
  private readonly heading = createRef<HTMLHeadingElement>()
  private readonly firstAlgorithm = createRef<HTMLButtonElement>()
  public state: CpuWorkspaceState = {
    scene: this.preview(), active: true, running: true,
  }

  private preview(): Scene {
    return CpuLayout.create(this.model)
  }

  public componentDidMount(): void { this.heading.current?.focus() }

  public reset(): void {
    this.setState({ active: false, running: false, scene: this.preview() }, () => {
      this.props.onReset()
      this.firstAlgorithm.current?.focus()
    })
  }

  private updateScene = (scene: Scene): void => { this.setState({ scene }) }
  private complete = (): void => { this.setState({ running: false }) }

  private select = (event: MouseEvent<HTMLButtonElement>): void => {
    if (this.state.running) return
    for (const choice of CpuAlgorithmCatalog.choices) if (choice.kind === event.currentTarget.dataset.algorithm) this.props.onSelect(choice.kind)
  }

  private information = (event: MouseEvent<HTMLButtonElement>): void => {
    for (const choice of CpuAlgorithmCatalog.choices) if (choice.kind === event.currentTarget.dataset.algorithm) this.props.onInformation(choice.kind)
  }

  private renderAlgorithms(): ReactNode[] {
    const rows: ReactNode[] = []
    for (const choice of CpuAlgorithmCatalog.choices) rows.push(
      <div className="canvas-action-row" key={choice.kind}>
        <button type="button" className="canvas-action canvas-action--labeled" ref={rows.length === 0 ? this.firstAlgorithm : undefined} data-algorithm={choice.kind} onClick={this.select} disabled={this.state.running} aria-current={this.state.active && this.props.algorithm === choice.kind ? 'true' : undefined}>
          <span className="usage-tags"><span className="usage-tag usage-tag--real-systems">Real Systems</span></span>
          <span className="canvas-action-heading"><strong title={choice.name}>{choice.name}</strong></span>
          <span className="canvas-action-description" title={choice.description}>{choice.description}</span>
        </button>
        <button type="button" className="action-info-button" data-algorithm={choice.kind} onClick={this.information} aria-label={`About ${choice.name}`} aria-haspopup="dialog" aria-controls="algorithm-overview">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 11v6" strokeLinecap="round" />
            <circle cx="12" cy="7.5" r="0.8" fill="currentColor" />
          </svg>
        </button>
      </div>,
    )
    return rows
  }

  private renderPlayback(): ReactNode {
    if (!this.state.active) return null
    const props = { model: this.model, onSceneChange: this.updateScene, onComplete: this.complete }
    switch (this.props.algorithm) {
      case 'branch-prediction': return <BranchPrediction {...props} />
      case 'out-of-order': return <OutOfOrder {...props} />
      case 'register-renaming': return <RegisterRenaming {...props} />
      case 'return-stack': return <ReturnStack {...props} />
    }
  }

  public render(): ReactNode {
    return <>
      <Renderer scene={this.state.scene} onOpenMenu={this.props.onBack}>
        <aside className="action-menu" aria-label="CPU hardware algorithms">
          <button type="button" className="text-button action-menu-back-button" onClick={this.props.onBack}>← CPU</button>
          <h2 ref={this.heading} tabIndex={-1}>CPU Hardware</h2>
          <p className="action-menu-summary">Explore registers, caches, and execution inside one CPU core. Directional arrows show instruction, operand, result, and prediction flows. Information explains each processor example and the teaching model’s limits.</p>
          <nav aria-label="CPU hardware mechanisms">{this.renderAlgorithms()}</nav>
        </aside>
      </Renderer>
      {this.renderPlayback()}
    </>
  }
}
