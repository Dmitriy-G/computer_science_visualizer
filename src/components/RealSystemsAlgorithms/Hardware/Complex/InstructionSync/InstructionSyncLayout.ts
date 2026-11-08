import { HardwareDiagram } from '../../../../../visualization/HardwareDiagram.ts'

export class InstructionSyncLayout {
  public static create(flow: string, core: number): HardwareDiagram {
    const diagram = new HardwareDiagram(960, 640)
    diagram.region('cpu0', 'CPU / Core 0 writer', 'cpu', 20, 20, 280, 590)
    diagram.region('cpu1', 'CPU / Core 1 executor', 'cpu', 660, 20, 280, 590)
    diagram.region('control', 'CPU 0 / maintenance', 'cpu', 340, 20, 280, 160)
    diagram.region('pou-region', 'Memory system / PoU', 'memory', 340, 220, 280, 170)
    diagram.region('dcache-region', 'Core 0 / data cache', 'cache', 35, 220, 250, 170)
    diagram.region('icache0', 'Core 0 / instruction cache', 'cache', 35, 430, 250, 170)
    diagram.region('icache1', 'Core 1 / instruction cache', 'cache', 675, 430, 250, 170)
    diagram.place('pipe-0', 160, 125).place('pipe-1', 800, 125)
    diagram.place('dcache', 160, 315).place('pou', 480, 315)
    diagram.place('ic-0', 160, 525).place('ic-1', 800, 525)
    diagram.fixture('maintenance', 'issued instruction', flow === 'invalidate' ? 'IC IVAU' : flow === 'isb' ? 'ISB' : flow === 'clean' ? 'DC CVAU' : 'DSB / maintenance', 480, 115)
    diagram.fixture('local-isb', 'local CPU instruction', 'ISB', 800, 315)
    diagram.connect('write', 'pipe-0', 'dcache', 'write code bytes', flow === 'write', 35)
    diagram.connect('clean-request', 'maintenance', 'dcache', 'clean request', flow === 'request')
    diagram.connect('clean', 'dcache', 'pou', 'clean to PoU', flow === 'clean')
    diagram.connect('ack', 'pou', 'maintenance', 'DSB completion', flow === 'complete', 35)
    for (let index = 0; index < 2; index += 1) {
      diagram.connect(`invalidate-${index}`, 'maintenance', `ic-${index}`, 'invalidate I-cache', flow === 'invalidate', index === 0 ? 85 : -85)
      diagram.connect(`refill-${index}`, 'pou', `ic-${index}`, 'fetch new bytes', flow === 'fetch' && core === index)
      diagram.connect(`fetch-${index}`, `ic-${index}`, `pipe-${index}`, 'instruction fetch', flow === 'fetch' && core === index, index === 0 ? -125 : 125)
    }
    diagram.connect('isb0', 'maintenance', 'pipe-0', 'local ISB', flow === 'isb' && core === 0)
    diagram.connect('isb1', 'local-isb', 'pipe-1', 'local ISB', flow === 'isb' && core === 1, -35)
    return diagram
  }
}
