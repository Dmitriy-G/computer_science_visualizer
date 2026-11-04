import { ProbingHashTable } from '../../../../visualization/ProbingHashTable.ts'
import type { HashRecord } from '../../../../visualization/HashTableModel.ts'
import { LinearModel } from '../../../../visualization/LinearModel.ts'
import type { LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'

export class RobinHoodHashTable extends ProbingHashTable {
  public readonly kind = 'robin-hood-hash-table'
  public static createDefault(): RobinHoodHashTable {
    const table = new RobinHoodHashTable()
    for (let key = 10; key <= 100; key += 10) table.put(key, key * 10)
    return table
  }
  public clone(): RobinHoodHashTable {
    const copy = new RobinHoodHashTable()
    this.copyStorage(copy)
    return copy
  }
  private locate(key: number, observer?: LinearObserver): number {
    const home = this.home(key)
    for (let distance = 0; distance < this.capacity; distance += 1) {
      const index = (home + distance) % this.capacity
      const resident = this.slots[index]
      LinearModel.emit(observer, `${this.kind}-slot-${index}`, `Probe slot ${index} at search distance ${distance}.`, 'stop at empty slot or resident.distance < search.distance', 'PROBE')
      if (!resident || resident === 'deleted' || this.distance(index, resident.key) < distance) return -1
      if (resident.key === key) return index
    }
    return -1
  }
  protected find(key: number, observer?: LinearObserver): HashRecord | null {
    const index = this.locate(key, observer)
    if (index >= 0) this.lastLocation = `slot ${index}, displacement ${this.distance(index, key)}`
    return index < 0 ? null : this.slots[index] as HashRecord
  }
  protected place(record: HashRecord, observer?: LinearObserver): void {
    let incoming = record
    let index = this.home(incoming.key)
    let distance = 0
    this.held = incoming
    while (true) {
      const resident = this.slots[index]
      if (!resident || resident === 'deleted') {
        this.slots[index] = incoming
        this.held = null
        LinearModel.emit(observer, incoming.id, `Fill slot ${index}, displacement ${distance}.`, 'slot = held; held = null', 'NEW')
        return
      }
      const residentDistance = this.distance(index, resident.key)
      if (residentDistance < distance) {
        const placed = incoming
        this.slots[index] = incoming
        incoming = resident
        this.held = incoming
        LinearModel.emit(observer, placed.id, `The incoming key has traveled farther (${distance} > ${residentDistance}); displace the resident into the holding cell.`, 'swap(slot, held)', 'DISPLACE')
        distance = residentDistance
      }
      index = (index + 1) % this.capacity
      distance += 1
    }
  }
  protected put(key: number, value: number, observer?: LinearObserver): LinearResult {
    const existing = this.locate(key, observer)
    if (existing >= 0) {
      const record = this.slots[existing] as HashRecord
      this.slots[existing] = { ...record, value }
      LinearModel.emit(observer, record.id, 'Update the existing key without changing its displacement.', 'slot.value = value', 'UPDATED')
      return { description: `Updated ${key} at slot ${existing}.`, activeId: record.id }
    }
    const full = this.full()
    if (full) return full
    if (this.count + 1 > this.capacity * 0.75) this.grow(observer)
    const record = this.pending(key, value)
    this.place(record, observer)
    this.nextId += 1
    this.count += 1
    return { description: `Inserted ${key}; keys with greater probe distance displace less-traveled residents.`, activeId: record.id }
  }
  protected remove(key: number, observer?: LinearObserver): LinearResult {
    let hole = this.locate(key, observer)
    if (hole < 0) return { description: `Key ${key} is absent; the table is unchanged.` }
    this.slots[hole] = null
    this.count -= 1
    LinearModel.emit(observer, `${this.kind}-slot-${hole}`, 'Remove the key and create a hole for backward shifting.', 'slots[hole] = empty', 'REMOVED')
    let next = (hole + 1) % this.capacity
    while (true) {
      const resident = this.slots[next]
      if (!resident || resident === 'deleted' || this.distance(next, resident.key) === 0) break
      this.slots[hole] = resident
      this.slots[next] = null
      LinearModel.emit(observer, resident.id, `Shift ${resident.key} one slot backward toward its home.`, 'slots[hole] = slots[next]; slots[next] = empty', 'SHIFTED')
      hole = next
      next = (next + 1) % this.capacity
    }
    return { description: `Deleted ${key} and closed the probe gap without tombstones.` }
  }
}
