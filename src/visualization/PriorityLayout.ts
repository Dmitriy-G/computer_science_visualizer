import { PriorityModel } from './PriorityModel.ts'
import type { PriorityDiagramNode } from './PriorityModel.ts'
import { LinearScene } from './LinearScene.ts'
import type { LinearFrame, LinearModel } from './LinearModel.ts'
import type { Scene, SceneEdge, SceneNode } from './Scene.ts'

export class PriorityLayout {
  private cursor = 0
  private readonly entries = new Map<string, PriorityDiagramNode>()
  private readonly nodes: SceneNode[] = []
  private readonly edges: SceneEdge[] = []

  private place(id: string, depth: number): number {
    const entry = this.entries.get(id)!
    let first = 0
    let last = 0
    for (let index = 0; index < entry.children.length; index += 1) {
      const child = entry.children[index]
      const x = this.place(child, depth + 1)
      if (index === 0) first = x
      last = x
      this.edges.push(LinearScene.edge(id, child, entry.children.length <= 2 ? index === 0 ? 'left / child' : 'right / child' : 'child'))
    }
    const x = entry.children.length ? (first + last) / 2 : 140 + this.cursor++ * 250
    this.nodes.push(LinearScene.node(id, entry.text, entry.label, x, 110 + depth * 160, 170))
    return x
  }

  public create(model: LinearModel, frame: LinearFrame = {}): Scene {
    if (!(model instanceof PriorityModel)) throw new TypeError('Expected a priority structure')
    this.cursor = 0
    this.entries.clear()
    this.nodes.length = 0
    this.edges.length = 0
    const diagram = model.getDiagram()
    for (const entry of diagram.nodes) this.entries.set(entry.id, entry)
    for (const id of diagram.roots) {
      this.place(id, 0)
      this.cursor += 1
    }
    if (diagram.circularRoots && diagram.roots.length > 1) {
      for (let index = 0; index < diagram.roots.length; index += 1) {
        const edge = LinearScene.edge(diagram.roots[index], diagram.roots[(index + 1) % diagram.roots.length], 'next root')
        this.edges.push({ ...edge, bend: index === diagram.roots.length - 1 ? -65 : -35 })
      }
    }
    return LinearScene.create(model, [...this.nodes], [...this.edges], frame,
      'entries')
  }
}
