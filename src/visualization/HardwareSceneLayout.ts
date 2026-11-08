import type { Scene, SceneNode } from './Scene.ts'
import type { HardwareDiagram, HardwareVisualCell } from './HardwareDiagram.ts'

export interface HardwareSceneBank {
  readonly name: string
  readonly cells: readonly HardwareVisualCell[]
}

export interface HardwareSceneState {
  readonly banks: readonly HardwareSceneBank[]
  readonly diagram: HardwareDiagram | null
  readonly detail: string
  readonly focusId: string | null
  readonly events: number
}

export class HardwareSceneLayout {
  public static create(model: HardwareSceneState, kind: 'cpu-hardware' | 'hardware-system'): Scene {
    if (model.diagram) return this.createSystem(model, kind)
    const nodes: SceneNode[] = []
    let y = 85
    for (const bank of model.banks) {
      for (let index = 0; index < bank.cells.length; index += 1) {
        const cell = bank.cells[index]
        nodes.push({
          id: cell.id, value: index, displayValue: cell.value,
          x: 125 + index % 3 * 230, y: y + Math.floor(index / 3) * 135,
          width: 190, height: 48, opacity: 1,
          label: `${bank.name} / ${cell.label}`, status: cell.status,
          tone: cell.tone ?? (model.focusId === cell.id ? 'active' : 'default'),
        })
      }
      y += Math.max(1, Math.ceil(bank.cells.length / 3)) * 135
    }
    return {
      kind, nodes, edges: [], width: 720, height: Math.max(250, y),
      focusId: model.focusId, count: model.events, countLabel: 'hardware events',
      hint: { title: kind === 'cpu-hardware' ? 'Inside one CPU core' : 'Interacting hardware', description: model.detail },
    }
  }

  private static createSystem(model: HardwareSceneState, kind: 'cpu-hardware' | 'hardware-system'): Scene {
    const diagram = model.diagram!
    const cells = new Map<string, HardwareVisualCell>()
    for (const bank of model.banks) for (const cell of bank.cells) cells.set(cell.id, cell)
    for (const cell of diagram.fixtures) cells.set(cell.id, cell)
    const nodes: SceneNode[] = []
    for (const position of diagram.positions) {
      const cell = cells.get(position.id)
      if (!cell) throw new Error(`Missing hardware diagram cell: ${position.id}`)
      nodes.push({
        id: cell.id, value: nodes.length, displayValue: cell.value,
        label: cell.label, status: cell.status, x: position.x, y: position.y,
        width: position.width, height: 46, opacity: 1,
        tone: cell.tone ?? (cell.id === model.focusId ? 'active' : 'default'),
      })
    }
    const edges = []
    for (const edge of diagram.edges) edges.push({ ...edge })
    const regions = []
    for (const region of diagram.regions) regions.push({ ...region })
    return {
      kind, nodes, edges, regions, width: diagram.width, height: diagram.height,
      focusId: model.focusId, count: model.events, countLabel: 'hardware events',
      hint: { title: kind === 'cpu-hardware' ? 'Inside one CPU core / current flow' : 'Hardware and current flow', description: model.detail },
    }
  }
}
