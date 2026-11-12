import { HardwareDiagram } from '../../../../../visualization/HardwareDiagram.ts'

export class LockedAtomicLayout {
  public static create(flow: string, core: number, instructions: readonly string[], old: readonly (number | null)[], requests: readonly string[]): HardwareDiagram {
    const diagram = new HardwareDiagram(960, 570)
    diagram.region('cpu0', 'CPU / Core 0', 'cpu', 20, 20, 260, 360)
    diagram.region('cpu1', 'CPU / Core 1', 'cpu', 680, 20, 260, 360)
    diagram.region('cache', 'Cache / exclusive line access', 'cache', 330, 20, 300, 190)
    diagram.region('memory', 'Coherent WB line / counter', 'memory', 330, 350, 300, 190)
    diagram.place('owner', 480, 135).place('counter', 480, 465)
    for (let index = 0; index < 2; index += 1) {
      const x = index === 0 ? 150 : 810
      diagram.fixture(`locked-${index}`, 'CPU instruction', instructions[index], x, 135, flow === 'wait' && core === index ? 'waiting for exclusive access' : undefined)
      diagram.place(`old-${index}`, x, 295)
      diagram.connect(`ownership-${index}`, `locked-${index}`, 'owner', flow === 'wait' && core === index ? 'wait for owner' : 'request access', flow === 'acquire' && core === index, 0, `Request: exclusive access to counter for core ${index}`)
      diagram.connect(`write-${index}`, `locked-${index}`, 'counter', flow === 'compare' ? 'compare: unchanged' : 'indivisible update', (flow === 'update' || flow === 'compare') && core === index, index === 0 ? 60 : -60, `Request: ${requests[index]}`)
      diagram.connect(`result-${index}`, 'counter', `old-${index}`, 'return old value', (flow === 'update' || flow === 'compare') && core === index, index === 0 ? -35 : 35, `Data: return old counter = ${old[index] ?? '?'}`)
    }
    return diagram
  }
}
