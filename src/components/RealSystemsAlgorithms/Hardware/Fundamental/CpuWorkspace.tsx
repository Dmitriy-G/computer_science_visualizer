import { Component, createRef } from 'react'
import type { MouseEvent, ReactNode } from 'react'
import type { Scene } from '../../../../visualization/Scene.ts'
import Renderer from '../../../Renderer/Renderer.tsx'
import { CpuAlgorithmCatalog } from './CpuAlgorithmCatalog.ts'
import { AdvancedAlgorithmCatalog } from '../../../MainMenu/AdvancedAlgorithmCatalog.ts'
import type { HardwareFundamentalGroupKind } from '../../../MainMenu/AdvancedAlgorithmCatalog.ts'
import { CpuModel } from './CpuModel.ts'
import type { CpuAlgorithmKind } from './CpuModel.ts'
import OverviewTags from '../../../OverviewTags/OverviewTags.tsx'
import BranchPrediction from './BranchPrediction/BranchPrediction.tsx'
import OutOfOrder from './OutOfOrder/OutOfOrder.tsx'
import RegisterRenaming from './RegisterRenaming/RegisterRenaming.tsx'
import ReturnStack from './ReturnStack/ReturnStack.tsx'
import Latch from './Latch/Latch.tsx'
import SramCell from './SramCell/SramCell.tsx'
import DramRow from './DramRow/DramRow.tsx'
import HddSector from './HddSector/HddSector.tsx'
import NandCell from './NandCell/NandCell.tsx'
import SsdFtl from './SsdFtl/SsdFtl.tsx'
import SsdGarbageCollection from './SsdGarbageCollection/SsdGarbageCollection.tsx'
import SsdWearLeveling from './SsdWearLeveling/SsdWearLeveling.tsx'
import '../../../MainMenu/ActionMenu/ActionMenu.css'
import './CpuWorkspace.css'

interface CpuWorkspaceProps {
  readonly group: HardwareFundamentalGroupKind
  readonly algorithm: CpuAlgorithmKind | null
  readonly onBack: () => void
  readonly onSelect: (algorithm: CpuAlgorithmKind) => void
  readonly onInformation: (algorithm: CpuAlgorithmKind) => void
  readonly onReset: () => void
}

interface CpuWorkspaceState {
  readonly scene: Scene | null
  readonly active: boolean
  readonly running: boolean
}

export default class CpuWorkspace extends Component<CpuWorkspaceProps, CpuWorkspaceState> {
  private readonly model = new CpuModel()
  private readonly heading = createRef<HTMLHeadingElement>()
  private readonly firstAlgorithm = createRef<HTMLButtonElement>()
  public state: CpuWorkspaceState = {
    scene: null,
    active: this.props.algorithm !== null,
    running: this.props.algorithm !== null,
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
    this.setState({ active: false, running: false, scene: null }, () => {
      this.props.onReset()
      this.firstAlgorithm.current?.focus()
    })
  }

  private updateScene = (scene: Scene): void => { this.setState({ scene }) }
  private complete = (): void => { this.setState({ running: false }) }

  private select = (event: MouseEvent<HTMLButtonElement>): void => {
    if (this.state.running) return
    for (const choice of CpuAlgorithmCatalog.forGroup(this.props.group)) if (choice.kind === event.currentTarget.dataset.algorithm) this.props.onSelect(choice.kind)
  }

  private information = (event: MouseEvent<HTMLButtonElement>): void => {
    for (const choice of CpuAlgorithmCatalog.forGroup(this.props.group)) if (choice.kind === event.currentTarget.dataset.algorithm) this.props.onInformation(choice.kind)
  }

  private renderAlgorithms(): ReactNode[] {
    const rows: ReactNode[] = []
    for (const choice of CpuAlgorithmCatalog.forGroup(this.props.group)) rows.push(
      <div className="canvas-action-row" key={choice.kind}>
        <button type="button" className="canvas-action canvas-action--labeled" ref={rows.length === 0 ? this.firstAlgorithm : undefined} data-algorithm={choice.kind} onClick={this.select} disabled={this.state.running} aria-current={this.state.active && this.props.algorithm === choice.kind ? 'true' : undefined}>
          <OverviewTags components={choice.components} architectures={choice.architectures} devices={choice.devices} />
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
      case 'latch': return <Latch {...props} />
      case 'sram-cell': return <SramCell {...props} />
      case 'dram-row': return <DramRow {...props} />
      case 'hdd-sector': return <HddSector {...props} />
      case 'nand-cell': return <NandCell {...props} />
      case 'ssd-ftl': return <SsdFtl {...props} />
      case 'ssd-garbage-collection': return <SsdGarbageCollection {...props} />
      case 'ssd-wear-leveling': return <SsdWearLeveling {...props} />
      case 'branch-prediction': return <BranchPrediction {...props} />
      case 'out-of-order': return <OutOfOrder {...props} />
      case 'register-renaming': return <RegisterRenaming {...props} />
      case 'return-stack': return <ReturnStack {...props} />
    }
  }

  public render(): ReactNode {
    const group = AdvancedAlgorithmCatalog.getGroup(this.props.group)
    return <>
      <Renderer scene={this.state.scene} onOpenMenu={this.props.onBack} emptyState={<>
        <h1>Choose a {group.name} overview.</h1>
        <p>Select an overview from the panel to start, or use its info button to learn more.</p>
      </>}>
        <aside className="action-menu" aria-label={`${group.name} hardware overviews`}>
          <button type="button" className="text-button action-menu-back-button" onClick={this.props.onBack}>← Fundamental</button>
          <h2 ref={this.heading} tabIndex={-1}>Hardware / Fundamental / {group.name}</h2>
          <nav aria-label={`${group.name} hardware mechanisms`}>{this.renderAlgorithms()}</nav>
        </aside>
      </Renderer>
      {this.renderPlayback()}
    </>
  }
}
