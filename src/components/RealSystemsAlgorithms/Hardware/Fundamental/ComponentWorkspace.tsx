import { Component, Fragment, createRef } from 'react'
import type { MouseEvent, ReactNode } from 'react'
import type { Scene } from '../../../../visualization/Scene.ts'
import Renderer from '../../../Renderer/Renderer.tsx'
import type { HardwareOverviewChoice } from './HardwareOverviewChoice.ts'
import type { ActionViewProps } from '../../../ActionPlayback/ActionView.tsx'
import { AdvancedAlgorithmCatalog } from '../../../MainMenu/AdvancedAlgorithmCatalog.ts'
import type { HardwareFundamentalGroupKind } from '../../../MainMenu/AdvancedAlgorithmCatalog.ts'
import { HardwareSnapshot } from './HardwareSnapshot.ts'
import type { HardwareOverviewKind } from './HardwareOverviewKind.ts'
import OverviewTags from '../../../OverviewTags/OverviewTags.tsx'
import '../../../MainMenu/ActionMenu/ActionMenu.css'
import './ComponentWorkspace.css'

export type ComponentPlaybackProps = ActionViewProps<HardwareSnapshot>

export interface ComponentWorkspaceProps {
  readonly session: number
  readonly previewScene: Scene | null
  readonly algorithm: HardwareOverviewKind | null
  readonly onBack: () => void
  readonly onSelect: (algorithm: HardwareOverviewKind) => void
  readonly onInformation: (algorithm: HardwareOverviewKind) => void
  readonly onReset: () => void
}

interface ComponentWorkspaceState {
  readonly scene: Scene | null
  readonly active: boolean
  readonly running: boolean
}

export default abstract class ComponentWorkspace extends Component<ComponentWorkspaceProps, ComponentWorkspaceState> {
  protected abstract readonly group: HardwareFundamentalGroupKind
  protected abstract readonly choices: readonly HardwareOverviewChoice[]
  protected abstract renderLesson(props: ComponentPlaybackProps): ReactNode

  private readonly model = new HardwareSnapshot()
  private readonly renderer = createRef<Renderer>()
  private readonly heading = createRef<HTMLHeadingElement>()
  private readonly firstAlgorithm = createRef<HTMLButtonElement>()
  public state: ComponentWorkspaceState = {
    scene: null,
    active: this.props.algorithm !== null,
    running: this.props.algorithm !== null,
  }

  public componentDidMount(): void {
    if (this.props.algorithm === null) this.focusFirstAction()
    else this.heading.current?.focus()
  }

  public componentDidUpdate(previous: ComponentWorkspaceProps): void {
    if (previous.session === this.props.session) return
    const active = this.props.algorithm !== null
    this.setState({ active, running: active }, () => {
      if (active) this.heading.current?.focus({ preventScroll: true })
    })
  }

  protected presentScene(scene: Scene | null): Scene | null { return scene }

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

  public getScene(): Scene | null {
    return this.renderer.current?.getScene() ?? this.state.scene ?? this.props.previewScene
  }

  private updateScene = (scene: Scene): void => { this.setState({ scene }) }
  private complete = (): void => { this.setState({ running: false }) }

  private select = (event: MouseEvent<HTMLButtonElement>): void => {
    if (this.state.running) return
    for (const choice of this.choices) if (choice.kind === event.currentTarget.dataset.algorithm) this.props.onSelect(choice.kind)
  }

  private information = (event: MouseEvent<HTMLButtonElement>): void => {
    for (const choice of this.choices) if (choice.kind === event.currentTarget.dataset.algorithm) this.props.onInformation(choice.kind)
  }

  private renderAlgorithms(): ReactNode[] {
    const rows: ReactNode[] = []
    for (const choice of this.choices) rows.push(
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
    return <Fragment key={this.props.session}>{this.renderLesson({ model: this.model, onSceneChange: this.updateScene, onComplete: this.complete })}</Fragment>
  }

  public render(): ReactNode {
    const group = AdvancedAlgorithmCatalog.getGroup(this.group)
    const parent = AdvancedAlgorithmCatalog.getGroup('hardware-fundamental')
    return <>
      <Renderer ref={this.renderer} scene={this.presentScene(this.state.scene ?? this.props.previewScene)} onOpenMenu={this.props.onBack} emptyState={<></>}>
        <aside className="action-menu" aria-label={`${group.name} hardware overviews`}>
          <button type="button" className="text-button action-menu-back-button" onClick={this.props.onBack}>← {parent.name}</button>
          <h2 ref={this.heading} tabIndex={-1}>{parent.name} / {group.name}</h2>
          <nav aria-label={`${group.name} hardware mechanisms`}>{this.renderAlgorithms()}</nav>
        </aside>
      </Renderer>
      {this.renderPlayback()}
    </>
  }
}
