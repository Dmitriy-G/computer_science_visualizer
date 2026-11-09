export type FlashPageState = 'free' | 'staged' | 'valid' | 'invalid' | 'failed'

export interface FlashPage {
  state: FlashPageState
  lba: number | null
  data: string
}

// Shared media and mapping primitives, not a victim-selection or wear policy.
export class FlashStorage {
  public static readonly pagesPerBlock = 3
  public readonly pages: FlashPage[] = []
  public readonly mapping = new Map<number, number>()
  public readonly erases = [0, 0, 0]
  public hostWrites = 0
  public flashWrites = 0
  public operation = 'idle'
  public detail = 'Page-mapped teaching policy. Mapping persistence and crash recovery are not simulated.'
  public flowFrom: string | null = null
  public flowTo: string | null = null
  public selectedBlock: number | null = null
  public output = 'no data returned'
  private pending: { lba: number, page: number, host: boolean } | null = null

  constructor() {
    for (let index = 0; index < 9; index += 1) this.pages.push({ state: 'free', lba: null, data: '' })
  }

  public lookup(lba: number): number {
    const page = this.mapping.get(lba)
    if (page === undefined) throw new RangeError('Unmapped logical page')
    this.operation = 'lookup'
    this.flowFrom = 'host'
    this.flowTo = `map-${lba}`
    return page
  }

  public read(lba: number): string {
    const page = this.mapping.get(lba)
    if (page === undefined || this.pages[page].state !== 'valid') throw new Error('Read requires a valid mapping')
    this.output = this.pages[page].data
    this.operation = 'read'
    this.flowFrom = `page-${page}`
    this.flowTo = 'host'
    return this.output
  }

  public program(lba: number, data: string, page: number, host = true, success = true): boolean {
    if (!Number.isInteger(lba) || lba < 0 || lba > 2) throw new RangeError('Teaching LBAs are 0 through 2')
    if (this.pending || this.pages[page]?.state !== 'free') throw new Error('Program requires erased space and no pending update')
    this.operation = success ? 'program / not mapped yet' : 'program failed / old mapping retained'
    this.flowFrom = host ? 'host' : `page-${this.mapping.get(lba)}`
    this.flowTo = `page-${page}`
    if (!success) {
      this.pages[page] = { state: 'failed', lba: null, data: '' }
      return false
    }
    this.pages[page] = { state: 'staged', lba, data }
    this.flashWrites += 1
    this.pending = { lba, page, host }
    return true
  }

  public commit(): void {
    if (!this.pending) throw new Error('Commit requires a successfully programmed replacement')
    const { lba, page, host } = this.pending
    const previous = this.mapping.get(lba)
    if (previous !== undefined) this.pages[previous].state = 'invalid'
    this.mapping.set(lba, page)
    this.pages[page].state = 'valid'
    if (host) this.hostWrites += 1
    this.pending = null
    this.operation = 'mapping committed'
    this.flowFrom = `map-${lba}`
    this.flowTo = `page-${page}`
  }

  public write(lba: number, data: string, page: number): void {
    this.program(lba, data, page)
    this.commit()
  }

  public livePages(block: number): number[] {
    const live: number[] = []
    for (let index = block * 3; index < block * 3 + 3; index += 1) if (this.pages[index].state === 'valid') live.push(index)
    return live
  }

  public freeBlock(block: number): boolean {
    for (let index = block * 3; index < block * 3 + 3; index += 1) if (this.pages[index].state !== 'free') return false
    return true
  }

  public erase(block: number): void {
    if (!Number.isInteger(block) || block < 0 || block >= this.erases.length) throw new RangeError('Unknown erase block')
    for (let index = block * 3; index < block * 3 + 3; index += 1) {
      if (!['free', 'invalid'].includes(this.pages[index].state)) throw new Error('Do not erase live, staged, or failed pages')
    }
    for (let index = block * 3; index < block * 3 + 3; index += 1) this.pages[index] = { state: 'free', lba: null, data: '' }
    this.erases[block] += 1
    this.selectedBlock = block
    this.operation = 'block erased / reusable'
    this.flowFrom = 'controller'
    this.flowTo = `erase-${block}`
  }

  public copy(source: number, destination: number): void {
    const page = this.pages[source]
    if (page?.state !== 'valid' || page.lba === null || this.mapping.get(page.lba) !== source) throw new Error('Relocate only the current live copy')
    this.program(page.lba, page.data, destination, false)
  }
}
