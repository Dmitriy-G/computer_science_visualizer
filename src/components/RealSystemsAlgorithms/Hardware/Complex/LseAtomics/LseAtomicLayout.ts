import { HardwareDiagram } from '../../../../../visualization/HardwareDiagram.ts'

export class LseAtomicLayout {
  public static create(core: number, operations: readonly string[], old: readonly (number | null)[], requests: readonly string[]): HardwareDiagram {
    const diagram = new HardwareDiagram(960, 440)
    diagram.region('cpu0', 'CPU / Core 0', 'cpu', 20, 20, 260, 360)
    diagram.region('cpu1', 'CPU / Core 1', 'cpu', 680, 20, 260, 360)
    diagram.region('memory', 'Coherent memory location', 'memory', 350, 180, 260, 200)
    diagram.place('counter', 480, 295)
    for (let index = 0; index < 2; index += 1) {
      const x = index === 0 ? 150 : 810
      diagram.place(`old-${index}`, x, 135)
      diagram.fixture(`atomic-${index}`, 'architectural instruction', operations[index] === 'none' ? 'LSE atomic' : operations[index].split(' ')[0], x, 295, operations[index] === 'none' ? 'FEAT_LSE required' : operations[index])
      diagram.connect(`rmw-${index}`, `atomic-${index}`, 'counter', operations[index] === 'CASAL mismatch' ? 'compare: no store' : 'atomic RMW', core === index, 0, `Request: ${requests[index]}`)
      diagram.connect(`return-${index}`, 'counter', `old-${index}`, 'return old value', core === index, index === 0 ? -30 : 30, `Data: return old counter = ${old[index] ?? '?'}`)
    }
    return diagram
  }
}
