import { HierarchyLayout } from '../../../../visualization/HierarchyLayout.ts'
import type { AdditionalTreeModel } from '../../../../visualization/AdditionalTreeModel.ts'
import type { TreeFrame } from '../../../../visualization/TreeActionAnimation.ts'
import type { Scene } from '../../../../visualization/Scene.ts'
export class SparseTableLayout extends HierarchyLayout {
  public create(model: AdditionalTreeModel, frame: TreeFrame = {}): Scene {
    const scene = super.create(model, frame)
    const nodes = []
    let maximumLevel = 0
    for (const node of scene.nodes) {
      const match = /^k=(\d+); \[(\d+),/.exec(node.label)
      const level = Number(match?.[1] ?? 0)
      const index = Number(match?.[2] ?? 0)
      maximumLevel = Math.max(maximumLevel, level)
      nodes.push({ ...node, x: 140 + index * 220, y: 90 + level * 135, width: 190 })
    }
    return { ...scene, nodes, width: Math.max(720, 240 + model.length * 220), height: Math.max(340, 230 + maximumLevel * 135), countLabel: 'array values',
      hint: { title: 'Sparse Table', description: 'A static table, rather than a node tree: row k caches minima for intervals of length 2^k. Queries combine two possibly overlapping cells in O(1). Build replaces the source values.' }
    }
  }
}
