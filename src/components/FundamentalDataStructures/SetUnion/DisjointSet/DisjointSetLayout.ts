import type { LinearFrame, LinearModel } from '../../../../visualization/LinearModel.ts'
import { LinearScene } from '../../../../visualization/LinearScene.ts'
import type { Scene, SceneNode, SceneEdge } from '../../../../visualization/Scene.ts'
import { DisjointSet } from './DisjointSet.ts'
import type { DisjointSetEntry } from './DisjointSet.ts'

export class DisjointSetLayout {
  public create(model: LinearModel, frame: LinearFrame = {}): Scene {
    if (!(model instanceof DisjointSet)) throw new TypeError('Expected disjoint set')
    const entries = model.getEntries()
    const children = new Map<number, DisjointSetEntry[]>()
    let width = 190
    for (const entry of entries) {
      width = Math.max(width, String(entry.value).length * 13, `parent ${entry.parent}`.length * 7)
      if (entry.parent === entry.value) continue
      let row = children.get(entry.parent)
      if (!row) { row = []; children.set(entry.parent, row) }
      row.push(entry)
    }
    const nodes: SceneNode[] = []
    const edges: SceneEdge[] = []
    const cursor = { column: 0, width }
    for (const entry of entries) {
      if (entry.parent !== entry.value) continue
      this.place(entry, 0, children, nodes, edges, cursor)
      cursor.column += 1
    }
    return LinearScene.create(model, nodes, edges, frame, 'members')
  }

  private place(entry: DisjointSetEntry, depth: number, children: ReadonlyMap<number, readonly DisjointSetEntry[]>, nodes: SceneNode[], edges: SceneEdge[], cursor: { column: number; width: number }): number {
    let x = 0
    const row = children.get(entry.value) ?? []
    for (const child of row) {
      x += this.place(child, depth + 1, children, nodes, edges, cursor)
      edges.push(LinearScene.edge(child.id, entry.id, 'parent'))
    }
    if (row.length) x /= row.length
    else { x = cursor.width / 2 + 40 + cursor.column * (cursor.width + 70); cursor.column += 1 }
    const label = entry.parent === entry.value ? `root / rank ${entry.rank}` : `parent ${entry.parent}`
    nodes.push(LinearScene.node(entry.id, String(entry.value), label, x, 110 + depth * 155, cursor.width))
    return x
  }
}
