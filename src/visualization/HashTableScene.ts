import { LinearScene } from './LinearScene.ts'
import type { LinearModel, LinearFrame } from './LinearModel.ts'
import type { Scene, SceneNode, SceneHint } from './Scene.ts'
import type { HashRecord } from '../components/DataStructuresOverview/HashBased/HashTableModel.ts'

export interface HashSlotGroup {
  readonly prefix: string
  readonly role: string
  readonly slots: readonly (HashRecord | 'deleted' | null)[]
  readonly labels?: readonly string[]
  readonly recordLabels?: readonly string[]
}

export class HashTableScene {
  private static readonly slotHeight = 44
  private static readonly recordOffset = 130
  private static readonly rowHeight = 270

  public static display(record: HashRecord): string { return `${record.key} : ${record.value}` }
  public static record(record: HashRecord, label: string, x: number, y: number): SceneNode {
    return LinearScene.node(record.id, this.display(record), label, x, y, Math.max(180, this.display(record).length * 10 + 24))
  }
  private static slotLabel(group: HashSlotGroup, index: number): string {
    const slot = group.slots[index]
    const state = slot === null ? 'EMPTY' : slot === 'deleted' ? 'DELETED' : 'OCCUPIED'
    return `${group.role} ${index}; ${state}${group.labels?.[index] ? `; ${group.labels[index]}` : ''}`
  }
  public static grid(model: LinearModel, groups: readonly HashSlotGroup[], frame: LinearFrame, hint: SceneHint, held: HashRecord | null = null): Scene {
    const nodes: SceneNode[] = []
    let cellWidth = 180
    for (const group of groups) {
      for (let index = 0; index < group.slots.length; index += 1) {
        const slot = group.slots[index]
        cellWidth = Math.max(cellWidth, this.slotLabel(group, index).length * 6 + 24)
        if (slot && slot !== 'deleted') cellWidth = Math.max(cellWidth, this.display(slot).length * 10 + 24)
        const recordLabel = group.recordLabels?.[index]
        if (recordLabel) cellWidth = Math.max(cellWidth, recordLabel.length * 6 + 24)
      }
    }
    if (held) cellWidth = Math.max(cellWidth, this.display(held).length * 10 + 24)
    const pitch = cellWidth + 70
    let firstY = 80
    for (const group of groups) {
      for (let index = 0; index < group.slots.length; index += 1) {
        const slot = group.slots[index]
        const x = 70 + pitch * (index % 4) + cellWidth / 2
        const y = firstY + Math.floor(index / 4) * this.rowHeight
        // Reserve separate bands for the slot caption, entry status, body, and entry caption.
        nodes.push({ ...LinearScene.node(`${group.prefix}-${index}`, String(index), this.slotLabel(group, index), x, y, cellWidth), height: this.slotHeight })
        if (slot && slot !== 'deleted') nodes.push({ ...this.record(slot, group.recordLabels?.[index] ?? 'key : value', x, y + this.recordOffset), width: cellWidth })
      }
      firstY += Math.ceil(group.slots.length / 4) * this.rowHeight + 60
    }
    if (held) nodes.push({ ...this.record(held, 'HELD; awaiting a legal slot', 70 + cellWidth / 2, firstY), width: cellWidth, tone: 'active', status: 'HELD' })
    return LinearScene.create(model, nodes, [], frame, hint, 'entries')
  }
}
