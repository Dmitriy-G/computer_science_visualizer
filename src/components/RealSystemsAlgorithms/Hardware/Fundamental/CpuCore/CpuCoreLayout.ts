import { HardwareDiagram } from '../../../../../visualization/HardwareDiagram.ts'
import type { HardwarePosition } from '../../../../../visualization/HardwareDiagram.ts'
import type { SceneRegion } from '../../../../../visualization/Scene.ts'

export class CpuCoreLayout {
  public static readonly size = 2400
  public static readonly componentCount = 23

  public static create(used: readonly string[], showIdle = true): HardwareDiagram {
    const diagram = new HardwareDiagram(this.size, this.size)
    diagram.region('core', 'CPU / Core 0', 'cpu', 20, 20, 2360, 2360, 'system')
    diagram.region('front-end', 'Front end', 'cpu', 50, 90, 2300, 620, 'component', 'core')
    diagram.region('scheduling', 'Scheduling and registers', 'cpu', 50, 750, 2300, 730, 'component', 'core')
    diagram.region('execution', 'Execution and retirement', 'cpu', 50, 1540, 1100, 610, 'component', 'core')
    diagram.region('memory-access', 'Memory access', 'cpu', 1250, 1540, 1100, 610, 'component', 'core')
    const parts: readonly [string, string, SceneRegion['role'], string, number, number, number, number, string][] = [
      ['instruction-fetch', 'Instruction fetch', 'cpu', 'front-end', 60, 150, 330, 170, 'Fetch'],
      ['instruction-decoder', 'Instruction decoder', 'cpu', 'front-end', 420, 150, 330, 170, 'Decode'],
      ['instruction-queue', 'Decoded instruction queue', 'cpu', 'front-end', 780, 150, 330, 170, 'Instruction queue'],
      ['instruction-tlb', 'ITLB / instruction translation', 'cpu', 'front-end', 60, 370, 330, 170, 'ITLB'],
      ['instruction-cache', 'L1 instruction cache', 'cache', 'front-end', 780, 370, 330, 170, 'L1I cache'],
      ['branch-predictor', 'Branch predictor / history and return prediction', 'cpu', 'front-end', 1530, 150, 800, 540, 'Branch predictor'],
      ['register-renaming', 'Rename / physical allocation', 'cpu', 'scheduling', 60, 810, 330, 170, 'Rename / allocate'],
      ['rename-map', 'Rename map / Register Alias Table (RAT)', 'cpu', 'scheduling', 430, 810, 520, 170, 'RAT / rename map'],
      ['dispatch-allocation', 'Dispatch / ROB and queue allocation', 'cpu', 'scheduling', 990, 810, 330, 170, 'Dispatch'],
      ['instruction-scheduler', 'Scheduler / issue queues', 'cpu', 'scheduling', 1360, 810, 970, 170, 'Scheduler / issue'],
      ['register-files', 'Physical Register File (PRF) / register read and writeback / speculative and committed values', 'cpu', 'scheduling', 60, 1030, 1420, 430, 'Physical registers (PRF)'],
      ['architectural-state', 'Committed architectural state / committed mappings and control state', 'cpu', 'scheduling', 1530, 1030, 800, 430, 'Committed state'],
      ['integer-alus', 'Integer ALUs / branch execution', 'cpu', 'execution', 60, 1600, 330, 170, 'Integer / branch'],
      ['floating-point-simd', 'Floating-point / SIMD units', 'cpu', 'execution', 420, 1600, 330, 170, 'FP / SIMD'],
      ['exception-control', 'Exception / interrupt control', 'cpu', 'execution', 780, 1600, 350, 170, 'Exceptions'],
      ['reorder-retirement', 'Reorder buffer (ROB) / in-order retirement (commit)', 'cpu', 'execution', 60, 1810, 1070, 320, 'ROB / retire / commit'],
      ['address-generation', 'Address generation', 'cpu', 'memory-access', 1260, 1600, 250, 170, 'AGU'],
      ['data-cache', 'L1 data cache', 'cache', 'memory-access', 1540, 1600, 250, 170, 'L1D cache'],
      ['data-tlb', 'DTLB / data translation', 'cpu', 'memory-access', 1820, 1600, 250, 170, 'DTLB'],
      ['address-translation', 'MMU / shared TLB and page walking', 'cpu', 'memory-access', 2100, 1600, 230, 170, 'MMU / walker'],
      ['load-store', 'Load/store unit / load queue and store buffer', 'cpu', 'memory-access', 1260, 1810, 1070, 320, 'Load/store unit (LSU)'],
      ['l2-cache', 'L2 cache / private or shared, depending on design', 'cache', 'core', 50, 2200, 1100, 150, 'L2 cache'],
      ['cache-interface', 'Interface to further caches, if present, and the interconnect', 'cpu', 'core', 1250, 2200, 1100, 150, 'Cache / bus interface'],
    ]
    for (const [id, label, role, parent, x, y, width, height, shortLabel] of parts) {
      diagram.region(`component-${id}`, label, role, x, y, width, height, 'component', parent, shortLabel)
      if (showIdle && !used.includes(id)) diagram.fixture(`idle-${id}`, 'not used in this overview', 'idle', x + width / 2, y + (height > 200 ? 190 : height < 130 ? 55 : 80), undefined, Math.min(210, width - 30))
    }
    return diagram
  }

  public static pipeline(diagram: HardwareDiagram): void {
    const paths: readonly [string, string, string][] = [
      ['fetch-decode', 'M390 235H420', 'Fetch to decode'],
      ['decode-queue', 'M750 235H780', 'Decoded instructions enter the instruction queue'],
      ['queue-rename', 'M1110 235H1190V730H225V810', 'Decode to rename and physical-register allocation'],
      ['rename-dispatch', 'M390 895H410V995H1155V980', 'Rename and allocate physical destinations, then dispatch'],
      ['dispatch-issue', 'M1320 895H1360', 'Dispatch into issue queues; issue when operands are ready'],
      ['issue-register-read', 'M1845 980V1000H1100V1030', 'Issue ready instructions and read their physical operands'],
      ['issue-execute', 'M225 1460V1600', 'Read physical registers or bypass operands, then execute'],
      ['execute-writeback', 'M60 1685H35V1010H770V1030', 'Execution writes results back to the PRF; the ROB tracks completion'],
      ['writeback-retire', 'M770 1460V1490H1180V1970H1130', 'After completion, the oldest eligible instruction retires in order'],
      ['fetch-itlb', 'M225 320V370', 'Instruction fetch uses the ITLB for instruction address translation'],
      ['instruction-cache-l2', 'M945 540V715H2370V2175H600V2200', 'Instruction-cache miss requests go to L2; hit and refill timing are not simulated'],
      ['data-cache-l2', 'M1665 1770V1790H1210V2175H600V2200', 'Data-cache miss requests go to L2; hit and refill timing are not simulated'],
      ['l2-interface', 'M1150 2275H1250', 'L2 connects to further caches, if present, and the interconnect'],
    ]
    for (const [id, d, label] of paths) diagram.paths.push({ id: `pipeline-${id}`, d, label, highlighted: false, directed: true })
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
