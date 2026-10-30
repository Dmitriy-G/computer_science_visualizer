import { BinaryTreeLayout } from '../components/DataStructures/Trees/BinaryTree/BinaryTreeLayout.ts'
import type { BinarySearchEntry } from './TreeTrace.ts'
import type { Scene, SceneNode, StructureKind } from './Scene.ts'
import type { TreeFrame } from './TreeActionAnimation.ts'

export class BalancedBinaryLayout {
  private readonly kind: StructureKind

  constructor(kind: StructureKind) { this.kind = kind }

  public createEntries(entries: readonly BinarySearchEntry[], size: number, frame: TreeFrame = {}): Scene {
    const base = new BinaryTreeLayout().create(entries)
    const nodes: SceneNode[] = []
    const byId = new Map<string, BinarySearchEntry>()
    for (const entry of entries) byId.set(entry.id, entry)
    const visited = new Set(frame.visitedIds)
    let focusId: string | null = null
    for (const node of base.nodes) {
      const entry = byId.get(node.id)!
      const pending = node.id === frame.pendingId
      const active = node.id === frame.activeId
      const roles: string[] = []
      if (entry.id === entries[0]?.id) roles.push('root')
      if (!frame.hideMetadata && entry.height !== undefined) {
        const balance = (byId.get(entry.leftId ?? '')?.height ?? 0) - (byId.get(entry.rightId ?? '')?.height ?? 0)
        roles.push(`h ${entry.height} / balance ${balance}`)
      }
      if (entry.color) roles.push(entry.color.toUpperCase())
      nodes.push({ ...node, label: roles.join(' / '), nodeColor: entry.color,
        tone: pending ? 'new' : active ? 'active' : visited.has(node.id) ? 'visited' : 'default',
        status: pending ? 'PENDING' : active ? frame.status ?? 'CURRENT' : visited.has(node.id) ? 'VISITED' : undefined,
      })
      if (active) focusId = node.id
      else if (pending && focusId === null) focusId = node.id
    }
    return { ...base, kind: this.kind, nodes, count: frame.count ?? size, focusId,
      slots: entries.length ? [] : [{ id: `${this.kind}-empty`, x: 88, y: 110, label: 'root = null', empty: true, highlighted: true, opacity: 1 }],
    }
  }
}
