import { Component, createRef } from 'react'
import type { MouseEvent, ReactNode } from 'react'
import type { Scene } from '../../../../visualization/Scene.ts'
import Renderer from '../../../Renderer/Renderer.tsx'
import { HardwareAlgorithmCatalog } from './HardwareAlgorithmCatalog.ts'
import { HardwareModel } from './HardwareModel.ts'
import type { HardwareAlgorithmKind } from './HardwareModel.ts'
import { HardwareLayout } from './HardwareLayout.ts'
import OverviewTags from '../../../OverviewTags/OverviewTags.tsx'
import '../../../MainMenu/ActionMenu/ActionMenu.css'
import StoreBuffering from './StoreBuffering/StoreBuffering.tsx'
import MemoryFences from './MemoryFences/MemoryFences.tsx'
import Dmb from './Dmb/Dmb.tsx'
import Dsb from './Dsb/Dsb.tsx'
import AcquireRelease from './AcquireRelease/AcquireRelease.tsx'
import ExclusiveLoop from './ExclusiveLoop/ExclusiveLoop.tsx'
import LseAtomics from './LseAtomics/LseAtomics.tsx'
import LockedAtomics from './LockedAtomics/LockedAtomics.tsx'
import Moesi from './Moesi/Moesi.tsx'
import Mesif from './Mesif/Mesif.tsx'
import Translation from './Translation/Translation.tsx'
import InstructionSync from './InstructionSync/InstructionSync.tsx'
import './HardwareWorkspace.css'

interface HardwareWorkspaceProps {
  readonly algorithm: HardwareAlgorithmKind | null
  readonly onBack: () => void
  readonly onSelect: (algorithm: HardwareAlgorithmKind) => void
  readonly onInformation: (algorithm: HardwareAlgorithmKind) => void
  readonly onReset: () => void
}

interface HardwareWorkspaceState {
  readonly scene: Scene | null
  readonly active: boolean
  readonly running: boolean
}

export default class HardwareWorkspace extends Component<HardwareWorkspaceProps, HardwareWorkspaceState> {
  private readonly model = new HardwareModel()
  private readonly heading = createRef<HTMLHeadingElement>()
  private readonly firstAlgorithm = createRef<HTMLButtonElement>()
  public state: HardwareWorkspaceState = {
    scene: this.props.algorithm ? this.preview() : null,
    active: this.props.algorithm !== null, running: this.props.algorithm !== null,
  }

  private preview(): Scene {
    return HardwareLayout.create(this.model)
  }

  public componentDidMount(): void {
    if (this.props.algorithm === null) this.focusFirstAction()
    else this.heading.current?.focus()
  }

  public focusFirstAction(): void {
    if (this.state.running) this.heading.current?.focus()
    else this.firstAlgorithm.current?.focus()
  }

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
    for (const choice of HardwareAlgorithmCatalog.choices) if (choice.kind === event.currentTarget.dataset.algorithm) this.props.onSelect(choice.kind)
  }

  private information = (event: MouseEvent<HTMLButtonElement>): void => {
    for (const choice of HardwareAlgorithmCatalog.choices) if (choice.kind === event.currentTarget.dataset.algorithm) this.props.onInformation(choice.kind)
  }

  private renderAlgorithms(): ReactNode[] {
    const rows: ReactNode[] = []
    for (const choice of HardwareAlgorithmCatalog.choices) rows.push(
      <div className="canvas-action-row" key={choice.kind}>
        <button type="button" className="canvas-action canvas-action--labeled" ref={rows.length === 0 ? this.firstAlgorithm : undefined} data-algorithm={choice.kind} onClick={this.select} disabled={this.state.running} aria-current={this.state.active && this.props.algorithm === choice.kind ? 'true' : undefined}>
          <OverviewTags components={choice.components} architectures={choice.architectures} />
          <span className="canvas-action-heading"><strong title={choice.name}>{choice.name}</strong></span>
          <span className="canvas-action-description" title={choice.description}>{choice.description}</span>
        </button>
        <button type="button" className="action-info-button" data-algorithm={choice.kind} onClick={this.information} aria-label={`About ${choice.name}`} aria-haspopup="dialog" aria-controls="system-components-overview">
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
    if (!this.state.active || this.props.algorithm === null) return null
    const props = { model: this.model, onSceneChange: this.updateScene, onComplete: this.complete }
    switch (this.props.algorithm) {
      case 'store-buffering': return <StoreBuffering {...props} />
      case 'memory-fences': return <MemoryFences {...props} />
      case 'dmb': return <Dmb {...props} />
      case 'dsb': return <Dsb {...props} />
      case 'acquire-release': return <AcquireRelease {...props} />
      case 'exclusive-loop': return <ExclusiveLoop {...props} />
      case 'lse-atomics': return <LseAtomics {...props} />
      case 'locked-atomics': return <LockedAtomics {...props} />
      case 'moesi': return <Moesi {...props} />
      case 'mesif': return <Mesif {...props} />
      case 'translation': return <Translation {...props} />
      case 'instruction-sync': return <InstructionSync {...props} />
    }
  }

  public render(): ReactNode {
    return <>
      <Renderer scene={this.state.scene} onOpenMenu={this.props.onBack} emptyState={<>
        <h1>Choose a complex overview.</h1>
        <p>Select an overview from the panel to start, or use its info button to learn more.</p>
      </>}>
        <aside className="action-menu" aria-label="Complex hardware mechanisms">
          <button type="button" className="text-button action-menu-back-button" onClick={this.props.onBack}>← Hardware</button>
          <h2 ref={this.heading} tabIndex={-1}>Hardware / Complex</h2>
          <nav aria-label="Complex hardware mechanisms">{this.renderAlgorithms()}</nav>
        </aside>
      </Renderer>
      {this.renderPlayback()}
    </>
  }
}
