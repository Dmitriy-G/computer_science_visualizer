import { Component, createRef } from 'react'
import type { MouseEvent, ReactNode } from 'react'
import type { Scene } from '../../../../../visualization/Scene.ts'
import Renderer from '../../../../Renderer/Renderer.tsx'
import { DiskAlgorithmCatalog } from './DiskAlgorithmCatalog.ts'
import { DiskWorkload } from './DiskWorkload.ts'
import type { DiskAlgorithmKind } from './DiskWorkload.ts'
import { DiskLayout } from './DiskLayout.ts'
import MqDeadline from './MqDeadline/MqDeadline.tsx'
import BFQ from './BFQ/BFQ.tsx'
import Kyber from './Kyber/Kyber.tsx'
import '../../../../MainMenu/ActionMenu/ActionMenu.css'
import './DiskWorkspace.css'

interface DiskWorkspaceProps {
  readonly algorithm: DiskAlgorithmKind
  readonly onBack: () => void
  readonly onSelect: (algorithm: DiskAlgorithmKind) => void
  readonly onInformation: (algorithm: DiskAlgorithmKind) => void
  readonly onReset: () => void
}

interface DiskWorkspaceState {
  readonly scene: Scene
  readonly active: boolean
  readonly running: boolean
}

export default class DiskWorkspace extends Component<DiskWorkspaceProps, DiskWorkspaceState> {
  private readonly model = DiskWorkload.createDefault()
  private readonly heading = createRef<HTMLHeadingElement>()
  private readonly firstAlgorithm = createRef<HTMLButtonElement>()
  public state: DiskWorkspaceState = {
    scene: DiskLayout.create(this.model, 'Ten requests from three processes. All requests enter at virtual tick 0.'),
    active: true, running: true,
  }

  public componentDidMount(): void {
    this.heading.current?.focus()
  }

  public reset(): void {
    this.setState({
      active: false, running: false,
      scene: DiskLayout.create(this.model, 'Default workload restored. Choose a scheduler to run its simulation.'),
    }, () => {
      this.props.onReset()
      this.firstAlgorithm.current?.focus()
    })
  }

  private updateScene = (scene: Scene): void => {
    this.setState({ scene })
  }

  private complete = (): void => {
    this.setState({ running: false })
  }

  private select = (event: MouseEvent<HTMLButtonElement>): void => {
    if (this.state.running) return
    for (const choice of DiskAlgorithmCatalog.choices) {
      if (choice.kind === event.currentTarget.dataset.algorithm) this.props.onSelect(choice.kind)
    }
  }

  private information = (event: MouseEvent<HTMLButtonElement>): void => {
    for (const choice of DiskAlgorithmCatalog.choices) {
      if (choice.kind === event.currentTarget.dataset.algorithm) this.props.onInformation(choice.kind)
    }
  }

  private renderAlgorithms(): ReactNode[] {
    const rows: ReactNode[] = []
    for (const choice of DiskAlgorithmCatalog.choices) {
      rows.push(
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
    }
    return rows
  }

  private renderPlayback(): ReactNode {
    if (!this.state.active) return null
    const props = { model: this.model, onSceneChange: this.updateScene, onComplete: this.complete }
    switch (this.props.algorithm) {
      case 'mq-deadline': return <MqDeadline {...props} />
      case 'bfq': return <BFQ {...props} />
      case 'kyber': return <Kyber {...props} />
    }
  }

  public render(): ReactNode {
    return <>
      <Renderer scene={this.state.scene} onOpenMenu={this.props.onBack}>
        <aside className="action-menu disk-algorithm-menu" aria-label="Disk scheduling algorithms">
          <button type="button" className="text-button action-menu-back-button" onClick={this.props.onBack}>← Disks</button>
          <h2 ref={this.heading} tabIndex={-1}>Disk I/O Scheduling</h2>
          <p className="action-menu-summary">Linux scheduler lessons with a simulated device. Open an algorithm’s information for production references and model limits.</p>
          <nav aria-label="Disk schedulers">{this.renderAlgorithms()}</nav>
        </aside>
      </Renderer>
      {this.renderPlayback()}
    </>
  }
}
