import { HardwareDiagram } from '../../../../../visualization/HardwareDiagram.ts'

export class ExclusiveMonitorLayout {
  public static create(flow: string, core: number): HardwareDiagram {
    const diagram = new HardwareDiagram(960, 590)
    diagram.region('cpu0', 'CPU / Core 0', 'cpu', 20, 20, 260, 360)
    diagram.region('cpu1', 'CPU / Core 1', 'cpu', 680, 20, 260, 360)
    diagram.region('global', 'Global monitor conditions', 'interconnect', 350, 20, 260, 360)
    diagram.region('memory', 'Shared memory / granule', 'memory', 350, 410, 260, 160)
    diagram.place('local-0', 150, 135).place('loaded-0', 150, 295)
    diagram.place('local-1', 810, 135).place('loaded-1', 810, 295)
    diagram.place('global-0', 480, 135).place('global-1', 480, 295).place('counter', 480, 510)
    for (let index = 0; index < 2; index += 1) {
      diagram.connect(`reserve-${index}`, `local-${index}`, `global-${index}`, 'reservation', flow === 'load' && core === index, index === 1 ? 45 : 0)
      diagram.connect(`load-${index}`, 'counter', `loaded-${index}`, 'LDXR read', flow === 'load' && core === index, index === 0 ? -35 : 35)
      diagram.connect(`store-${index}`, `loaded-${index}`, 'counter', flow === 'fail' && core === index ? 'STXR failed' : 'STXR write', flow === 'store' && core === index, index === 0 ? 55 : -55)
      if (flow === 'fail' && core === index) diagram.connect('failed-condition', `global-${index}`, `loaded-${index}`, 'failure status = 1', true, -35)
    }
    diagram.connect('invalidate', 'counter', `global-${core === 0 ? 1 : 0}`, 'invalidate reservation', flow === 'store', 160)
    return diagram
  }
}
