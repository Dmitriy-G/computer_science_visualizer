import { HashTableModel } from './HashTableModel.ts'
import type { HashRecord } from './HashTableModel.ts'
import { Hashing } from './Hashing.ts'
import { LinearModel } from './LinearModel.ts'
import type { LinearObserver } from './LinearModel.ts'

export type ProbeSlot = HashRecord | 'deleted' | null

// Genuine common array storage and rehash primitives for linear probing and Robin Hood.
export abstract class ProbingHashTable extends HashTableModel {
  protected slots: ProbeSlot[] = new Array<ProbeSlot>(16).fill(null)
  protected count = 0
  protected held: HashRecord | null = null
  public get length(): number { return this.count }
  public get capacity(): number { return this.slots.length }
  public getSlots(): readonly ProbeSlot[] { return [...this.slots] }
  public getHeld(): HashRecord | null { return this.held }
  public home(key: number): number { return Hashing.bucket(key, this.capacity) }
  public distance(index: number, key: number): number { return (index - this.home(key) + this.capacity) % this.capacity }
  protected abstract place(record: HashRecord, observer?: LinearObserver): void

  public getRecords(): HashRecord[] {
    const records: HashRecord[] = []
    for (const slot of this.slots) if (slot && slot !== 'deleted') records.push(slot)
    if (this.held) records.push(this.held)
    return records
  }

  protected grow(observer?: LinearObserver): void {
    const records = this.getRecords()
    this.slots = new Array<ProbeSlot>(this.capacity * 2).fill(null)
    for (const record of records) this.place(record)
    LinearModel.emit(observer, null, `Double to ${this.capacity} slots and rehash existing entries, keeping their identities.`, 'allocate doubled table; reinsert existing records', 'REHASHED')
  }

  protected copyStorage(copy: ProbingHashTable): void {
    copy.slots = [...this.slots]
    copy.held = this.held
    copy.count = this.count
    copy.nextId = this.nextId
  }

  protected clear(observer?: LinearObserver): void {
    for (let index = 0; index < this.capacity; index += 1) {
      const slot = this.slots[index]
      this.slots[index] = null
      if (slot && slot !== 'deleted') this.count -= 1
      if (slot !== null) LinearModel.emit(observer, `${this.kind}-slot-${index}`, `Clear physical slot ${index}, including any tombstone.`, 'slots[index] = empty', 'CLEARED')
    }
  }
}
