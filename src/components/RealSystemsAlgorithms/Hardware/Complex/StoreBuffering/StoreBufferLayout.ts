import { HardwareDiagram } from '../../../../../visualization/HardwareDiagram.ts'

export class StoreBufferLayout {
  public static create(flow: string, core: number, memory: Readonly<{ x: number, y: number }>): HardwareDiagram {
    const diagram = new HardwareDiagram(960, 500)
    diagram.region('cpu0', 'CPU / Core 0', 'cpu', 20, 20, 260, 445)
    diagram.region('memory', 'Shared WB memory', 'memory', 350, 120, 260, 345)
    diagram.region('cpu1', 'CPU / Core 1', 'cpu', 680, 20, 260, 445)
    diagram.place('c0-pc', 150, 115).place('c0-buffer', 150, 245).place('c0-r', 150, 385)
    diagram.place('mem-x', 480, 245).place('mem-y', 480, 385)
    diagram.place('c1-pc', 810, 115).place('c1-r', 810, 245).place('c1-buffer', 810, 385)
    for (let index = 0; index < 2; index += 1) {
      const own = index === 0 ? 'x' : 'y'
      const other = index === 0 ? 'y' : 'x'
      diagram.connect(`issue-${index}`, `c${index}-pc`, `c${index}-buffer`, 'issue store', flow === 'store' && core === index, index === 0 ? -35 : 120, `Data: buffer ${own} = 1 in core ${index}`)
      diagram.connect(`drain-${index}`, `c${index}-buffer`, `mem-${own}`, `publish ${own}`, flow === 'drain' && core === index, 0, `Data: publish ${own} = 1 to shared memory`)
      diagram.connect(`load-${index}`, `mem-${other}`, `c${index}-r`, `load ${other}`, flow === 'load' && core === index, 0, `Data: read ${other} = ${memory[other]}`)
      diagram.connect(`forward-${index}`, `c${index}-buffer`, `c${index}-r`, 'inspect local forwarding', flow === 'forward' && core === index, 35, `Data: local buffer would supply ${own} = 1; register unchanged`)
    }
    return diagram
  }
}
