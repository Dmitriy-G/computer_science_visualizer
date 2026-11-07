import type { Scene, SceneNode } from '../../../../../visualization/Scene.ts'
import type { DiskWorkload } from './DiskWorkload.ts'

export class DiskLayout {
  public static create(model: DiskWorkload, detail: string, focusId: string | null = null): Scene {
    const nodes: SceneNode[] = []
    for (let index = 0; index < model.requests.length; index += 1) {
      const request = model.requests[index]
      const status = model.status(request.id)
      nodes.push({
        id: request.id, value: request.sector,
        displayValue: `${request.id} ${request.direction === 'read' ? 'RD' : 'WR'}`,
        x: 100 + index % 4 * 180, y: 70 + Math.floor(index / 4) * 160,
        width: 138, height: 60, opacity: 1,
        tone: status === 'completed' ? 'visited' : status === 'in-flight' ? 'active' : 'default',
        label: `P${request.process} · LBA ${request.sector} · ${request.sectors} sectors`,
        status: status === 'completed' ? 'DONE' : status === 'in-flight' ? 'IN FLIGHT' : undefined,
      })
    }
    return {
      kind: 'disk-scheduling', nodes, edges: [], width: 740,
      height: Math.max(180, Math.ceil(model.requests.length / 4) * 160),
      focusId, count: model.completed.length, countLabel: 'completed requests',
      hint: {
        title: `Virtual time: ${model.time} ticks · Completed: ${model.completed.length}/${model.requests.length}`,
        description: detail,
      },
    }
  }
}
