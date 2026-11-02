import { HashTableModel } from '../HashTableModel.ts'
import type { HashRecord } from '../HashTableModel.ts'
import { HashMap } from '../HashMap/HashMap.ts'
import { LinearModel } from '../../../../visualization/LinearModel.ts'
import type { LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'
import type { HashTrace, HashObserver } from '../../../../visualization/Hashing.ts'

// The existing Hash Map already implements this exact collision policy.
export class SeparateChainingHashTable extends HashTableModel {
  public readonly kind = 'separate-chaining-hash-table'
  private table = new HashMap()
  public get length(): number { return this.table.length }
  public get bucketCount(): number { return this.table.bucketCount }
  public static createDefault(): SeparateChainingHashTable {
    const model = new SeparateChainingHashTable()
    model.table = HashMap.createDefault()
    return model
  }
  public clone(): SeparateChainingHashTable {
    const copy = new SeparateChainingHashTable()
    copy.table = this.table.clone()
    return copy
  }
  public getRecords(): readonly HashRecord[] { return this.table.getEntries() }
  public getEntries() { return this.table.getEntries() }
  private trace(observer?: LinearObserver): HashObserver {
    return (event: HashTrace): void => {
      if (event.type === 'result' && event.found) this.lastLocation = `bucket ${event.bucket}, chain index ${event.chainIndex}`
      if (!observer) return
      const active = event.type === 'remove' ? `${this.kind}-bucket-${event.bucket}` : event.id ?? (event.bucket === undefined ? null : `${this.kind}-bucket-${event.bucket}`)
      const description = event.type === 'resize' ? `Double to ${this.table.bucketCount} buckets and relink all records under the new modulus.`
        : event.type === 'hash' ? `Hash key ${event.key} to bucket ${event.bucket}.`
        : event.type === 'compare' ? `Compare with a record in collision chain ${event.bucket}.`
        : event.type === 'insert' ? `Link the new record at the head of bucket ${event.bucket}.`
        : event.type === 'remove' ? `Unlink key ${event.key} from its collision chain.`
        : event.type === 'update' ? `Update the existing value for key ${event.key}.`
        : event.type === 'rehash' ? `Key ${event.key} now belongs to bucket ${event.bucket}.`
        : event.type === 'clear' ? 'All collision-chain nodes have been released.'
        : event.found ? `Found ${event.key} in bucket ${event.bucket}, chain index ${event.chainIndex}.` : `Key ${event.key} is absent from its chain.`
      LinearModel.emit(observer, active, description, event.type === 'hash' ? 'bucket = normalizedModulo(key, bucketCount)' : event.type === 'resize' ? 'double buckets; rehash linked nodes' : event.type === 'compare' ? 'compare node.key; follow node.next' : `${event.type} collision-chain record`, event.type.toUpperCase())
    }
  }
  protected find(key: number, observer?: LinearObserver): HashRecord | null { return this.table.get(key, this.trace(observer)) }
  protected put(key: number, value: number, observer?: LinearObserver): LinearResult {
    if (!this.table.get(key)) {
      const full = this.full()
      if (full) return full
    }
    this.table.put(key, value, this.trace(observer))
    return { description: `Stored ${key} with value ${value} in its separate collision chain.`, activeId: this.table.get(key)!.id }
  }
  protected remove(key: number, observer?: LinearObserver): LinearResult {
    return { description: this.table.delete(key, this.trace(observer)) ? `Deleted key ${key} and reconnected its chain.` : `Key ${key} is absent.` }
  }
  protected clear(observer?: LinearObserver): void { this.table.clear(this.trace(observer)) }
}
