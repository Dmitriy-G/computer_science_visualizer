import { AnimationSequence } from './AnimationSequence.ts'
import type { ActionModel } from './ActionDefinition.ts'
import type { Scene } from './Scene.ts'
import type { TreeTraceEvent, TreeTraceObserver } from './TreeTrace.ts'

export interface TreeFrame {
  readonly count?: number
  readonly activeId?: string | null
  readonly pendingId?: string
  readonly status?: string
  readonly visitedIds?: readonly string[]
  readonly hideMetadata?: boolean
}

export interface TreeSceneFactory<TModel> {
  create(model: TModel, frame?: TreeFrame): Scene
}

export interface TracedTreeModel<TModel> extends ActionModel<TModel> {
  readonly length: number
}

export abstract class TreeActionAnimation<TModel extends TracedTreeModel<TModel>>
  extends AnimationSequence implements TreeTraceObserver {
  public readonly result: TModel
  private readonly originalSize: number
  private readonly factory: TreeSceneFactory<TModel>
  private readonly visited: string[] = []
  protected get visitedIds(): readonly string[] { return this.visited }
  private pendingId: string | undefined
  private readonly clearing: boolean
  private phase = 1

  constructor(model: TModel, factory: TreeSceneFactory<TModel>, clearing = false) {
    super()
    this.result = model.clone()
    this.originalSize = model.length
    this.factory = factory
    this.clearing = clearing
  }

  protected begin(description: string, code: string): void {
    this.add(1, 'Inspect the tree', description, code, this.factory.create(this.result, { hideMetadata: this.clearing }))
  }

  protected finish(title: string, description: string, code: string, activeId?: string | null, status?: string): void {
    this.add(5, title, description, code, this.factory.create(this.result, { activeId, status }))
  }

  protected searchLocation(id: string, key: number): string {
    const scene = this.steps[this.steps.length - 1].scene
    for (const node of scene.nodes) {
      if (node.id !== id) continue
      if (node.keys) {
        const role = node.label.includes('leaf') ? 'leaf' : 'page'
        return `${role} [${node.keys.join(', ')}], key index ${node.keys.indexOf(key)} (zero-based)`
      }
      return `depth ${Math.max(0, this.visited.length - 1)} (root depth is 0)`
    }
    return 'the highlighted node'
  }

  public onTreeChange(event: TreeTraceEvent): void {
    if (event.pendingId) this.pendingId = event.pendingId
    const requestedPhase = event.phase === 'visit' && this.phase >= 3 ? 4
      : event.phase === 'compare' || event.phase === 'visit' ? 2
      : event.phase === 'create' || event.phase === 'connect' || event.phase === 'remove' ? 3 : 4
    const phase = Math.max(this.phase, requestedPhase)
    this.phase = phase
    const scene = this.factory.create(this.result, {
      count: this.originalSize,
      activeId: event.activeId,
      pendingId: this.pendingId,
      status: event.phase === 'create' ? 'PENDING' : event.phase === 'compare' ? 'CURRENT' : event.phase.toUpperCase(),
      visitedIds: this.visited,
      hideMetadata: this.clearing,
    })
    if (event.phase === 'create' && event.pendingId) {
      const nodes = []
      const edges = []
      for (const node of scene.nodes) nodes.push({ ...node, y: node.id === event.pendingId ? Math.max(82, node.y - 58) : node.y })
      for (const edge of scene.edges) edges.push({ ...edge, opacity: edge.to === event.pendingId ? 0 : edge.opacity })
      this.add(phase, event.title, event.description, event.code, { ...scene, nodes, edges })
    } else this.add(phase, event.title, event.description, event.code, scene)
    if ((event.phase === 'compare' || event.phase === 'visit') && event.activeId && !this.visited.includes(event.activeId)) this.visited.push(event.activeId)
  }
}
