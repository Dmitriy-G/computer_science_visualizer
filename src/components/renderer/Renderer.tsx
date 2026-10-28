import { Component, createRef } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import type { Scene, SceneEdge, SceneNode } from '../../visualization/Scene.ts'
import './Renderer.css'

interface RendererProps {
  readonly scene: Scene | null
  readonly onOpenMenu: () => void
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
    if (previous.scene?.focusId !== this.props.scene?.focusId)
      this.revealCurrentNode()
  }

  private revealCurrentNode(): void {
    const scene = this.props.scene
    const viewport = this.viewport.current
    const svg = this.svg.current
    if (!scene || !viewport || !svg || !scene.focusId) return
    for (const node of scene.nodes) {
      if (node.id !== scene.focusId) continue
      const x = (node.x * svg.clientWidth) / scene.width
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
    const offset = 39
    const x1 = from.x + (dx / length) * offset
    const y1 = from.y + (dy / length) * offset
    const x2 = to.x - (dx / length) * (offset + 3)
    const y2 = to.y - (dy / length) * (offset + 3)
    return (
      <path
        key={edge.id}
        className={`scene-edge${edge.highlighted ? ' scene-edge-highlighted' : ''}`}
        d={`M ${x1} ${y1} L ${x2} ${y2}`}
        style={{ opacity: edge.opacity }}
        markerEnd={
          edge.directed
            ? `url(#${edge.highlighted ? 'active-arrow' : 'default-arrow'})`
            : undefined
        }
      />
    )
  }

  private renderNode(node: SceneNode, circular: boolean): ReactNode {
    const style: CSSProperties = {
      transform: `translate(${node.x}px, ${node.y}px)`,
      opacity: node.opacity,
    }
    return (
      <g
        key={node.id}
        className={`scene-node tone-${node.tone}`}
        style={style}
        aria-label={`${node.value}, ${node.label}${node.tone === 'active' ? ', current node' : ''}`}
      >
        <rect
          className="node-halo"
          x="-43"
          y="-43"
          width="86"
          height="86"
          rx={circular ? 43 : 22}
        />
        <rect
          className="node-body"
          x="-33"
          y="-33"
          width="66"
          height="66"
          rx={circular ? 33 : 13}
        />
        <text
          className="node-value"
          textAnchor="middle"
          dominantBaseline="central"
        >
          {node.value}
        </text>
        <text className="node-label" textAnchor="middle" y="61">
          {node.label}
        </text>
        {node.tone !== 'default' && (
          <text className="node-status" textAnchor="middle" y="-56">
            {node.tone === 'active'
              ? 'CURRENT'
              : node.tone === 'new'
                ? 'NEW'
                : 'VISITED'}
          </text>
        )}
      </g>
    )
  }

  private renderScene(scene: Scene): ReactNode {
    const nodeMap = new Map<string, SceneNode>()
    const elements: ReactNode[] = []
    for (const node of scene.nodes) nodeMap.set(node.id, node)
    for (const edge of scene.edges)
      elements.push(this.renderEdge(edge, nodeMap))
    const circular = scene.kind === 'graph' || scene.kind === 'binary-tree'
    for (const node of scene.nodes)
      elements.push(this.renderNode(node, circular))
    return (
      <svg
        ref={this.svg}
        className="scene-svg"
        viewBox={`0 0 ${scene.width} ${scene.height}`}
        style={{ minWidth: scene.width * 0.8 }}
        role="img"
        aria-labelledby="scene-title scene-description"
      >
        <title id="scene-title">
          {scene.kind.replaceAll('-', ' ')} visualization
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
        <div className="canvas-label">
          <span className="canvas-dot" />
          {scene ? 'LIVE CANVAS' : 'EMPTY CANVAS'}
        </div>
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
          <span className="canvas-tip">
            {scene
              ? 'Scroll to explore the canvas'
              : 'Start with the menu in the top left'}
          </span>
        </div>
      </section>
    )
  }
}
