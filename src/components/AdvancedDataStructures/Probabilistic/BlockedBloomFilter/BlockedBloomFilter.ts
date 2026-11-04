import { AppliedModel } from '../../../../visualization/AppliedModel.ts'
import type { AppliedDiagram, DiagramItem } from '../../../../visualization/AppliedModel.ts'
import { LinearModel } from '../../../../visualization/LinearModel.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'

export class BlockedBloomFilter extends AppliedModel {
  public readonly kind = 'blocked-bloom-filter'
  public readonly representation = 'Eight 32-bit blocks. One seeded hash selects a block and three separately mixed hashes choose bits inside it. Positives mean possibly present; negatives mean definitely absent. No exact-key registry or deletion is stored. Hashes are deterministic teaching mixers, not cryptographic or independence guarantees.'
  public readonly countLabel = 'add operations'
  private blocks = new Uint32Array(8)
  private additions = 0
  public get length(): number { return this.additions }
  public static createDefault(): BlockedBloomFilter {
    const model = new BlockedBloomFilter()
    for (let value = 1; value <= 10; value += 1) model.execute('insert', { value: value * 10 })
    return model
  }
  public clone(): BlockedBloomFilter {
    const copy = new BlockedBloomFilter()
    copy.blocks = this.blocks.slice()
    copy.additions = this.additions
    return copy
  }
  private hash(value: number, seed: number): number {
    let hash = seed >>> 0
    for (const character of String(value)) {
      hash ^= character.charCodeAt(0)
      hash = Math.imul(hash, 16777619) >>> 0
    }
    hash ^= hash >>> 16
    hash = Math.imul(hash, 0x7feb352d) >>> 0
    return (hash ^ (hash >>> 15)) >>> 0
  }
  public getDiagram(): AppliedDiagram {
    const rows: DiagramItem[][] = []
    for (let block = 0; block < 8; block += 1) {
      const row: DiagramItem[] = []
      for (let byte = 0; byte < 4; byte += 1) row.push({ id: `blocked-${block}-${byte}`, text: ((this.blocks[block] >>> (byte * 8)) & 255).toString(2).padStart(8, '0'), label: `block ${block} / bits ${byte * 8 + 7}..${byte * 8}` })
      rows.push(row)
    }
    return { rows }
  }
  public execute(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    if (action === 'inspect-storage') return this.inspect(observer)
    if (action === 'clear') {
      for (let block = 0; block < 8; block += 1) {
        LinearModel.emit(observer, `blocked-${block}-0`, `Zero block ${block}.`, 'blocks[block] = 0')
        this.blocks[block] = 0
      }
      this.additions = 0
      return { description: 'Cleared all 256 bits and the add-operation count.' }
    }
    const value = LinearModel.integer(input, 'value')
    if (action !== 'insert' && action !== 'search-value') throw new RangeError('Unsupported blocked Bloom action')
    if (action === 'insert' && this.additions === 64) return this.reject('At most 64 add operations are supported before clearing.')
    const block = this.hash(value, 2166136261) % 8
    const probes = [0x9e3779b9, 0x85ebca6b, 0xc2b2ae35].map((seed) => this.hash(value, seed) % 32)
    let activeId: string | null = null
    for (const bit of probes) {
      activeId = `blocked-${block}-${Math.floor(bit / 8)}`
      LinearModel.emit(observer, activeId, `Probe block ${block}, bit ${bit}.`, 'block = hashBlock(value) % 8; bit = hashProbe(value) % 32')
      if (action === 'insert') {
        this.blocks[block] = (this.blocks[block] | (1 << bit)) >>> 0
        LinearModel.emit(observer, activeId, `Set bit ${bit} inside the selected block.`, 'blocks[block] |= 1 << bit', 'SET')
      } else if ((this.blocks[block] & (1 << bit)) === 0) return { description: `${value} is definitely absent: block ${block}, bit ${bit} is zero.`, value: false, activeId, status: 'ABSENT' }
    }
    if (action === 'insert') {
      this.additions += 1
      return { description: `Added ${value}; all three probes stay in block ${block}.`, activeId }
    }
    return { description: `${value} is possibly present; every tested bit is set. A positive may be a false positive.`, value: true, activeId, status: 'POSSIBLY PRESENT' }
  }
}
