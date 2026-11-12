import { HardwareModel } from '../HardwareModel.ts'
import { TranslationLayout } from './TranslationLayout.ts'

interface Descriptor {
  kind: 'table' | 'page'
  target: number
}

export class TranslationModel {
  private flow = 'none'
  private readLevel = 0
  public readonly va = 0x123456789abc
  public readonly indices: number[] = []
  public readonly tables = new Map<number, Map<number, Descriptor>>()
  public readonly tlb = new Map<number, number>()
  public physical: number | null = null
  public level = 0
  public table = 0x1000
  public walking = false
  public last = 'not started'
  public reads = 0
  private maintenance: 'none' | 'broken' | 'visible' | 'invalidating' | 'complete' = 'none'

  constructor() {
    for (const shift of [39, 30, 21, 12]) this.indices.push(Math.floor(this.va / 2 ** shift) % 512)
    for (let level = 0; level < 4; level += 1) {
      this.tables.set(0x1000 * (level + 1), new Map([[this.indices[level], {
        kind: level === 3 ? 'page' : 'table', target: level === 3 ? 0x80000 : 0x1000 * (level + 2),
      }]]))
    }
  }
  public begin(): boolean {
    if (this.maintenance !== 'none') throw new Error('Translation is quiesced for maintenance')
    this.physical = null
    const page = Math.floor(this.va / 4096)
    const cached = this.tlb.get(page)
    if (cached !== undefined) {
      this.physical = cached * 4096 + this.va % 4096
      this.flow = 'hit'
      this.last = 'TLB hit'
      this.walking = false
      return true
    }
    this.level = 0
    this.table = 0x1000
    this.walking = true
    this.flow = 'miss'
    this.last = 'TLB miss'
    return false
  }
  public walkNext(): void {
    if (!this.walking) throw new Error('No table walk in progress')
    const descriptor = this.tables.get(this.table)?.get(this.indices[this.level])
    if (!descriptor) throw new Error('Translation fault: invalid descriptor')
    this.readLevel = this.level
    this.flow = descriptor.kind === 'page' ? 'fill' : 'walk'
    this.reads += 1
    this.last = `L${this.level}[${this.indices[this.level]}]`
    if (descriptor.kind === 'page') {
      this.tlb.set(Math.floor(this.va / 4096), descriptor.target)
      this.physical = descriptor.target * 4096 + this.va % 4096
      this.walking = false
    } else {
      this.table = descriptor.target
      this.level += 1
    }
  }
  public breakMapping(): void {
    if (this.walking || this.maintenance !== 'none') throw new Error('Finish the walk first')
    this.tables.get(0x4000)!.delete(this.indices[3])
    this.maintenance = 'broken'
    this.physical = null
    this.flow = 'break'
    this.last = 'PTE invalid'
  }
  public publishBreak(): void {
    if (this.maintenance !== 'broken') throw new Error('Invalidate the PTE first')
    this.maintenance = 'visible'
    this.flow = 'publish'
    this.last = 'DSB ISHST'
  }
  public tlbi(): void {
    if (this.maintenance !== 'visible') throw new Error('Publish invalid PTE first')
    this.maintenance = 'invalidating'
    this.flow = 'tlbi'
    this.last = 'TLBI VAE1IS pending'
  }
  public completeTlbi(): void {
    if (this.maintenance !== 'invalidating') throw new Error('Issue TLBI first')
    this.tlb.delete(Math.floor(this.va / 4096))
    this.maintenance = 'complete'
    this.flow = 'tlbi'
    this.last = 'DSB ISH; ISB'
  }
  public makeMapping(frame: number): void {
    if (this.maintenance !== 'complete') throw new Error('Complete break-before-make first')
    this.tables.get(0x4000)!.set(this.indices[3], { kind: 'page', target: frame })
    this.maintenance = 'none'
    this.flow = 'make'
    this.last = 'new PTE; DSB ISHST'
  }
  public snapshot(): HardwareModel {
    const cells = []
    for (let level = 0; level < 4; level += 1) {
      const entry = this.tables.get(0x1000 * (level + 1))!.get(this.indices[level])
      cells.push({ id: `level-${level}`, label: `L${level}[${this.indices[level]}]`, value: entry ? `${entry.kind === 'page' ? 'PFN' : 'table'} ${entry.target.toString(16)}` : 'invalid' })
    }
    const frame = this.tlb.get(Math.floor(this.va / 4096))
    return new HardwareModel([
      { name: 'Address', cells: [
        { id: 'va', label: 'VA', value: this.va.toString(16) },
        { id: 'offset', label: 'page offset', value: (this.va % 4096).toString(16) },
        { id: 'pa', label: 'PA', value: this.physical === null ? '?' : this.physical.toString(16) },
      ] },
      { name: 'Tables', cells },
      { name: 'TLB', cells: [
        { id: 'tlb', label: 'cached PFN', value: frame === undefined ? 'empty' : frame.toString(16) },
        { id: 'walk', label: 'table reads', value: `${this.reads}`, status: this.last },
      ] },
    ], 'Cortex-A710 hardware translation-table walk concept. Illustrative EL1 stage-1 configuration: 48-bit VA, 4 KiB pages, four 9-bit indices, 12-bit offset, one ASID. Addresses displayed in hexadecimal. No stage 2, blocks, permissions, faults, TLB hierarchy, or replacement-policy simulation. Mapping changes are quiesced and use a simplified break-before-make maintenance sequence.', this.walking ? `level-${this.level}` : 'tlb', 0, TranslationLayout.create(this.flow, this.readLevel, this.va.toString(16), cells, frame === undefined ? null : frame.toString(16), this.physical === null ? null : this.physical.toString(16)))
  }
}
