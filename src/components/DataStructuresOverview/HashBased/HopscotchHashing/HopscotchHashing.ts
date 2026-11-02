import { HashTableModel } from '../HashTableModel.ts'
import type { HashRecord } from '../HashTableModel.ts'
import { Hashing } from '../../../../visualization/Hashing.ts'
import { LinearModel } from '../../../../visualization/LinearModel.ts'
import type { LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'

export class HopscotchHashing extends HashTableModel {
  public readonly kind = 'hopscotch-hashing'
  public static readonly neighborhood = 4
  public static readonly maximumCapacity = 256
  private slots: (HashRecord | null)[] = new Array<HashRecord | null>(16).fill(null)
  private hops: number[] = new Array<number>(16).fill(0)
  private count = 0
  public get length(): number { return this.count }
  public get capacity(): number { return this.slots.length }
  public getSlots(): readonly (HashRecord | null)[] { return [...this.slots] }
  public getHopBits(): readonly number[] { return [...this.hops] }
  public home(key: number): number { return Hashing.bucket(key, this.capacity) }
  private distance(from: number, to: number): number { return (to - from + this.capacity) % this.capacity }
  public static createDefault(): HopscotchHashing {
    const model = new HopscotchHashing()
    for (let key = 10; key <= 100; key += 10) model.put(key, key * 10)
    return model
  }
  public clone(): HopscotchHashing {
    const copy = new HopscotchHashing()
    copy.slots = [...this.slots]
    copy.hops = [...this.hops]
    copy.count = this.count
    copy.nextId = this.nextId
    return copy
  }
  public getRecords(): HashRecord[] {
    const result: HashRecord[] = []
    for (const record of this.slots) if (record) result.push(record)
    return result
  }
  private locate(key: number, observer?: LinearObserver): number {
    const home = this.home(key)
    LinearModel.emit(observer, `${this.kind}-slot-${home}`, `Read home ${home}'s four-bit neighborhood map.`, 'bits = hopInfo[home]', 'HOME')
    for (let offset = 0; offset < HopscotchHashing.neighborhood; offset += 1) {
      if (!(this.hops[home] & (1 << offset))) continue
      const index = (home + offset) % this.capacity
      LinearModel.emit(observer, `${this.kind}-slot-${index}`, `Bitmap offset ${offset} names occupied slot ${index}.`, 'inspect only offsets whose hop bit is set', 'PROBE')
      if (this.slots[index]?.key === key) return index
    }
    return -1
  }
  protected find(key: number, observer?: LinearObserver): HashRecord | null {
    const index = this.locate(key, observer)
    if (index >= 0) this.lastLocation = `slot ${index}, offset ${this.distance(this.home(key), index)} from home ${this.home(key)}`
    return index < 0 ? null : this.slots[index]
  }
  private place(record: HashRecord, observer?: LinearObserver): boolean {
    const home = this.home(record.key)
    let hole = -1
    for (let offset = 0; offset < this.capacity; offset += 1) {
      const index = (home + offset) % this.capacity
      LinearModel.emit(observer, `${this.kind}-slot-${index}`, 'Scan forward for a free slot to bring into the neighborhood.', 'find first empty slot after home', 'PROBE')
      if (!this.slots[index]) {
        hole = index
        break
      }
    }
    if (hole < 0) return false
    while (this.distance(home, hole) >= HopscotchHashing.neighborhood) {
      let moved = false
      for (let back = HopscotchHashing.neighborhood - 1; back >= 1 && !moved; back -= 1) {
        const candidateHome = (hole - back + this.capacity) % this.capacity
        for (let offset = 0; offset < back; offset += 1) {
          if (!(this.hops[candidateHome] & (1 << offset))) continue
          const source = (candidateHome + offset) % this.capacity
          const resident = this.slots[source]!
          this.slots[hole] = resident
          this.slots[source] = null
          this.hops[candidateHome] &= ~(1 << offset)
          this.hops[candidateHome] |= 1 << back
          LinearModel.emit(observer, resident.id, `Move ${resident.key} from ${source} to ${hole}, still within its own home neighborhood.`, 'move resident into hole; update its home bitmap', 'HOP')
          hole = source
          moved = true
          break
        }
      }
      if (!moved) return false
    }
    this.slots[hole] = record
    this.hops[home] |= 1 << this.distance(home, hole)
    LinearModel.emit(observer, record.id, `Insert within ${HopscotchHashing.neighborhood} positions of home ${home}.`, 'slot[hole] = record; set home hop bit', 'NEW')
    return true
  }
  protected put(key: number, value: number, observer?: LinearObserver): LinearResult {
    const existing = this.locate(key, observer)
    if (existing >= 0) {
      const record = this.slots[existing]!
      this.slots[existing] = { ...record, value }
      LinearModel.emit(observer, record.id, 'Update the existing value without moving its neighborhood bit.', 'record.value = value', 'UPDATED')
      return { description: `Updated ${key} at slot ${existing}.`, activeId: record.id }
    }
    const full = this.full()
    if (full) return full
    const record = this.pending(key, value)
    const home = this.home(key)
    for (let offset = 0; offset < HopscotchHashing.neighborhood; offset += 1) {
      const index = (home + offset) % this.capacity
      if (this.slots[index]) continue
      this.slots[index] = record
      this.hops[home] |= 1 << offset
      this.count += 1
      this.nextId += 1
      LinearModel.emit(observer, record.id, `Fill free neighborhood slot ${index}, offset ${offset} from home ${home}.`, 'slot = record; set home hop bit', 'NEW')
      return { description: `Inserted ${key} in its home neighborhood.`, activeId: record.id }
    }
    const originalSlots = [...this.slots]
    const originalHops = [...this.hops]
    if (this.place(record, observer)) {
      this.count += 1
      this.nextId += 1
      return { description: `Inserted ${key}; the home bitmap records its actual offset.`, activeId: record.id }
    }
    this.slots = originalSlots
    this.hops = originalHops
    LinearModel.emit(observer, null, 'No legal hop can bring the hole close enough; restore placement before trying a larger table.', 'rollback relocations; grow and rehash', 'RETRY')
    const records = this.getRecords()
    records.push(record)
    for (let capacity = this.capacity * 2; capacity <= HopscotchHashing.maximumCapacity; capacity *= 2) {
      const candidate = new HopscotchHashing()
      candidate.slots = new Array<HashRecord | null>(capacity).fill(null)
      candidate.hops = new Array<number>(capacity).fill(0)
      let accepted = true
      for (const entry of records) {
        if (candidate.place(entry)) continue
        accepted = false
        break
      }
      if (!accepted) continue
      this.slots = candidate.slots
      this.hops = candidate.hops
      this.count += 1
      this.nextId += 1
      LinearModel.emit(observer, record.id, `Rehash into ${capacity} slots, preserving all entry IDs and four-position neighborhoods.`, 'publish successfully rebuilt neighborhood table', 'REHASHED')
      return { description: `Inserted ${key} after growing to ${capacity} slots.`, activeId: record.id }
    }
    return { description: 'Rejected: no valid four-position placement was found up to 256 slots. Original entries, bitmaps, capacity, and IDs are unchanged.', status: 'REJECTED' }
  }
  protected remove(key: number, observer?: LinearObserver): LinearResult {
    const index = this.locate(key, observer)
    if (index < 0) return { description: `Key ${key} is absent.` }
    const home = this.home(key)
    this.hops[home] &= ~(1 << this.distance(home, index))
    this.slots[index] = null
    this.count -= 1
    LinearModel.emit(observer, `${this.kind}-slot-${index}`, 'Clear the entry and its home bitmap bit; other neighborhoods stay intact.', 'slot = empty; clear corresponding home hop bit', 'REMOVED')
    return { description: `Deleted ${key} at slot ${index}.` }
  }
  protected clear(observer?: LinearObserver): void {
    for (let index = 0; index < this.capacity; index += 1) {
      const record = this.slots[index]
      if (!record) continue
      this.hops[this.home(record.key)] &= ~(1 << this.distance(this.home(record.key), index))
      this.slots[index] = null
      this.count -= 1
      LinearModel.emit(observer, `${this.kind}-slot-${index}`, 'Clear an occupied slot and its corresponding hop bit.', 'clear slot and home bitmap bit', 'CLEARED')
    }
  }
}
