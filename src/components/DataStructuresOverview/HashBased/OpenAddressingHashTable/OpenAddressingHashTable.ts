import { ProbingHashTable } from '../ProbingHashTable.ts'
import type { HashRecord } from '../HashTableModel.ts'
import { LinearModel } from '../../../../visualization/LinearModel.ts'
import type { LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'

export class OpenAddressingHashTable extends ProbingHashTable {
  public readonly kind = 'open-addressing-hash-table'
  public static createDefault(): OpenAddressingHashTable {
    const table = new OpenAddressingHashTable()
    for (let key = 10; key <= 100; key += 10) table.put(key, key * 10)
    return table
  }
  public clone(): OpenAddressingHashTable {
    const copy = new OpenAddressingHashTable()
    this.copyStorage(copy)
    return copy
  }
  private locate(key: number, observer?: LinearObserver): number {
    const home = this.home(key)
    for (let distance = 0; distance < this.capacity; distance += 1) {
      const index = (home + distance) % this.capacity
      const slot = this.slots[index]
      LinearModel.emit(observer, `${this.kind}-slot-${index}`, `Probe slot ${index}, distance ${distance} from home ${home}.`, 'slot = (home + distance) mod capacity', 'PROBE')
      if (slot === null) return -1
      if (slot !== 'deleted' && slot.key === key) return index
    }
    return -1
  }
  protected find(key: number, observer?: LinearObserver): HashRecord | null {
    const index = this.locate(key, observer)
    if (index < 0) return null
    const slot = this.slots[index]
    this.lastLocation = `slot ${index}, home ${this.home(key)}`
    return slot && slot !== 'deleted' ? slot : null
  }
  protected place(record: HashRecord): void {
    const home = this.home(record.key)
    for (let distance = 0; distance < this.capacity; distance += 1) {
      const index = (home + distance) % this.capacity
      if (this.slots[index] === null || this.slots[index] === 'deleted') {
        this.slots[index] = record
        return
      }
    }
    throw new RangeError('No free probing slot')
  }
  protected put(key: number, value: number, observer?: LinearObserver): LinearResult {
    const existing = this.locate(key, observer)
    if (existing >= 0) {
      const record = this.slots[existing] as HashRecord
      this.slots[existing] = { ...record, value }
      LinearModel.emit(observer, record.id, `Update key ${key} at slot ${existing}.`, 'slot.value = value', 'UPDATED')
      return { description: `Updated ${key} at slot ${existing}.`, activeId: record.id }
    }
    const full = this.full()
    if (full) return full
    if (this.count + 1 > this.capacity * 0.75) this.grow(observer)
    const record = this.pending(key, value)
    this.place(record)
    this.nextId += 1
    this.count += 1
    LinearModel.emit(observer, record.id, 'Store the new entry in the first empty or deleted slot on its probe path.', 'reuse first tombstone or empty slot', 'NEW')
    return { description: `Inserted key ${key} with value ${value}.`, activeId: record.id }
  }
  protected remove(key: number, observer?: LinearObserver): LinearResult {
    const index = this.locate(key, observer)
    if (index < 0) return { description: `Key ${key} is absent; no slot changed.` }
    this.slots[index] = 'deleted'
    this.count -= 1
    LinearModel.emit(observer, `${this.kind}-slot-${index}`, 'Leave a tombstone so searches can continue through this probe chain.', 'slots[index] = deleted', 'TOMBSTONE')
    return { description: `Deleted ${key}; its slot is a reusable tombstone.` }
  }
}
