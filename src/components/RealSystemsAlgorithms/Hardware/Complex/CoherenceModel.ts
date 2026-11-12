import { HardwareModel } from './HardwareModel.ts'
import { CoherenceLayout } from './CoherenceLayout.ts'

export type CoherenceState = 'M' | 'O' | 'E' | 'S' | 'I' | 'F'
interface CacheCopy {
  state: CoherenceState
  x: number
  y: number
}

// Shared line-transfer primitives; the named protocol selects its state policy.
export abstract class CoherenceModel {
  public readonly caches: CacheCopy[] = [
    { state: 'I', x: 0, y: 0 }, { state: 'I', x: 0, y: 0 }, { state: 'I', x: 0, y: 0 },
  ]
  private flow = 'none'
  private source = 0
  private target = 0
  private invalidated: number[] = []
  private wroteBack = false
  private instructions = ['no access yet', 'no access yet', 'no access yet']
  public memory = { x: 0, y: 0 }
  public transfer = 'none'
  protected abstract readonly protocol: 'MOESI' | 'MESIF'

  public read(core: number, field: 'x' | 'y' = 'x'): number {
    this.wroteBack = false
    this.target = core
    this.instructions[core] = `read ${field}`
    const target = this.caches[core]
    if (target.state !== 'I') {
      this.flow = 'hit'
      this.transfer = `C${core} hit`
      return target[field]
    }
    let supplier = -1
    // Prefer the protocol's designated dirty owner or clean forwarder.
    for (let index = 0; index < this.caches.length; index += 1) {
      const state = this.caches[index].state
      if (state === 'M' || state === 'O' || state === 'F') {
        supplier = index
        break
      }
      if (state !== 'I' && supplier === -1) supplier = index
    }
    if (supplier === -1) {
      target.x = this.memory.x
      target.y = this.memory.y
      target.state = 'E'
      this.flow = 'read-memory'
      this.transfer = `Memory -> C${core}`
    } else {
      const source = this.caches[supplier]
      target.x = source.x
      target.y = source.y
      if (this.protocol === 'MOESI') {
        if (source.state === 'M') source.state = 'O'
        else if (source.state === 'E') source.state = 'S'
      } else {
        if (source.state === 'M') {
          this.memory = { x: source.x, y: source.y }
          this.wroteBack = true
        }
        if (source.state === 'M' || source.state === 'E') source.state = 'F'
      }
      target.state = 'S'
      this.flow = 'forward'
      this.source = supplier
      this.transfer = `C${supplier} -> C${core}`
    }
    return target[field]
  }

  public write(core: number, field: 'x' | 'y', value: number): void {
    if (this.caches[core].state === 'I') this.read(core, field)
    this.invalidated = []
    for (let index = 0; index < this.caches.length; index += 1) {
      if (index !== core && this.caches[index].state !== 'I') this.invalidated.push(index)
      if (index !== core) this.caches[index].state = 'I'
    }
    this.flow = 'write'
    this.target = core
    this.instructions[core] = `write ${field}=${value}`
    this.caches[core][field] = value
    this.caches[core].state = 'M'
    this.transfer = `C${core} invalidates peers`
  }

  public evict(core: number): void {
    this.wroteBack = false
    const copy = this.caches[core]
    const previous = copy.state
    this.flow = previous === 'M' || previous === 'O' ? 'evict-dirty' : 'evict-clean'
    this.source = core
    this.instructions[core] = 'evict cache line'
    if (previous === 'M' || previous === 'O') this.memory = { x: copy.x, y: copy.y }
    copy.state = 'I'
    this.transfer = previous === 'M' || previous === 'O' ? `C${core} -> Memory` : `C${core} evicts clean`
    if (previous === 'F') {
      // Deterministic teaching responder choice, not a claimed Intel policy.
      for (const remaining of this.caches) {
        if (remaining.state === 'S') {
          remaining.state = 'F'
          break
        }
      }
    }
  }

  public snapshot(): HardwareModel {
    const cells = []
    const lines: string[] = []
    for (let index = 0; index < this.caches.length; index += 1) {
      const cache = this.caches[index]
      lines.push(`x=${cache.x}, y=${cache.y}`)
      cells.push({ id: `cache-${index}`, label: `C${index} line`, value: cache.state === 'I' ? 'I' : `${cache.state}: ${cache.x},${cache.y}`, status: 'state: x,y' })
    }
    return new HardwareModel([
      { name: this.protocol, cells },
      { name: 'Memory', cells: [
        { id: 'memory', label: 'line x,y', value: `${this.memory.x},${this.memory.y}`, status: 'may lag a dirty owner' },
        { id: 'transfer', label: 'last transaction', value: this.transfer },
      ] },
    ], `${this.protocol === 'MOESI' ? 'Cortex-A53 coherent L1 data caches: M Modified, O Owned (dirty shared owner), E Exclusive, S Shared, I Invalid.' : 'Xeon 7500-series QuickPath/LLC protocol: M Modified, E Exclusive, S Shared, I Invalid, F Forward (clean responder).'} Three conceptual agents, one shared cache line holding distinct variables x and y. Transfers and responder selection are deterministic teaching choices, not vendor arbitration. Coherence of a line does not order other memory locations.`, null, 0, CoherenceLayout.create(this.protocol, this.flow, this.source, this.target, this.instructions, this.invalidated, this.wroteBack, lines, `x=${this.memory.x}, y=${this.memory.y}`))
  }
}
