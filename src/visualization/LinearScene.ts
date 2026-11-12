import type { LinearFrame, LinearModel } from './LinearModel.ts'
import type { Scene, SceneEdge, SceneNode } from './Scene.ts'

export class LinearScene {
  public static node(id: string, text: string, label: string, x: number, y = 125, width = 76): SceneNode {
    return { id, value: 0, displayValue: text, label, x, y, width, tone: 'default', opacity: 1 }
  }

  public static edge(from: string, to: string, label = 'next'): SceneEdge {
    return { id: `${from}-${to}-${label}`, from, to, label, directed: true, highlighted: false, opacity: 1 }
  }

  public static create(model: LinearModel, nodes: readonly SceneNode[], edges: readonly SceneEdge[], frame: LinearFrame, countLabel = 'elements'): Scene {
    const marked: SceneNode[] = []
    let width = 560
    let height = 300
    let focusId: string | null = null
    for (const node of nodes) {
      width = Math.max(width, node.x + (node.width ?? 76) / 2 + 90)
      height = Math.max(height, node.y + 110)
      const active = node.id === frame.activeId
      const visited = frame.visited?.has(node.id)
      if (active) focusId = node.id
      marked.push({ ...node, tone: active ? frame.status === 'NEW' ? 'new' : 'active' : visited ? 'visited' : node.tone,
        status: active ? frame.status ?? 'CURRENT' : visited ? 'VISITED' : node.status })
    }
    return { kind: model.kind, nodes: marked, edges, width, height, focusId,
      count: frame.count ?? model.length, countLabel }
  }
}
