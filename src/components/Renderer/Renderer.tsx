import { Component, createRef } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import type {
  Scene,
  SceneEdge,
  SceneNode,
  SceneSlot,
} from '../../visualization/Scene.ts'
import type { AlgorithmInformation } from '../../visualization/AlgorithmInformation.ts'
import AlgorithmInfo from './AlgorithmInfo/AlgorithmInfo.tsx'
import './Renderer.css'

interface RendererProps {
  readonly scene: Scene | null
  readonly algorithmInformation: AlgorithmInformation | null
  readonly onOpenMenu: () => void
  readonly children?: ReactNode
}

export default class Renderer extends Component<
  RendererProps,
  Record<string, never>
> {
  private readonly viewport = createRef<HTMLDivElement>()
  private readonly svg = createRef<SVGSVGElement>()

  public componentDidUpdate(previous: RendererProps): void {
    if (previous.scene?.kind !== this.props.scene?.kind) {
      this.viewport.current?.scrollTo({ left: 0, behavior: 'instant' })
    }
    if (previous.scene !== this.props.scene) this.revealCurrentNode()
  }

  private revealCurrentNode(): void {
    const scene = this.props.scene
    const viewport = this.viewport.current
    const svg = this.svg.current
    if (!scene || !viewport || !svg || !scene.focusId) return
    for (const node of scene.nodes) {
      if (node.id !== scene.focusId) continue
      const x =
        svg.getBoundingClientRect().left -
        viewport.getBoundingClientRect().left +
        viewport.scrollLeft +
        (node.x * svg.clientWidth) / scene.width
      if (
        x < viewport.scrollLeft + 70 ||
        x > viewport.scrollLeft + viewport.clientWidth - 70
      ) {
        viewport.scrollTo({
          left: Math.max(0, x - viewport.clientWidth / 2),
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
    return (
      <g key={edge.id} className="scene-edge-group" style={{ opacity: edge.opacity }}>
        <path
          className={`scene-edge${edge.highlighted ? ' scene-edge-highlighted' : ''}`}
          d={bend ? `M ${x1} ${y1} Q ${middleX} ${middleY + bend * 2} ${x2} ${y2}` : `M ${x1} ${y1} L ${x2} ${y2}`}
          markerEnd={
            edge.directed
              ? `url(#${edge.highlighted ? 'active-arrow' : 'default-arrow'})`
              : undefined
          }
        />
        {edge.label && (
          <text className="node-label" textAnchor="middle" x={middleX} y={middleY + bend + (bend > 0 ? 14 : -8)}>
            {edge.label}
          </text>
        )}
      </g>
    )
  }

  private edgeOffset(node: SceneNode, dx: number, dy: number): number {
    if (node.keys === undefined) return 39
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
      elements.push(<text key={`key-${index}`} className="node-value page-key" x={x} textAnchor="middle" dominantBaseline="central">{keys[index]}</text>)
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
        aria-label={`${node.keys ? node.keys.length ? node.keys.join(', ') : 'empty page' : node.value}, ${node.label}${node.tone === 'active' ? ', current node' : ''}`}
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
        >
          {node.value}
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
    const circular = scene.kind === 'graph' || scene.kind === 'binary-tree' || scene.kind === 'avl-tree' || scene.kind === 'red-black-tree'
    for (const node of scene.nodes)
      elements.push(this.renderNode(node, circular))
    return (
      <svg
        ref={this.svg}
        className="scene-svg"
        viewBox={`0 0 ${scene.width} ${scene.height}`}
        style={{ minWidth: scene.width * 0.8, maxWidth: scene.width * 1.2 }}
        role="img"
        aria-labelledby="scene-title scene-description"
      >
        <title id="scene-title">
          {`${scene.kind.replaceAll('-', ' ')} visualization`}
        </title>
        <desc id="scene-description">
          {scene.count} elements. Blue marks the current node, teal marks
          visited nodes, and amber marks the new node. Scroll horizontally to
          inspect the full structure on smaller screens.
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
            <div id="renderer-code" className="renderer-code-host" />
            <div
              className="renderer-viewport"
              ref={this.viewport}
              tabIndex={scene ? 0 : -1}
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
          {scene && (
            <AlgorithmInfo information={this.props.algorithmInformation} />
          )}
        </div>
        <div className="canvas-footer">
          {scene ? (
            <div className="scene-legend">
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
          ) : (
            <span>No structure selected</span>
          )}
        </div>
      </section>
    )
  }
}
