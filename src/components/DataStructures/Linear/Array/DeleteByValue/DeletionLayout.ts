import type { ArrayEntry } from '../FixedArray.ts'
import type { Scene, SceneNode, SceneSlot } from '../../../../../visualization/Scene.ts'

export class DeletionLayout {
  public create(entries: readonly ArrayEntry[], removedIndex: number, copied: number, reading = -1): Scene {
    const nodes: SceneNode[] = []
    const slots: SceneSlot[] = []
    let destination = 0
    for (let index = 0; index < entries.length; index += 1) {
      const entry = entries[index]
      nodes.push({ ...entry, id: `source-${entry.id}`, x: 80 + index * 92, y: 150, label: '', tone: index === reading || index === removedIndex ? 'active' : 'default', status: index === removedIndex ? 'REMOVE' : 'READ', opacity: 1 })
      slots.push({ id: `source-slot-${index}`, x: 80 + index * 92, y: 150, label: `original [${index}]`, empty: false, highlighted: index === reading, opacity: 1 })
      if (index === removedIndex) continue
      if (destination < copied) nodes.push({ ...entry, x: 80 + destination * 92, y: 420, label: '', tone: 'visited', status: 'COPIED', opacity: 1 })
      slots.push({ id: `result-slot-${destination}`, x: 80 + destination * 92, y: 420, label: `new [${destination}]`, empty: destination >= copied, highlighted: index === reading, opacity: 1 })
      destination += 1
    }
    return {
      kind: 'array', nodes, slots, edges: [], width: Math.max(1100, 160 + entries.length * 92), height: 580,
      focusId: reading >= 0 ? `source-${entries[reading].id}` : null, count: entries.length,
    }
  }
}
