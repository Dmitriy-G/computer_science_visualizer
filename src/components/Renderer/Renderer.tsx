import { Component, createRef } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import type {
  Scene,
  SceneEdge,
  SceneNode,
  SceneSlot,
  SceneRegion,
  SceneBounds,
  SceneDetailRange,
} from '../../visualization/Scene.ts'
import './Renderer.css'

interface RendererProps {
  readonly scene: Scene | null
  readonly onOpenMenu: () => void
  readonly children?: ReactNode
  readonly emptyState?: ReactNode
  readonly showPseudocode?: boolean
}

interface RendererState {
  readonly actualSize: boolean
  readonly showSizeControls: boolean
  readonly viewportHeight: number | null
  readonly camera: SceneBounds | null
}

export default class Renderer extends Component<
  RendererProps,
  RendererState
> {
  public state: RendererState = { actualSize: false, showSizeControls: false, viewportHeight: null, camera: this.props.scene?.camera?.from ?? null }
  private readonly content = createRef<HTMLDivElement>()
  private readonly tools = createRef<HTMLDivElement>()
  private readonly codeHost = createRef<HTMLDivElement>()
  private readonly viewport = createRef<HTMLDivElement>()
  private readonly svg = createRef<SVGSVGElement>()
  private resizeObserver: ResizeObserver | null = null
  private cameraFrame: number | null = null
  private readonly reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

  public componentDidMount(): void {
    this.resizeObserver = new ResizeObserver(this.updateSizeControls)
    this.observeLayout()
    window.addEventListener('resize', this.updateSizeControls)
    window.addEventListener('scroll', this.updateSizeControls, { passive: true })
    window.visualViewport?.addEventListener('resize', this.updateSizeControls)
    window.visualViewport?.addEventListener('scroll', this.updateSizeControls)
    this.updateSizeControls()
    this.reducedMotion.addEventListener('change', this.motionChanged)
    this.moveCamera()
  }

  public componentDidUpdate(previous: RendererProps, previousState: RendererState): void {
    this.observeLayout()
    this.updateSizeControls()
    const cameraChanged = previous.scene?.camera !== this.props.scene?.camera
    if (cameraChanged) this.moveCamera()
    if (previous.scene?.kind !== this.props.scene?.kind || cameraChanged && this.props.scene?.camera) {
      this.viewport.current?.scrollTo({ left: 0, top: 0, behavior: 'instant' })
      if (this.state.actualSize) this.setState({ actualSize: false })
      return
    }
    if (previous.scene !== this.props.scene || previousState.viewportHeight !== this.state.viewportHeight) this.revealCurrentNode()
  }

  public componentWillUnmount(): void {
    this.resizeObserver?.disconnect()
    this.resizeObserver = null
    this.cancelCamera()
    this.reducedMotion.removeEventListener('change', this.motionChanged)
    window.removeEventListener('resize', this.updateSizeControls)
    window.removeEventListener('scroll', this.updateSizeControls)
    window.visualViewport?.removeEventListener('resize', this.updateSizeControls)
    window.visualViewport?.removeEventListener('scroll', this.updateSizeControls)
  }

  private cancelCamera(): void {
    if (this.cameraFrame !== null) window.cancelAnimationFrame(this.cameraFrame)
    this.cameraFrame = null
  }

  private motionChanged = (): void => {
    if (this.reducedMotion.matches) {
      this.cancelCamera()
      this.setState({ camera: this.props.scene?.camera?.to ?? null })
    }
  }

  private moveCamera(): void {
    this.cancelCamera()
    const camera = this.props.scene?.camera
    if (!camera || this.reducedMotion.matches) {
      this.setState({ camera: camera?.to ?? null })
      return
    }
    const from = this.state.camera ?? camera.from
    const to = camera.to
    if (from.x === to.x && from.y === to.y && from.width === to.width && from.height === to.height) {
      this.setState({ camera: to })
      return
    }
    let started: number | null = null
    const advance = (time: number): void => {
      started ??= time
      const progress = Math.min(1, (time - started) / 1400)
      const eased = progress * progress * (3 - 2 * progress)
      const width = from.width * (to.width / from.width) ** eased
      const height = from.height * (to.height / from.height) ** eased
      const centerX = from.x + from.width / 2 + (to.x + to.width / 2 - from.x - from.width / 2) * eased
      const centerY = from.y + from.height / 2 + (to.y + to.height / 2 - from.y - from.height / 2) * eased
      this.setState({ camera: { x: centerX - width / 2, y: centerY - height / 2, width, height } })
      this.cameraFrame = progress < 1 ? window.requestAnimationFrame(advance) : null
    }
    this.cameraFrame = window.requestAnimationFrame(advance)
  }

  private detailOpacity(range: SceneDetailRange | undefined, width: number): number {
    if (!range) return 1
    return Math.max(0, Math.min(1, (range.startWidth - width) / (range.startWidth - range.endWidth)))
  }

  public getScene(): Scene | null {
    const scene = this.props.scene
    if (!scene?.camera || !this.state.camera) return scene
    return { ...scene, camera: { from: this.state.camera, to: this.state.camera } }
  }

  private observeLayout(): void {
    for (const element of [this.content.current, this.tools.current, this.codeHost.current, this.viewport.current]) {
      if (element) this.resizeObserver?.observe(element)
    }
  }

  private updateSizeControls = (): void => {
    const scene = this.props.scene
    const viewport = this.viewport.current
    let viewportHeight = this.state.viewportHeight
    let showSizeControls = false
    if (viewport) {
      const bounds = viewport.getBoundingClientRect()
      const visible = window.visualViewport
      const visibleTop = visible?.offsetTop ?? 0
      const visibleHeight = visible?.height ?? window.innerHeight
      const bottomPadding = this.content.current ? Number.parseFloat(window.getComputedStyle(this.content.current).paddingBottom) || 0 : 0
      viewportHeight = Math.max(160, Math.floor(visibleTop + visibleHeight - Math.max(visibleTop, bounds.top) - bottomPadding))
      showSizeControls = !!scene && bounds.width > 0 &&
        (scene.width > viewport.clientWidth + 1 || scene.height > viewportHeight + 1)
    }
    const actualSize = showSizeControls && this.state.actualSize
    if (showSizeControls !== this.state.showSizeControls || actualSize !== this.state.actualSize || viewportHeight !== this.state.viewportHeight) {
      this.setState({ showSizeControls, actualSize, viewportHeight })
    }
  }

  private fitDiagram = (): void => {
    this.setState({ actualSize: false }, () => {
      this.viewport.current?.scrollTo({ left: 0, top: 0, behavior: 'instant' })
    })
  }

  private showActualSize = (): void => {
    this.setState({ actualSize: true }, () => this.revealCurrentNode())
  }

  private revealCurrentNode(): void {
    const scene = this.props.scene
    const viewport = this.viewport.current
    const svg = this.svg.current
    if (!this.state.actualSize || !scene || !viewport || !svg || !scene.focusId) return
    const transform = svg.getScreenCTM()
    if (!transform) return
    for (const node of scene.nodes) {
      if (node.id !== scene.focusId) continue
      const point = new DOMPoint(node.x, node.y).matrixTransform(transform)
      const bounds = viewport.getBoundingClientRect()
      const x = point.x - bounds.left + viewport.scrollLeft
      const y = point.y - bounds.top + viewport.scrollTop
      const marginX = Math.min(70, viewport.clientWidth / 4)
      const marginY = Math.min(70, viewport.clientHeight / 4)
      const outsideX = x < viewport.scrollLeft + marginX ||
        x > viewport.scrollLeft + viewport.clientWidth - marginX
      const outsideY = y < viewport.scrollTop + marginY ||
        y > viewport.scrollTop + viewport.clientHeight - marginY
      if (outsideX || outsideY) {
        viewport.scrollTo({
          left: outsideX ? Math.max(0, x - viewport.clientWidth / 2) : viewport.scrollLeft,
          top: outsideY ? Math.max(0, y - viewport.clientHeight / 2) : viewport.scrollTop,
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)')
            .matches
            ? 'instant'
            : 'smooth',
        })
      }
      return
    }
  }

  private renderEdge(
    edge: SceneEdge,
    nodes: ReadonlyMap<string, SceneNode>,
  ): ReactNode {
    const from = nodes.get(edge.from)
    const to = nodes.get(edge.to)
    if (!from || !to) return null
    if (edge.from === edge.to) {
      const radius = edge.loopRadius ?? 62
      return <g key={edge.id} className="scene-edge-group" style={{ opacity: edge.opacity }}>
        <path className={`scene-edge${edge.highlighted ? ' scene-edge-highlighted' : ''}`}
          d={`M ${from.x - 27} ${from.y - 27} C ${from.x - radius} ${from.y - radius * 2} ${from.x + radius} ${from.y - radius * 2} ${from.x + 27} ${from.y - 27}`}
          markerEnd={edge.directed ? `url(#${edge.highlighted ? 'active-arrow' : 'default-arrow'})` : undefined} />
        {edge.label && <text className="node-label graph-edge-label" textAnchor="middle" x={from.x} y={from.y - radius * 1.5 - 12}>{edge.label}</text>}
      </g>
    }
    const dx = to.x - from.x
    const dy = to.y - from.y
    const length = Math.hypot(dx, dy) || 1
    const fromOffset = this.edgeOffset(from, dx / length, dy / length)
    const toOffset = this.edgeOffset(to, dx / length, dy / length) + 3
    const x1 = from.x + (dx / length) * fromOffset
    const y1 = from.y + (dy / length) * fromOffset
    const x2 = to.x - (dx / length) * toOffset
    const y2 = to.y - (dy / length) * toOffset
    const bend = edge.bend ?? 0
    const middleX = (x1 + x2) / 2
    const middleY = (y1 + y2) / 2
    const curve = edge.curveOffset ?? 0
    const normalX = -dy / length
    const normalY = dx / length
    return (
      <g key={edge.id} className="scene-edge-group" style={{ opacity: edge.opacity }}>
        {edge.message && <title>{edge.message}</title>}
        <path
          className={`scene-edge${edge.highlighted ? ' scene-edge-highlighted' : ''}${edge.flow ? ' scene-edge-flow' : ''}`}
          d={curve ? `M ${x1} ${y1} Q ${middleX + normalX * curve * 2} ${middleY + normalY * curve * 2} ${x2} ${y2}` : bend ? `M ${x1} ${y1} Q ${middleX} ${middleY + bend * 2} ${x2} ${y2}` : `M ${x1} ${y1} L ${x2} ${y2}`}
          markerEnd={
            edge.directed
              ? `url(#${edge.highlighted ? 'active-arrow' : 'default-arrow'})`
              : undefined
          }
        />
        {edge.label && (
          <text className="node-label graph-edge-label" textAnchor="middle" x={middleX + normalX * curve} y={middleY + normalY * curve + bend + (bend > 0 ? 14 : -8)}>
            {edge.label}
          </text>
        )}
      </g>
    )
  }

  private edgeOffset(node: SceneNode, dx: number, dy: number): number {
    if (node.keys === undefined && node.width === undefined && node.height === undefined) return 39
    return Math.min(
      (node.width ?? 66) / 2 / Math.max(Math.abs(dx), 0.0001),
      (node.height ?? 66) / 2 / Math.max(Math.abs(dy), 0.0001),
    ) + 6
  }

  private renderPageKeys(node: SceneNode): ReactNode[] {
    const elements: ReactNode[] = []
    const keys = node.keys ?? []
    const width = node.width ?? 66
    const height = node.height ?? 66
    const cellWidth = width / Math.max(1, keys.length)
    for (let index = 0; index < keys.length; index += 1) {
      const x = -width / 2 + cellWidth * (index + 0.5)
      elements.push(<text key={`key-${index}`} className="node-value page-key" x={x} textAnchor="middle" dominantBaseline="central" style={{ fontSize: Math.min(18, (cellWidth - 16) * 1.6 / String(keys[index]).length) }}>{keys[index]}</text>)
      if (index > 0) {
        const divider = -width / 2 + cellWidth * index
        elements.push(<line key={`divider-${index}`} className="page-divider" x1={divider} y1={-height / 2 + 8} x2={divider} y2={height / 2 - 8} />)
      }
    }
    if (!keys.length) elements.push(<text key="empty" className="node-value page-key" textAnchor="middle" dominantBaseline="central">∅</text>)
    return elements
  }

  private renderNode(node: SceneNode, circular: boolean, showExplicitStatus = false, overview = false): ReactNode {
    const width = node.width ?? 66
    const height = node.height ?? 66
    const sideLabels = node.labelPlacement === 'right'
    const style: CSSProperties = {
      transform: `translate(${node.x}px, ${node.y}px)`,
      opacity: node.opacity,
    }
    return (
      <g
        key={node.id}
        className={`scene-node tone-${node.tone}${node.nodeColor ? ` tree-color-${node.nodeColor}` : ''}${overview ? ' scene-node--overview' : ''}`}
        style={style}
        aria-label={`${node.keys ? node.keys.length ? node.keys.join(', ') : 'empty page' : node.displayValue ?? node.value}, ${node.label}${node.tone === 'active' ? ', current node' : ''}${showExplicitStatus && node.status ? `, ${node.status}` : ''}`}
      >
        <rect
          className="node-halo"
          x={-width / 2 - 10}
          y={-height / 2 - 10}
          width={width + 20}
          height={height + 20}
          rx={circular ? (width + 20) / 2 : 22}
        />
        <rect
          className="node-body"
          x={-width / 2}
          y={-height / 2}
          width={width}
          height={height}
          rx={circular ? width / 2 : 13}
        />
        {node.keys ? this.renderPageKeys(node) : <text
          className="node-value"
          textAnchor="middle"
          dominantBaseline="central"
          style={{ fontSize: Math.min(overview ? 42 : 21, (width - 16) * 1.6 / Math.max(1, String(node.displayValue ?? node.value).length)) }}
        >
          {node.displayValue ?? node.value}
        </text>}
        <text
          className="node-label"
          textAnchor={sideLabels ? 'start' : 'middle'}
          x={sideLabels ? width / 2 + 16 : 0}
          y={sideLabels ? 4 : height / 2 + 28}
        >
          {node.label}
        </text>
        {(node.tone !== 'default' || showExplicitStatus && node.status !== undefined) && (
          <text
            className="node-status"
            textAnchor={sideLabels ? 'end' : 'middle'}
            x={sideLabels ? -width / 2 - 16 : 0}
            y={sideLabels ? 4 : -height / 2 - 23}
          >
            {node.status ??
              (node.tone === 'active'
                ? 'CURRENT'
                : node.tone === 'new'
                  ? 'NEW'
                  : 'VISITED')}
          </text>
        )}
      </g>
    )
  }

  private renderSlot(slot: SceneSlot): ReactNode {
    return (
      <g
        key={slot.id}
        className={`scene-slot${slot.empty ? ' slot-empty' : ''}${slot.highlighted ? ' slot-highlighted' : ''}`}
        style={{
          transform: `translate(${slot.x}px, ${slot.y}px)`,
          opacity: slot.opacity,
        }}
      >
        <rect x="-39" y="-39" width="78" height="78" rx="15" />
        <text className="node-label" textAnchor="middle" y="61">
          {slot.label}
        </text>
      </g>
    )
  }

  private renderElements(scene: Scene, cameraWidth: number): ReactNode {
    const nodeMap = new Map<string, SceneNode>()
    const elements: ReactNode[] = []
    const cpu = scene.regions?.some((region) => region.id === 'core' || region.id === 'cpu-die') ?? false
    const hdd = scene.regions?.some((region) => region.id === 'hdd-enclosure') ?? false
    const ssd = scene.regions?.some((region) => region.id === 'ssd-pcb') ?? false
    const ram = scene.regions?.some((region) => region.id === 'ram-pcb') ?? false
    const schematic = cpu || hdd || ssd || ram
    for (const region of scene.regions ?? []) elements.push(this.renderRegion(region))
    for (const slot of scene.slots ?? []) elements.push(this.renderSlot(slot))
    for (const node of scene.nodes) nodeMap.set(node.id, node)
    for (const path of scene.paths ?? []) elements.push(
      <g key={`path-${path.id}`}>
        <path className={`scene-edge${path.highlighted ? ' scene-edge-highlighted' : ''}${path.dashed ? ' scene-edge--dashed' : ''}`} d={path.d} markerStart={path.bidirectional ? `url(#${path.highlighted ? 'active-arrow' : 'default-arrow'})` : undefined} markerEnd={path.directed ? `url(#${path.highlighted ? 'active-arrow' : 'default-arrow'})` : undefined} style={{ fill: path.fill, stroke: path.highlighted ? undefined : path.stroke, strokeWidth: path.strokeWidth }} role="img" aria-label={path.label}><title>{path.label}</title></path>
        {path.caption && <text className="scene-path-caption" x={path.caption.x} y={path.caption.y}>{path.caption.text}</text>}
      </g>,
    )
    for (const edge of scene.edges)
      elements.push(this.renderEdge(edge, nodeMap))
    for (const region of scene.regions ?? []) {
      const lines: string[] = []
      const label = region.shortLabel ?? region.label
      const fontSize = region.level === 'system' ? 32 : 26
      if (scene.kind === 'system-overview' || scene.kind === 'cpu-hardware' || hdd || ssd || ram) {
        const limit = Math.max(schematic ? 8 : 12, Math.floor((region.width - 32) / (schematic ? fontSize * 0.62 : 9)))
        let line = ''
        for (const word of label.split(' ')) {
          if (line && line.length + word.length + 1 > limit) {
            lines.push(line)
            line = word
          } else line += `${line ? ' ' : ''}${word}`
        }
        if (line) lines.push(line)
      } else lines.push(label)
      const titles: ReactNode[] = []
      for (let index = 0; index < lines.length; index += 1) titles.push(<tspan key={index} x={region.x + 16} dy={index === 0 ? 0 : schematic ? 28 : 19}>{lines[index]}</tspan>)
      elements.push(
        <text key={`region-title-${region.id}`} className={`scene-region-title${region.level === 'system' ? ' scene-region-title--system' : ''}${schematic ? ' scene-region-title--schematic' : ''}`} x={region.x + 16} y={region.y + (schematic ? region.level === 'system' ? 36 : 30 : 29)}>
          {region.shortLabel && <title>{region.label}</title>}
          {titles}
        </text>,
      )
    }
    const circular = scene.kind === 'directed-graph' || scene.kind === 'weighted-graph' || scene.kind === 'dag' || scene.kind === 'multigraph' || scene.kind === 'graph' || scene.kind === 'binary-tree' || scene.kind === 'avl-tree' || scene.kind === 'red-black-tree'
    for (const node of scene.nodes)
      elements.push(this.renderNode(node, circular || scene.countLabel === 'vertices' && node.id.startsWith(`${scene.kind}-v`), scene.kind === 'hardware-system' || scene.kind === 'cpu-hardware' || scene.kind === 'hardware-component', scene.kind === 'system-overview'))
    for (const layer of scene.layers ?? []) {
      const opacity = this.detailOpacity(layer.reveal, cameraWidth) * (layer.conceal ? 1 - this.detailOpacity(layer.conceal, cameraWidth) : 1)
      elements.push(
        <g key={`layer-${layer.id}`} transform={`translate(${layer.x} ${layer.y}) scale(${layer.scale})`} opacity={opacity} aria-hidden={opacity === 0 ? true : undefined}>
          {this.renderElements(layer.scene, cameraWidth)}
        </g>,
      )
    }
    return elements
  }

  private renderScene(scene: Scene): ReactNode {
    const camera = scene.camera ? this.state.camera ?? scene.camera.from : { x: 0, y: 0, width: scene.width, height: scene.height }
    const ssd = scene.regions?.some((region) => region.id === 'ssd-pcb') ?? false
    const nodeMap = new Map<string, SceneNode>()
    for (const node of scene.nodes) nodeMap.set(node.id, node)
    return (
      <svg
        ref={this.svg}
        className={`scene-svg${scene.kind === 'hardware-system' || scene.kind === 'cpu-hardware' ? ' scene-svg--hardware-flow' : ''}${ssd ? ' scene-svg--ssd' : ''}${this.state.actualSize ? ' scene-svg--actual' : ''}`}
        width={scene.width}
        height={scene.height}
        viewBox={`${camera.x} ${camera.y} ${camera.width} ${camera.height}`}
        preserveAspectRatio={scene.camera ? 'xMidYMid meet' : 'xMidYMin meet'}
        style={this.state.actualSize ? { width: scene.width, height: scene.height } : { maxWidth: scene.width }}
        role="img"
        aria-labelledby="scene-title scene-description"
      >
        <title id="scene-title">
          {`${scene.kind.replaceAll('-', ' ')} visualization`}
        </title>
        <desc id="scene-description">
          {scene.count} {scene.countLabel ?? 'elements'}.
          {scene.kind !== 'system-overview' && ' Blue marks the current node, teal marks visited nodes, and amber marks the new node.'}
          {this.describeHardwareFlow(scene, nodeMap)}
          {this.state.showSizeControls && ' Use Fit diagram to see the full structure, or Actual size to scroll through its details.'}
        </desc>
        <defs>
          <marker
            id="default-arrow"
            viewBox="0 0 8 8"
            refX="7"
            refY="4"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 1 1 L 7 4 L 1 7" />
          </marker>
          <marker
            id="active-arrow"
            viewBox="0 0 8 8"
            refX="7"
            refY="4"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 1 1 L 7 4 L 1 7" />
          </marker>
        </defs>
        {this.renderElements(scene, camera.width)}
      </svg>
    )
  }

  private renderRegion(region: SceneRegion): ReactNode {
    return <g key={`region-${region.id}`} className={`scene-region scene-region--${region.role}${region.level === 'system' ? ' scene-region--system' : ''}${region.color ? ` scene-region--color-${region.color}` : ''}`} role="group" aria-label={region.label}>
      <rect x={region.x} y={region.y} width={region.width} height={region.height} rx="16" />
    </g>
  }

  private describeHardwareFlow(scene: Scene, nodes: ReadonlyMap<string, SceneNode>): string {
    if (!scene.regions) return ''
    const descriptions: string[] = []
    for (const region of scene.regions) descriptions.push(region.label)
    for (const edge of scene.edges) {
      if (edge.highlighted) descriptions.push(`${edge.message ?? edge.label}: ${nodes.get(edge.from)?.label} to ${nodes.get(edge.to)?.label}`)
    }
    return ` Hardware regions and current transactions: ${descriptions.join('. ')}.`
  }

  public render() {
    const scene = this.props.scene
    const packageScene = scene?.countLabel === 'CPU functional components'
      ? scene.layers?.find((layer) => layer.id === 'cpu-components')?.scene ?? scene : null
    const coreScene = packageScene?.layers?.find((layer) => layer.id === 'cpu-core')?.scene
    const flowScene = coreScene ?? scene
    let transfer: SceneEdge | undefined
    let local: SceneNode | undefined
    if (flowScene?.kind === 'hardware-system' || flowScene?.kind === 'cpu-hardware') {
      for (const edge of flowScene.edges) if (edge.highlighted) transfer = edge
      if (!transfer) {
        for (const node of flowScene.nodes) if (node.id === flowScene.focusId) local = node
      }
    }
    return (
      <section className={`renderer${scene?.kind === 'system-overview' ? ' renderer--overview' : ''}`} aria-label="Visualization workspace">
        <div className="renderer-content" ref={this.content}>
          {this.props.children}
          <div className="renderer-stage">
            {scene && (
              <div className={`diagram-tools${coreScene ? ' diagram-tools--cpu' : ''}`} ref={this.tools}>
                {(scene.kind !== 'system-overview' || coreScene) && <div className="scene-legend" role="group" aria-label="Node states">
                  <span>
                    <i className="legend-dot current" />
                    Current
                  </span>
                  <span>
                    <i className="legend-dot visited" />
                    Visited
                  </span>
                  <span>
                    <i className="legend-dot added" />
                    New node
                  </span>
                </div>}
                {this.state.showSizeControls && (
                  <div className="diagram-size-controls" role="group" aria-label="Diagram size">
                    <button
                      type="button"
                      onClick={this.fitDiagram}
                      aria-label="Fit diagram"
                      title="Fit diagram"
                      aria-pressed={!this.state.actualSize}
                      aria-controls="diagram-viewport"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                        <path d="M8 3H3v5M16 3h5v5M21 16v5h-5M8 21H3v-5" />
                        <rect x="7" y="7" width="10" height="10" rx="1" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={this.showActualSize}
                      aria-label="Actual size"
                      title="Actual size"
                      aria-pressed={this.state.actualSize}
                      aria-controls="diagram-viewport"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                        <path d="M14 4h6v6M20 4l-7 7M10 20H4v-6M4 20l7-7" />
                      </svg>
                    </button>
                  </div>
                )}
                {(scene.kind === 'hardware-system' || scene.kind === 'cpu-hardware' || coreScene) && (
                  <div className="hardware-transfer" role="status" aria-live="polite" aria-atomic="true">
                    {transfer ? <>
                      <svg width="30" height="16" viewBox="0 0 30 16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" focusable="false">
                        <path d="M1 8h26" strokeDasharray="4 3" />
                        <path d="m22 3 6 5-6 5" />
                      </svg>
                      <span>{transfer.message ?? transfer.label}</span>
                    </> : local ? <span>Local update: {local.label} = {local.displayValue ?? local.value}{local.status ? ` (${local.status})` : ''}</span> : <span>{coreScene ? 'No active transfer' : 'Initial state · no transfer'}</span>}
                  </div>
                )}
              </div>
            )}
            {this.props.showPseudocode && <div id="renderer-code" className="renderer-code-host" ref={this.codeHost} />}
            <div
              id="diagram-viewport"
              className="renderer-viewport"
              ref={this.viewport}
              style={{ height: this.state.viewportHeight ?? undefined }}
              tabIndex={scene ? 0 : -1}
              role={scene ? 'region' : undefined}
              aria-label={scene ? 'Scrollable data structure canvas' : undefined}
            >
              {scene ? (
                this.renderScene(scene)
              ) : (
                <div className="empty-canvas">
                  {this.props.emptyState ?? (
                    <>
                      <span className="empty-diagram" aria-hidden="true">
                        □<span>—</span>□<span>—</span>□
                      </span>
                      <h1>Make the invisible visible.</h1>
                      <p>Choose a data structure to bring it to life.</p>
                      <button className="text-button" onClick={this.props.onOpenMenu}>
                        Open the menu <span aria-hidden="true">↗</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    )
  }
}
