import { HardwareDiagram } from '../../../../../visualization/HardwareDiagram.ts'
import type { HardwarePosition } from '../../../../../visualization/HardwareDiagram.ts'
import type { SceneRegion } from '../../../../../visualization/Scene.ts'

export class CpuCoreLayout {
  public static create(used: readonly string[]): HardwareDiagram {
    const diagram = new HardwareDiagram(1560, 1560)
    diagram.region('core', 'CPU / Core 0', 'cpu', 20, 20, 1520, 1520, 'system')
    diagram.region('front-end', 'Front end', 'cpu', 50, 90, 700, 620, 'component', 'core')
    diagram.region('scheduling', 'Scheduling and registers', 'cpu', 810, 90, 700, 620, 'component', 'core')
    diagram.region('execution', 'Execution and retirement', 'cpu', 50, 750, 700, 620, 'component', 'core')
    diagram.region('memory-access', 'Memory access', 'cpu', 810, 750, 700, 620, 'component', 'core')
    const parts: readonly [string, string, SceneRegion['role'], string, number, number, number, number][] = [
      ['instruction-fetch', 'Instruction fetch', 'cpu', 'front-end', 60, 140, 210, 150],
      ['instruction-cache', 'L1 instruction cache', 'cache', 'front-end', 295, 140, 210, 150],
      ['instruction-decoder', 'Instruction decoder', 'cpu', 'front-end', 530, 140, 210, 150],
      ['branch-predictor', 'Branch predictor / history and return prediction', 'cpu', 'front-end', 60, 310, 680, 390],
      ['instruction-queue', 'Instruction queue', 'cpu', 'scheduling', 820, 140, 210, 150],
      ['register-renaming', 'Register renaming', 'cpu', 'scheduling', 1055, 140, 210, 150],
      ['instruction-scheduler', 'Scheduler / issue queues', 'cpu', 'scheduling', 1290, 140, 210, 150],
      ['register-files', 'Register files / physical and architectural state', 'cpu', 'scheduling', 820, 310, 680, 390],
      ['integer-alus', 'Integer ALUs / branch execution', 'cpu', 'execution', 60, 800, 210, 150],
      ['floating-point-simd', 'Floating-point / SIMD units', 'cpu', 'execution', 295, 800, 210, 150],
      ['exception-control', 'Exception / interrupt control', 'cpu', 'execution', 530, 800, 210, 150],
      ['reorder-retirement', 'Reorder buffer / in-order retirement', 'cpu', 'execution', 60, 970, 680, 390],
      ['address-generation', 'Address generation', 'cpu', 'memory-access', 820, 800, 210, 150],
      ['data-cache', 'L1 data cache', 'cache', 'memory-access', 1055, 800, 210, 150],
      ['address-translation', 'MMU / TLBs and page walker', 'cpu', 'memory-access', 1290, 800, 210, 150],
      ['load-store', 'Load/store unit / load queue and store buffer', 'cpu', 'memory-access', 820, 970, 680, 390],
      ['cache-interface', 'Interface to higher-level caches and the interconnect', 'cpu', 'core', 50, 1410, 1460, 110],
    ]
    for (const [id, label, role, parent, x, y, width, height] of parts) {
      diagram.region(`component-${id}`, label, role, x, y, width, height, 'component', parent)
      if (!used.includes(id)) diagram.fixture(`idle-${id}`, 'not used in this overview', 'idle', x + width / 2, y + (height > 200 ? 190 : height < 130 ? 55 : 80), undefined, Math.min(210, width - 30))
    }
    return diagram
  }

  public static place(diagram: HardwareDiagram, component: string, id: string, column = 0, row = 0, columns = 1, width?: number): HardwareDiagram {
    const region = diagram.regions.find((candidate) => candidate.id === `component-${component}`)
    if (!region) throw new Error(`Unknown CPU component: ${component}`)
    const pitch = (region.width - 20) / columns
    return diagram.place(id, region.x + 10 + pitch * (column + 0.5), region.y + 85 + row * 110, width ?? Math.min(210, pitch - 20))
  }

  public static fixture(diagram: HardwareDiagram, component: string, id: string, label: string, value: string, column = 0, row = 0, columns = 1, width?: number): HardwareDiagram {
    diagram.fixtures.push({ id, label, value })
    return this.place(diagram, component, id, column, row, columns, width)
  }

  public static route(diagram: HardwareDiagram): HardwareDiagram {
    const positions = new Map<string, HardwarePosition>()
    for (const position of diagram.positions) positions.set(position.id, position)
    for (let index = 0; index < diagram.edges.length; index += 1) {
      const edge = diagram.edges[index]
      const from = positions.get(edge.from)
      const to = positions.get(edge.to)
      if (!from || !to) throw new Error(`CPU transfer has no endpoint: ${edge.id}`)
      const dx = to.x - from.x
      const dy = to.y - from.y
      const length = Math.hypot(dx, dy) || 1
      const normalX = -dy / length
      const normalY = dx / length
      let best = 0
      let bestCost = Number.POSITIVE_INFINITY
      for (const curve of [edge.curveOffset ?? 0, 0, -30, 30, -60, 60, -100, 100, -160, 160, -220, 220]) {
        const controlX = (from.x + to.x) / 2 + normalX * curve * 2
        const controlY = (from.y + to.y) / 2 + normalY * curve * 2
        let cost = Math.abs(curve) / 1000
        for (let sample = 1; sample < 24; sample += 1) {
          const t = sample / 24
          const x = (1 - t) ** 2 * from.x + 2 * (1 - t) * t * controlX + t ** 2 * to.x
          const y = (1 - t) ** 2 * from.y + 2 * (1 - t) * t * controlY + t ** 2 * to.y
          if (x < 35 || x > diagram.width - 35 || y < 65 || y > diagram.height - 35) cost += 1000000
          for (const position of diagram.positions) {
            if (position.id === from.id || position.id === to.id) continue
            if (x > position.x - position.width / 2 - 10 && x < position.x + position.width / 2 + 10 && y > position.y - 50 && y < position.y + 60) cost += 10
          }
        }
        if (cost < bestCost) {
          bestCost = cost
          best = curve
        }
      }
      diagram.edges[index] = { ...edge, curveOffset: best }
    }
    return diagram
  }
}
