import { HardwareDiagram } from '../../../../visualization/HardwareDiagram.ts'

export class CoherenceLayout {
  public static create(protocol: string, flow: string, source: number, target: number, instructions: readonly string[], invalidated: readonly number[], wroteBack: boolean): HardwareDiagram {
    const diagram = new HardwareDiagram(960, 760)
    for (let core = 0; core < 3; core += 1) {
      const x = 20 + core * 320
      const center = x + 140
      diagram.region(`cpu${core}`, `CPU / Core ${core}`, 'cpu', x, 20, 280, 355)
      diagram.region(`cache-region${core}`, protocol === 'MOESI' ? 'L1 data cache' : 'Coherent cache agent', 'cache', x + 15, 200, 250, 165)
      diagram.fixture(`access-${core}`, 'CPU memory access', instructions[core], center, 125)
      diagram.place(`cache-${core}`, center, 300)
      diagram.connect(`access-link-${core}`, `access-${core}`, `cache-${core}`, 'line access', core === target && (flow === 'write' || flow === 'hit'))
      const sending = flow === 'forward' && core === source || flow === 'write' && core === target || flow === 'evict-dirty' && core === source
      diagram.connect(`fabric-${core}`, `cache-${core}`, 'transfer', 'coherence request', sending, core === 1 ? 100 : 0)
    }
    diagram.region('fabric', `${protocol} / interconnect`, 'interconnect', 330, 400, 300, 160)
    diagram.region('memory-region', 'Memory / backing line', 'memory', 330, 580, 300, 160)
    diagram.place('transfer', 480, 500, 245).place('memory', 480, 680)
    diagram.connect('memory-path', 'transfer', 'memory', flow === 'evict-dirty' || wroteBack ? 'write back line' : 'memory path', flow === 'evict-dirty' || flow === 'forward' && wroteBack, 45)
    if (flow === 'read-memory') {
      diagram.connect('memory-read', 'memory', 'transfer', 'read current line', true, 45)
      diagram.connect('read-response', 'transfer', `cache-${target}`, 'line response', true, target === 1 ? 100 : 30)
    }
    if (flow === 'forward') diagram.connect('forward', 'transfer', `cache-${target}`, 'forward current line', true, target === 1 ? 100 : 30)
    if (flow === 'write') {
      for (const peer of invalidated) {
        diagram.connect(`invalidate-${peer}`, 'transfer', `cache-${peer}`, 'invalidate line', true, peer === 1 ? 100 : 30)
      }
    }
    return diagram
  }
}
