import { AppliedModel } from '../../../../visualization/AppliedModel.ts'
import type { AppliedDiagram } from '../../../../visualization/AppliedModel.ts'
import { LinearModel } from '../../../../visualization/LinearModel.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'

export class FanoutArray extends AppliedModel {
  public readonly kind = 'fanout-array'
  public readonly representation = 'Sorted unique 16-bit keys and an actual 256-entry cumulative fanout array. The high byte selects a binary-search interval. This numeric Git-index teaching variant reallocates exact-length arrays on edits and shows only fanout buckets that contain keys.'
  private keys: number[] = []
  private fanout = new Uint32Array(256)
  public get length(): number { return this.keys.length }
  public static createDefault(): FanoutArray {
    const model = new FanoutArray()
    for (const value of [258, 270, 525, 538, 1025, 1288, 1301, 1542, 1800, 2050]) model.execute('insert', { value })
    return model
  }
  public clone(): FanoutArray {
    const copy = new FanoutArray()
    copy.keys = [...this.keys]
    copy.fanout = this.fanout.slice()
    return copy
  }
  private rebuild(): void {
    this.fanout = new Uint32Array(256)
    for (const key of this.keys) this.fanout[key >>> 8] += 1
    for (let byte = 1; byte < 256; byte += 1) this.fanout[byte] += this.fanout[byte - 1]
  }
  public getDiagram(): AppliedDiagram {
    const buckets = []
    for (let byte = 0; byte < 256; byte += 1) {
      const start = byte ? this.fanout[byte - 1] : 0
      if (this.fanout[byte] > start) buckets.push({ id: `fan-${byte}`, text: `[${start}, ${this.fanout[byte]})`, label: `high byte ${byte}`, children: this.keys.slice(start, this.fanout[byte]).map((key) => `fan-key-${key}`) })
    }
    return { rows: [buckets, this.keys.map((key, index) => ({ id: `fan-key-${key}`, text: String(key), label: `sorted slot ${index}` }))] }
  }
  public execute(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    if (action === 'inspect-storage') return this.inspect(observer)
    if (action === 'clear') {
      this.keys = []
      this.rebuild()
      return { description: 'Released sorted keys and zeroed all 256 fanout counters.' }
    }
    const key = AppliedModel.bounded(input, 'value', 0, 65535)
    const byte = key >>> 8
    let low = byte ? this.fanout[byte - 1] : 0
    let high = this.fanout[byte]
    if (low < high) LinearModel.emit(observer, `fan-${byte}`, `Fanout narrows the search to [${low}, ${high}).`, 'lo = F[byte-1]; hi = F[byte]')
    while (low < high) {
      const middle = Math.floor((low + high) / 2)
      LinearModel.emit(observer, `fan-key-${this.keys[middle]}`, `Compare ${key} with slot ${middle}.`, 'lower_bound(keys, lo, hi, key)')
      if (this.keys[middle] < key) low = middle + 1
      else high = middle
    }
    const found = this.keys[low] === key
    if (action === 'search-value') return { description: found ? `Found ${key} at sorted index ${low}.` : `${key} is absent.`, value: found ? low : null, activeId: found ? `fan-key-${key}` : null, status: found ? 'FOUND' : 'ABSENT' }
    if (action === 'insert') {
      if (found) return this.reject('The key already exists.')
      if (this.length === 64) return this.reject('At most 64 keys are supported.')
      this.keys = [...this.keys.slice(0, low), key, ...this.keys.slice(low)]
    } else if (action === 'delete-value') this.keys = found ? [...this.keys.slice(0, low), ...this.keys.slice(low + 1)] : [...this.keys]
    else throw new RangeError('Unsupported fanout action')
    this.rebuild()
    return { description: `${action === 'insert' ? 'Inserted' : found ? 'Removed' : 'Did not find'} ${key}; cumulative fanout counters are consistent.` }
  }
}
