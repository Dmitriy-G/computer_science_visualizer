import { HardwareDiagram } from '../../../../../visualization/HardwareDiagram.ts'

export class TranslationLayout {
  public static create(flow: string, level: number): HardwareDiagram {
    const diagram = new HardwareDiagram(960, 710)
    diagram.region('cpu', 'CPU / Core 0', 'cpu', 20, 20, 300, 650)
    diagram.region('mmu', 'CPU / MMU hardware', 'cache', 400, 20, 540, 225)
    diagram.region('tables', 'Memory / translation tables', 'memory', 400, 335, 540, 335)
    diagram.place('va', 170, 130).place('offset', 170, 290).place('pa', 170, 450)
    diagram.fixture('maintenance', 'EL1 maintenance instruction', 'PTE / TLBI / DSB', 170, 610)
    diagram.place('tlb', 535, 130).place('walk', 805, 130)
    diagram.place('level-0', 535, 440).place('level-1', 805, 440)
    diagram.place('level-2', 535, 600).place('level-3', 805, 600)
    diagram.connect('lookup', 'va', 'tlb', 'TLB lookup', flow === 'hit' || flow === 'miss')
    diagram.connect('miss', 'tlb', 'walk', 'miss: walk', flow === 'miss')
    diagram.connect('root', 'walk', 'level-0', 'TTBR root', flow === 'walk' && level === 0)
    for (let index = 0; index < 3; index += 1) diagram.connect(`level-link-${index}`, `level-${index}`, `level-${index + 1}`, 'next descriptor', flow === 'walk' && level === index + 1)
    diagram.connect('fill', 'level-3', 'tlb', 'fill translation', flow === 'fill', 105)
    diagram.connect('result', 'tlb', 'pa', 'frame + offset', flow === 'hit' || flow === 'fill', -55)
    diagram.connect('offset-bits', 'offset', 'pa', 'retain offset', false, 45)
    diagram.connect('pte-write', 'maintenance', 'level-3', 'update PTE', flow === 'break' || flow === 'make', 45)
    diagram.connect('tlbi', 'maintenance', 'tlb', 'TLBI / completion', flow === 'tlbi', -110)
    return diagram
  }
}
