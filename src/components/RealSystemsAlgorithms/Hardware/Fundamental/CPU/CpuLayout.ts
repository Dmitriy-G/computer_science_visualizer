import type { Scene, SceneNode } from '../../../../../visualization/Scene.ts'
import type { CpuModel } from './CpuModel.ts'

export class CpuLayout {
  public static create(model: CpuModel): Scene {
    const nodes: SceneNode[] = []
    let y = 85
    for (const bank of model.banks) {
      for (let index = 0; index < bank.cells.length; index += 1) {
        const cell = bank.cells[index]
        nodes.push({
          id: cell.id, value: index, displayValue: cell.value,
          x: 110 + index % 4 * 175, y: y + Math.floor(index / 4) * 135,
          width: 145, height: 48, opacity: 1,
          label: `${bank.name} · ${cell.label}`, tone: cell.tone ?? 'default', status: cell.status,
        })
      }
      y += Math.max(1, Math.ceil(bank.cells.length / 4)) * 135
    }
    return {
      kind: 'cpu-hardware', nodes, edges: [], width: 745, height: Math.max(250, y),
      focusId: model.focusId, count: model.events, countLabel: 'hardware events',
      hint: { title: 'Inside one CPU core', description: model.detail },
    }
  }
}
