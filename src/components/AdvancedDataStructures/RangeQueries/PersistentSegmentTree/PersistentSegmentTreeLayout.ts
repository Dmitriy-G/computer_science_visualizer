import { HierarchyLayout } from '../../../../visualization/HierarchyLayout.ts'
import type { AdditionalTreeModel } from '../../../../visualization/AdditionalTreeModel.ts'
import type { TreeFrame } from '../../../../visualization/TreeActionAnimation.ts'
import type { Scene } from '../../../../visualization/Scene.ts'
export class PersistentSegmentTreeLayout extends HierarchyLayout {
  public create(model: AdditionalTreeModel, frame: TreeFrame = {}): Scene {
    const scene = super.create(model, frame)
    const entries = model.getDiagram()
    const byId = new Map<string, typeof entries[number]>()
    const childIds = new Set<string>()
    for (const entry of entries) {
      byId.set(entry.id, entry)
      for (const child of entry.children) childIds.add(child)
    }
    const depths = new Map<string, number>()
    const visit = (id: string, depth: number): void => {
      if ((depths.get(id) ?? -1) >= depth) return
      depths.set(id, depth)
      for (const child of byId.get(id)?.children ?? []) visit(child, depth + 1)
    }
    for (const entry of entries) if (!childIds.has(entry.id)) visit(entry.id, 0)
    const rows = new Map<number, string[]>()
    let columns = 0
    let maximumDepth = 0
    for (const entry of entries) {
      const depth = depths.get(entry.id) ?? 0
      const row = rows.get(depth) ?? []
      row.push(entry.id)
      rows.set(depth, row)
      columns = Math.max(columns, row.length)
      maximumDepth = Math.max(maximumDepth, depth)
    }
    const width = Math.max(720, 180 + columns * 240)
    const positions = new Map<string, { x: number, y: number }>()
    for (const [depth, ids] of rows) for (let index = 0; index < ids.length; index += 1) positions.set(ids[index], { x: (width - ids.length * 240) / 2 + index * 240 + 120, y: 90 + depth * 140 })
    const nodes = []
    for (const node of scene.nodes) nodes.push({ ...node, ...positions.get(node.id), width: 210 })
    return { ...scene, nodes, width, height: Math.max(340, 230 + maximumDepth * 140), countLabel: 'array values'
    }
  }
}
