import { HashTableModel } from '../../../../visualization/HashTableModel.ts'
import type { HashRecord } from '../../../../visualization/HashTableModel.ts'
import { HashTableHash } from '../../../../visualization/HashTableHash.ts'
import { LinearModel } from '../../../../visualization/LinearModel.ts'
import type { LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'

export class CuckooHashTable extends HashTableModel {
  public readonly kind = 'cuckoo-hash-table'
  private tables: (HashRecord | null)[][] = [new Array<HashRecord | null>(8).fill(null), new Array<HashRecord | null>(8).fill(null)]
  private count = 0
  private seed = 1
  private held: HashRecord | null = null
  public get length(): number { return this.count }
  public get capacity(): number { return this.tables[0].length }
  public getTables(): readonly (readonly (HashRecord | null)[])[] { return [[...this.tables[0]], [...this.tables[1]]] }
  public getHeld(): HashRecord | null { return this.held }
  public home(key: number, table: number): number { return HashTableHash.index(key, 2 * this.seed + table, this.capacity) }
  public static createDefault(): CuckooHashTable {
    const table = new CuckooHashTable()
    for (let key = 10; key <= 100; key += 10) table.put(key, key * 10)
    return table
  }
  public clone(): CuckooHashTable {
    const copy = new CuckooHashTable()
    copy.tables = [[...this.tables[0]], [...this.tables[1]]]
    copy.count = this.count
    copy.seed = this.seed
    copy.nextId = this.nextId
    copy.held = this.held
    return copy
  }
  public getRecords(): HashRecord[] {
    const records: HashRecord[] = []
    for (const table of this.tables) for (const record of table) if (record) records.push(record)
    if (this.held) records.push(this.held)
    return records
  }
  private locate(key: number, observer?: LinearObserver): { table: number, index: number } | null {
    for (let table = 0; table < 2; table += 1) {
      const index = this.home(key, table)
      LinearModel.emit(observer, `${this.kind}-slot-${table}-${index}`, `Check table ${table}, candidate slot ${index}.`, 'check T0[h0(key)] and T1[h1(key)]', 'PROBE')
      if (this.tables[table][index]?.key === key) return { table, index }
    }
    return null
  }
  protected find(key: number, observer?: LinearObserver): HashRecord | null {
    const found = this.locate(key, observer)
    if (found) this.lastLocation = `table T${found.table}, slot ${found.index}`
    return found ? this.tables[found.table][found.index] : null
  }
  private displace(record: HashRecord, observer?: LinearObserver): boolean {
    let table = 0
    this.held = record
    for (let kick = 0; kick < 2 * this.capacity; kick += 1) {
      const placed: HashRecord | null = this.held
      if (!placed) return true
      const index = this.home(placed.key, table)
      this.held = this.tables[table][index]
      this.tables[table][index] = placed
      LinearModel.emit(observer, placed.id, `Place ${placed.key} in T${table}[${index}]${this.held ? ` and evict ${this.held.key} into the holding cell` : ''}.`, 'swap(held, table[hash(held.key)])', this.held ? 'EVICT' : 'NEW')
      if (!this.held) return true
      table = 1 - table
    }
    return false
  }
  protected put(key: number, value: number, observer?: LinearObserver): LinearResult {
    const found = this.locate(key, observer)
    if (found) {
      const record = this.tables[found.table][found.index]!
      this.tables[found.table][found.index] = { ...record, value }
      LinearModel.emit(observer, record.id, 'Update the value at one of the key’s two legal locations.', 'record.value = value', 'UPDATED')
      return { description: `Updated ${key} in table ${found.table}, slot ${found.index}.`, activeId: record.id }
    }
    const full = this.full()
    if (full) return full
    const record = this.pending(key, value)
    if (this.count + 1 <= 0.45 * 2 * this.capacity) {
      for (let table = 0; table < 2; table += 1) {
        const index = this.home(key, table)
        if (this.tables[table][index]) continue
        this.tables[table][index] = record
        this.count += 1
        this.nextId += 1
        LinearModel.emit(observer, record.id, `Fill empty candidate T${table}[${index}].`, 'empty candidate slot = new record', 'NEW')
        return { description: `Inserted ${key} in T${table}[${index}].`, activeId: record.id }
      }
    }
    const original = [[...this.tables[0]], [...this.tables[1]]]
    if (this.count + 1 <= 0.45 * 2 * this.capacity && this.displace(record, observer)) {
      this.count += 1
      this.nextId += 1
      return { description: `Inserted ${key}; every record occupies one of its two candidate locations.`, activeId: record.id }
    }
    this.tables = original
    this.held = null
    LinearModel.emit(observer, null, 'A displacement budget or load threshold was reached; restore the old placement before rebuilding.', 'rollback attempted kicks; choose new hash functions', 'RETRY')
    const records = this.getRecords()
    records.push(record)
    for (let attempt = 1; attempt <= 8; attempt += 1) {
      const candidate = new CuckooHashTable()
      const capacity = Math.min(256, this.capacity * 2 ** Math.ceil(attempt / 2))
      candidate.tables = [new Array<HashRecord | null>(capacity).fill(null), new Array<HashRecord | null>(capacity).fill(null)]
      candidate.seed = this.seed + attempt
      let accepted = true
      for (const entry of records) {
        if (candidate.displace(entry)) continue
        accepted = false
        break
      }
      if (!accepted) continue
      this.tables = candidate.tables
      this.seed = candidate.seed
      this.count += 1
      this.nextId += 1
      LinearModel.emit(observer, record.id, `Rebuild with seed ${this.seed} and ${capacity} slots per table. All records retain their IDs.`, 'rehash all entries with two fresh seeded functions', 'REHASHED')
      return { description: `Inserted ${key} after a bounded cuckoo rebuild.`, activeId: record.id }
    }
    return { description: 'Rejected: eight rebuild attempts were exhausted. All original entries, hash functions, slots, and IDs are unchanged.', status: 'REJECTED' }
  }
  protected remove(key: number, observer?: LinearObserver): LinearResult {
    const found = this.locate(key, observer)
    if (!found) return { description: `Key ${key} is absent.` }
    this.tables[found.table][found.index] = null
    this.count -= 1
    LinearModel.emit(observer, `${this.kind}-slot-${found.table}-${found.index}`, 'Clear this candidate slot; no probe chain needs repair.', 'candidate slot = empty', 'REMOVED')
    return { description: `Deleted ${key} from T${found.table}[${found.index}].` }
  }
  protected clear(observer?: LinearObserver): void {
    for (let table = 0; table < 2; table += 1) for (let index = 0; index < this.capacity; index += 1) {
      if (!this.tables[table][index]) continue
      this.tables[table][index] = null
      this.count -= 1
      LinearModel.emit(observer, `${this.kind}-slot-${table}-${index}`, 'Release an occupied cuckoo slot.', 'slot = empty', 'CLEARED')
    }
  }
}
