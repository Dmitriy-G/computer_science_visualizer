import { AdditionalTreeModel } from '../../../../visualization/AdditionalTreeModel.ts'
import type { Scene, SceneNode } from '../../../../visualization/Scene.ts'
import type { TreeFrame } from '../../../../visualization/TreeActionAnimation.ts'
import { LSMTree } from './LSMTree.ts'

export class LSMTreeLayout {
  public create(model: AdditionalTreeModel, frame: TreeFrame = {}): Scene {
    if (!(model instanceof LSMTree)) throw new TypeError('Expected an LSM tree')
    const nodes: SceneNode[] = []
    const visited = new Set(frame.visitedIds)
    let y = 90
    let width = 720
    for (const row of model.getRows()) {
      const active = row.id === frame.activeId
      nodes.push({ id: row.id, value: 0, displayValue: row.level === -1 ? 'memtable' : row.id.replace('lsm-', ''),
        x: 110, y, label: row.level === -1 ? `${row.records.length}/4 keys` : `level ${row.level}`, width: 140, height: 54,
        tone: active ? 'active' : visited.has(row.id) ? 'visited' : 'default', opacity: 1,
        status: active ? frame.status ?? 'CURRENT' : visited.has(row.id) ? 'VISITED' : undefined,
      })
      let x = 300
      for (const record of row.records) {
        const id = row.pending ? `${row.id}-v-${record.version}` : `lsm-v-${record.version}`
        const recordActive = frame.activeId === `lsm-v-${record.version}` || active
        const pending = frame.pendingId === `lsm-v-${record.version}`
        nodes.push({ id, value: record.key, displayValue: `${record.key}: ${record.value === null ? 'DEL' : record.value}`,
          x, y, label: `seq ${record.version}${record.value === null ? ' / tombstone' : ''}`, width: 150, height: 54,
          tone: pending ? 'new' : recordActive ? 'active' : visited.has(`lsm-v-${record.version}`) ? 'visited' : 'default', opacity: 1,
          status: pending ? 'PENDING' : recordActive ? frame.status ?? 'CURRENT' : visited.has(`lsm-v-${record.version}`) ? 'VISITED' : undefined,
        })
        x += 190
      }
      width = Math.max(width, x)
      y += 140
    }
    return { kind: model.kind, nodes, edges: [], width, height: Math.max(340, y + 60), focusId: frame.activeId ?? null, count: frame.count ?? model.length,
      countLabel: 'live keys',
    }
  }
}
