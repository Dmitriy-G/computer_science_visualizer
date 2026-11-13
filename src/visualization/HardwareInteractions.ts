import type { Scene, SceneEdge, SceneNode } from './Scene.ts'

export interface HardwareInteraction {
  readonly scene: Scene
  readonly description: string
}

export class HardwareInteractions {
  public static create(previous: Scene, target: Scene): HardwareInteraction[] {
    const before = new Map<string, SceneNode>()
    for (const node of previous.nodes) before.set(node.id, node)
    const current = new Map<string, SceneNode>()
    const changed: SceneNode[] = []
    for (const node of target.nodes) {
      const old = before.get(node.id)
      current.set(node.id, old ? { ...node, displayValue: old.displayValue, status: old.status, label: old.label } : { ...node })
      if (!old || old.displayValue !== node.displayValue || old.status !== node.status || old.label !== node.label) changed.push(node)
    }
    const transfers: SceneEdge[] = []
    for (const edge of target.edges) if (edge.highlighted) transfers.push(edge)
    const updates = new Map<number, SceneNode[]>()
    const local: SceneNode[] = []
    for (const node of changed) {
      let stage = -1
      for (let index = 0; index < transfers.length; index += 1) {
        if (transfers[index].to === node.id) stage = index
      }
      if (stage < 0) stage = transfers.findIndex((edge) => edge.from === node.id)
      if (stage < 0) local.push(node)
      else {
        const nodes = updates.get(stage) ?? []
        nodes.push(node)
        updates.set(stage, nodes)
      }
    }
    const interactions: HardwareInteraction[] = []
    for (let index = 0; index < transfers.length; index += 1) {
      const edge = transfers[index]
      for (const node of updates.get(index) ?? []) current.set(node.id, { ...node })
      const from = current.get(edge.from)!
      const to = current.get(edge.to)!
      interactions.push({
        scene: this.frame(target, current, edge, edge.to),
        description: `${edge.message ?? edge.label}: ${from.label} → ${to.label}.`,
      })
    }
    for (const node of local) {
      current.set(node.id, { ...node })
      interactions.push({
        scene: this.frame(target, current, null, node.id),
        description: `${node.label}: ${node.displayValue ?? node.value}${node.status ? ` (${node.status})` : ''}.`,
      })
    }
    return interactions
  }

  public static frame(target: Scene, current: ReadonlyMap<string, SceneNode>, active: SceneEdge | null, focusId: string | null): Scene {
    const nodes: SceneNode[] = []
    for (const node of current.values()) {
      const highlighted = active ? node.id === active.from || node.id === active.to : node.id === focusId
      nodes.push({ ...node, tone: highlighted ? 'active' : 'default' })
    }
    const edges: SceneEdge[] = []
    for (const edge of target.edges) {
      const highlighted = edge.id === active?.id
      edges.push({ ...edge, highlighted, flow: highlighted, opacity: highlighted ? 1 : 0 })
    }
    const regions = []
    for (const region of target.regions ?? []) regions.push({ ...region })
    const paths = []
    for (const path of target.paths ?? []) paths.push(path.caption ? { ...path, caption: { ...path.caption } } : { ...path })
    return { ...target, nodes, edges, regions, paths, focusId }
  }
}
