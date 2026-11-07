import { Component, createRef } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import type {
  Scene,
  SceneEdge,
  SceneNode,
  SceneSlot,
} from '../../visualization/Scene.ts'
import './Renderer.css'

interface RendererProps {
  readonly scene: Scene | null
  readonly onOpenMenu: () => void
  readonly children?: ReactNode
}

interface RendererState {
  readonly actualSize: boolean
  readonly showSizeControls: boolean
}

export default class Renderer extends Component<
  RendererProps,
  RendererState
> {
  public state: RendererState = { actualSize: false, showSizeControls: false }
  private readonly viewport = createRef<HTMLDivElement>()
  private readonly svg = createRef<SVGSVGElement>()
  private resizeObserver: ResizeObserver | null = null

  public componentDidMount(): void {
    this.resizeObserver = new ResizeObserver(this.updateSizeControls)
    if (this.viewport.current) this.resizeObserver.observe(this.viewport.current)
    window.addEventListener('resize', this.updateSizeControls)
    this.updateSizeControls()
  }

  public componentDidUpdate(previous: RendererProps): void {
    if (previous.scene?.width !== this.props.scene?.width ||
      previous.scene?.height !== this.props.scene?.height) {
      this.updateSizeControls()
    }
    if (previous.scene?.kind !== this.props.scene?.kind) {
      this.viewport.current?.scrollTo({ left: 0, top: 0, behavior: 'instant' })
      if (this.state.actualSize) this.setState({ actualSize: false })
      return
    }
    if (previous.scene !== this.props.scene) this.revealCurrentNode()
  }

  public componentWillUnmount(): void {
    this.resizeObserver?.disconnect()
    this.resizeObserver = null
    window.removeEventListener('resize', this.updateSizeControls)
  }

  private updateSizeControls = (): void => {
    const scene = this.props.scene
    const viewport = this.viewport.current
    let showSizeControls = false
    if (scene && viewport) {
      // Use the fit limits in either mode so actual-size scrollbars do not
      // change whether the controls are needed.
      const availableWidth = viewport.getBoundingClientRect().width
      const maximumHeight = Number.parseFloat(window.getComputedStyle(viewport).maxHeight)
      showSizeControls = availableWidth > 0 &&
        (scene.width > availableWidth + 1 || scene.height > maximumHeight + 1)
    }
    const actualSize = showSizeControls && this.state.actualSize
    if (showSizeControls !== this.state.showSizeControls || actualSize !== this.state.actualSize) {
      this.setState({ showSizeControls, actualSize })
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
        <path
          className={`scene-edge${edge.highlighted ? ' scene-edge-highlighted' : ''}`}
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

  private renderNode(node: SceneNode, circular: boolean): ReactNode {
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
        className={`scene-node tone-${node.tone}${node.nodeColor ? ` tree-color-${node.nodeColor}` : ''}`}
        style={style}
        aria-label={`${node.keys ? node.keys.length ? node.keys.join(', ') : 'empty page' : node.displayValue ?? node.value}, ${node.label}${node.tone === 'active' ? ', current node' : ''}`}
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
          style={{ fontSize: Math.min(21, (width - 16) * 1.6 / String(node.displayValue ?? node.value).length) }}
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
        {node.tone !== 'default' && (
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

  private renderScene(scene: Scene): ReactNode {
    const nodeMap = new Map<string, SceneNode>()
    const elements: ReactNode[] = []
    for (const slot of scene.slots ?? []) elements.push(this.renderSlot(slot))
    for (const node of scene.nodes) nodeMap.set(node.id, node)
    for (const edge of scene.edges)
      elements.push(this.renderEdge(edge, nodeMap))
    const circular = scene.kind === 'directed-graph' || scene.kind === 'weighted-graph' || scene.kind === 'dag' || scene.kind === 'multigraph' || scene.kind === 'graph' || scene.kind === 'binary-tree' || scene.kind === 'avl-tree' || scene.kind === 'red-black-tree'
    for (const node of scene.nodes)
      elements.push(this.renderNode(node, circular || scene.countLabel === 'vertices' && node.id.startsWith(`${scene.kind}-v`)))
    return (
      <svg
        ref={this.svg}
        className={`scene-svg${this.state.actualSize ? ' scene-svg--actual' : ''}`}
        width={scene.width}
        height={scene.height}
        viewBox={`0 0 ${scene.width} ${scene.height}`}
        preserveAspectRatio="xMidYMin meet"
        style={this.state.actualSize ? { width: scene.width, height: scene.height } : { maxWidth: scene.width }}
        role="img"
        aria-labelledby="scene-title scene-description"
      >
        <title id="scene-title">
          {`${scene.kind.replaceAll('-', ' ')} visualization`}
        </title>
        <desc id="scene-description">
          {scene.count} {scene.countLabel ?? 'elements'}. Blue marks the current node, teal marks
          visited nodes, and amber marks the new node.
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
        {elements}
      </svg>
    )
  }

  public render() {
    const scene = this.props.scene
    return (
      <section className="renderer" aria-label="Visualization workspace">
        <div className="renderer-content">
          {scene && this.props.children}
          <div className="renderer-stage">
            {scene && (
              <div className="diagram-tools">
                <div className="scene-legend" role="group" aria-label="Node states">
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
                </div>
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
              </div>
            )}
            {scene?.hint && (
              <aside className="structure-hint" aria-label={scene.hint.title}>
                <strong>{scene.hint.title}</strong>
                {scene.hint.code && <pre><code>{scene.hint.code}</code></pre>}
                <p>{scene.hint.description}</p>
              </aside>
            )}
            <div id="renderer-code" className="renderer-code-host" />
            <div
              id="diagram-viewport"
              className="renderer-viewport"
              ref={this.viewport}
              tabIndex={scene ? 0 : -1}
              role={scene ? 'region' : undefined}
              aria-label={scene ? 'Scrollable data structure canvas' : undefined}
            >
              {scene ? (
                this.renderScene(scene)
              ) : (
                <div className="empty-canvas">
                  <span className="empty-diagram" aria-hidden="true">
                    □<span>—</span>□<span>—</span>□
                  </span>
                  <h1>Make the invisible visible.</h1>
                  <p>Choose a data structure to bring it to life.</p>
                  <button className="text-button" onClick={this.props.onOpenMenu}>
                    Open the menu <span aria-hidden="true">↗</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    )
  }
}
