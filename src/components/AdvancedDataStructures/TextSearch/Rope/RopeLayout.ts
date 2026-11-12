import { Rope } from './Rope.ts'
import type { RopeNode } from './Rope.ts'
import { LinearScene } from '../../../../visualization/LinearScene.ts'
import type { LinearFrame, LinearModel } from '../../../../visualization/LinearModel.ts'
import type { Scene, SceneEdge, SceneNode } from '../../../../visualization/Scene.ts'

export class RopeLayout {
  private leafIndex = 0

  private place(node: RopeNode, depth: number, nodes: SceneNode[], edges: SceneEdge[]): number {
    let x: number
    if (node.left) {
      const left = this.place(node.left, depth + 1, nodes, edges)
      const right = this.place(node.right!, depth + 1, nodes, edges)
      x = (left + right) / 2
      edges.push(LinearScene.edge(node.id, node.left.id, 'left'), LinearScene.edge(node.id, node.right!.id, 'right'))
    } else x = 140 + this.leafIndex++ * 220
    nodes.push(LinearScene.node(node.id, node.left ? String(node.weight) : node.text.replaceAll(' ', '␣'), node.left ? `left weight · length ${node.length}` : `leaf · ${node.length} chars`, x, 100 + depth * 150, 150))
    return x
  }

  public create(model: LinearModel, frame: LinearFrame = {}): Scene {
    if (!(model instanceof Rope)) throw new TypeError('Expected Rope')
    const nodes: SceneNode[] = []
    const edges: SceneEdge[] = []
    this.leafIndex = 0
    const root = model.getRoot()
    if (root) this.place(root, 0, nodes, edges)
    return LinearScene.create(model, nodes, edges, frame, 'characters')
  }
}
