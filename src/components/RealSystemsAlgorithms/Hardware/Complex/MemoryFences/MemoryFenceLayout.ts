import { HardwareDiagram } from '../../../../../visualization/HardwareDiagram.ts'

export class MemoryFenceLayout {
  public static create(flow: string): HardwareDiagram {
    const diagram = new HardwareDiagram(960, 570)
    diagram.region('cpu', 'CPU / Core 0', 'cpu', 20, 20, 260, 520)
    diagram.region('wc-buffer', 'CPU / WC write buffer', 'cache', 350, 20, 260, 215)
    diagram.region('memory', 'Memory / WC + WB', 'memory', 680, 20, 260, 520)
    diagram.fixture('wc-store', 'payload store instruction', 'MOV [payload],42', 150, 135)
    diagram.fixture('wc-buffer-cell', 'buffered payload', '42', 480, 135)
    diagram.fixture('flag-store', 'flag store instruction', 'MOV [flag],1', 150, 305)
    diagram.place('wc', 810, 135).place('flag', 810, 305)
    diagram.place('load', 150, 465).place('later', 480, 465)
    diagram.region('execution', 'CPU / following execution', 'cpu', 350, 365, 260, 175)
    diagram.fixture('load-source', 'read response', 'memory data', 810, 465)
    diagram.connect('buffer', 'wc-store', 'wc-buffer-cell', 'buffer write', flow === 'none')
    diagram.connect('wc-publish', 'wc-buffer-cell', 'wc', 'WC store', flow === 'wc')
    diagram.connect('flag-publish', 'flag-store', 'flag', flow === 'blocked-store' ? 'SFENCE: wait' : 'WB store', flow === 'flag', -35)
    diagram.connect('load-response', 'load-source', 'load', 'load response', flow === 'load', 100)
    diagram.connect('load-request', 'load', 'load-source', 'read request', flow === 'load-request', 80)
    diagram.connect('execute', 'load', 'later', flow === 'blocked-load' ? 'LFENCE: wait' : 'local execution', flow === 'execute')
    return diagram
  }
}
