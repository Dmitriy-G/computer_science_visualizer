import { HardwareDiagram } from '../../../../../visualization/HardwareDiagram.ts'

export class InstructionSyncLayout {
  public static create(flow: string, core: number, data: number, pou: number): HardwareDiagram {
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
    diagram.fixture('maintenance', 'issued instruction', flow === 'invalidate' ? 'IC IVAU' : flow === 'isb' ? 'ISB' : flow === 'request' ? 'DC CVAU' : 'DSB / maintenance', 480, 115)
    diagram.fixture('local-isb', 'local CPU instruction', 'ISB', 800, 315)
    diagram.connect('write', 'pipe-0', 'dcache', 'write code bytes', flow === 'write', 35, `Data: new instruction bytes for MOV w0,#${data}`)
    diagram.connect('clean-request', 'maintenance', 'dcache', 'clean request', flow === 'request', 0, 'Request: DC CVAU, clean the modified code line to PoU')
    diagram.connect('clean', 'dcache', 'pou', 'clean to PoU', flow === 'clean', 0, `Data: code line containing MOV w0,#${data}`)
    diagram.connect('ack', 'pou', 'maintenance', 'data-clean completion', flow === 'clean', 35, 'Response: code clean to PoU is complete')
    for (let index = 0; index < 2; index += 1) {
      diagram.connect(`invalidate-${index}`, 'maintenance', `ic-${index}`, 'invalidate I-cache', flow === 'invalidate', index === 0 ? 85 : -85, `Control: invalidate core ${index}'s cached code line`)
      diagram.connect(`invalidate-complete-${index}`, `ic-${index}`, 'maintenance', 'invalidation completion', flow === 'complete', index === 0 ? -85 : 85, `Response: core ${index}'s code-line invalidation is complete`)
      diagram.connect(`refill-${index}`, 'pou', `ic-${index}`, 'fetch new bytes', flow === 'fetch' && core === index, 0, `Data: refill code line with MOV w0,#${pou}`)
      diagram.connect(`fetch-${index}`, `ic-${index}`, `pipe-${index}`, 'instruction fetch', flow === 'fetch' && core === index, index === 0 ? -125 : 125, `Data: fetch MOV w0,#${pou} into core ${index}'s instruction stream`)
    }
    diagram.connect('isb0', 'maintenance', 'pipe-0', 'local ISB', flow === 'isb' && core === 0, 0, 'Control: core 0 discards its fetched stream and must refetch')
    diagram.connect('isb1', 'local-isb', 'pipe-1', 'local ISB', flow === 'isb' && core === 1, -35, 'Control: core 1 discards its fetched stream and must refetch')
    return diagram
  }
}
