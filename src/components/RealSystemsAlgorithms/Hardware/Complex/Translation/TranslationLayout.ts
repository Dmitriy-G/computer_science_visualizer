import { HardwareDiagram } from '../../../../../visualization/HardwareDiagram.ts'

export class TranslationLayout {
  public static create(flow: string, level: number, va: string, descriptors: readonly { readonly label: string, readonly value: string }[], frame: string | null, pa: string | null): HardwareDiagram {
    const diagram = new HardwareDiagram(960, 710)
    diagram.region('cpu', 'CPU / Core 0', 'cpu', 20, 20, 300, 650)
    diagram.region('mmu', 'CPU / MMU hardware', 'cache', 400, 20, 540, 225)
    diagram.region('tables', 'Memory / translation tables', 'memory', 400, 335, 540, 335)
    diagram.place('va', 170, 130).place('offset', 170, 290).place('pa', 170, 450)
    diagram.fixture('maintenance', 'EL1 maintenance instruction', 'PTE / TLBI / DSB', 170, 610)
    diagram.place('tlb', 535, 130).place('walk', 805, 130)
    diagram.place('level-0', 535, 440).place('level-1', 805, 440)
    diagram.place('level-2', 535, 600).place('level-3', 805, 600)
    diagram.connect('lookup', 'va', 'tlb', 'TLB lookup', flow === 'hit' || flow === 'miss', 0, `Request: look up virtual address 0x${va} in the TLB`)
    diagram.connect('miss', 'tlb', 'walk', 'miss: walk', flow === 'miss', 0, `Control: TLB miss for VA 0x${va}; start a table walk`)
    diagram.connect('root', 'walk', 'level-0', 'TTBR root', flow === 'walk' && level === 0, 0, `Request: read ${descriptors[0].label} (${descriptors[0].value})`)
    for (let index = 0; index < 3; index += 1) diagram.connect(`level-link-${index}`, `level-${index}`, `level-${index + 1}`, 'next descriptor', flow === 'walk' && level === index + 1 || flow === 'fill' && index === 2, 0, `Request: follow next table to ${descriptors[index + 1].label} (${descriptors[index + 1].value})`)
    diagram.connect('fill', 'level-3', 'tlb', 'fill translation', flow === 'fill', 105, `Data: cache physical frame 0x${frame ?? '?'} in the TLB`)
    diagram.connect('result', 'tlb', 'pa', 'frame + offset', flow === 'hit' || flow === 'fill', -55, `Data: physical address = 0x${pa ?? '?'} (frame + page offset)`)
    diagram.connect('offset-bits', 'offset', 'pa', 'retain offset', false, 45, 'Data: retain the low 12 page-offset bits')
    diagram.connect('pte-write', 'maintenance', 'level-3', 'update PTE', flow === 'break' || flow === 'make', 45, `Data: write ${descriptors[3].label} = ${descriptors[3].value}`)
    diagram.connect('tlbi', 'maintenance', 'tlb', 'TLBI / completion', flow === 'tlbi', -110, frame === null ? `Control: completed TLBI removes cached VA 0x${va}` : `Request: invalidate the cached translation for VA 0x${va}`)
    return diagram
  }
}
