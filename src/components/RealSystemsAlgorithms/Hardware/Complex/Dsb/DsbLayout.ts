import { HardwareDiagram } from '../../../../../visualization/HardwareDiagram.ts'

export class DsbLayout {
  public static create(flow: string): HardwareDiagram {
    const diagram = new HardwareDiagram(960, 550)
    diagram.region('cpu', 'CPU / Core 0', 'cpu', 20, 20, 260, 475)
    diagram.region('cache', 'Core 0 / data cache', 'cache', 350, 20, 260, 210)
    diagram.region('pou-region', 'Memory system / PoU', 'memory', 350, 320, 260, 175)
    diagram.region('ram-region', 'Backing RAM', 'memory', 680, 320, 260, 175)
    diagram.place('clean-request', 150, 125).place('barrier', 150, 275).place('continue', 150, 425)
    diagram.place('cache-clean', 480, 125).place('pou', 480, 425)
    diagram.fixture('ram', 'DC CVAU target is PoU', 'no RAM flush', 810, 425)
    diagram.connect('request', 'clean-request', 'cache-clean', 'clean request', flow === 'request', 0, 'Request: DC CVAU, clean the cache line at x0 to PoU')
    diagram.connect('clean', 'cache-clean', 'pou', 'clean line to PoU', flow === 'clean', 0, 'Data: cache line at x0 contains 42')
    diagram.connect('ack', 'pou', 'barrier', 'completion', flow === 'ack', -45, 'Response: cache clean to PoU is complete')
    diagram.connect('resume', 'barrier', 'continue', flow === 'wait' ? 'DSB waits' : 'continue CPU', flow === 'continue', -40, 'Control: allow the following ADD instruction to execute')
    return diagram
  }
}
