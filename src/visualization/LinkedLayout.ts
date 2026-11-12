import type { Scene, SceneEdge, SceneNode, StructureKind } from './Scene.ts'

export interface LinkedEntry {
  readonly id: string
  readonly value: number
  readonly nextId: string | null
  readonly prevId?: string | null
}

export interface LinkedFrame {
  readonly count?: number
  readonly activeId?: string | null
  readonly activeStatus?: string
  readonly activeTone?: SceneNode['tone']
  readonly visitedIds?: readonly string[]
  readonly order?: readonly string[]
  readonly pending?: LinkedEntry
  readonly pendingIndex?: number
  readonly pendingY?: number
  readonly pendingStatus?: string
  readonly pendingTone?: SceneNode['tone']
  readonly edges?: readonly SceneEdge[]
}

export class LinkedLayout {
  private readonly kind: StructureKind
  private readonly firstRole: string
  private readonly lastRole: string

  constructor(kind: StructureKind, firstRole: string, lastRole: string) {
    this.kind = kind
    this.firstRole = firstRole
    this.lastRole = lastRole
  }

  public static edge(from: string, to: string, label: 'next' | 'prev', doubled: boolean): SceneEdge {
    return { id: `${from}-${label}-${to}`, from, to, label, bend: doubled ? (label === 'next' ? -28 : 28) : 0, directed: true, highlighted: false, opacity: 1 }
  }

  public create(entries: readonly LinkedEntry[], frame: LinkedFrame = {}): Scene {
    const nodes: SceneNode[] = []
    const edges: SceneEdge[] = []
    const visited = new Set(frame.visitedIds)
    const order = frame.order ?? []
    const allEntries = [...entries]
    if (frame.pending) allEntries.push(frame.pending)
    const ids = new Set<string>()
    for (const entry of allEntries) ids.add(entry.id)
    for (let index = 0; index < allEntries.length; index += 1) {
      const entry = allEntries[index]
      const pending = entry.id === frame.pending?.id
      const orderedIndex = order.indexOf(entry.id)
      const position = orderedIndex >= 0 ? orderedIndex : pending ? frame.pendingIndex ?? entries.length : index
      const roles: string[] = []
      if (pending) roles.push('pending')
      else {
        if (index === 0) roles.push(this.firstRole)
        if (index === entries.length - 1) roles.push(this.lastRole)
      }
      const active = entry.id === frame.activeId
      nodes.push({
        id: entry.id, value: entry.value, x: 100 + position * 160,
        y: pending ? frame.pendingY ?? 100 : 240,
        label: pending ? frame.pendingStatus === 'REMOVING' ? 'detached' : 'pending' : `${index}${roles.length ? ` / ${roles.join(' / ')}` : ''}`,
        tone: pending ? frame.pendingTone ?? 'new' : active ? frame.activeTone ?? 'active' : visited.has(entry.id) ? 'visited' : 'default',
        status: pending ? frame.pendingStatus ?? 'PENDING' : active ? frame.activeStatus ?? 'CURRENT' : visited.has(entry.id) ? 'VISITED' : undefined,
        opacity: 1,
      })
      const doubled = entry.prevId !== undefined
      if (entry.nextId && ids.has(entry.nextId)) edges.push(LinkedLayout.edge(entry.id, entry.nextId, 'next', doubled))
      if (entry.prevId && ids.has(entry.prevId)) edges.push(LinkedLayout.edge(entry.id, entry.prevId, 'prev', doubled))
    }
    return {
      kind: this.kind, nodes, edges: frame.edges ? [...frame.edges] : edges,
      width: Math.max(640, 200 + Math.max(allEntries.length, order.length) * 160), height: 420,
      focusId: frame.pending?.id ?? frame.activeId ?? null,
      count: frame.count ?? entries.length,
      slots: allEntries.length ? [] : [{ id: `${this.kind}-empty`, x: 160, y: 240, label: `${this.firstRole} / ${this.lastRole} = null`, empty: true, highlighted: true, opacity: 1 }],
    }
  }
}
