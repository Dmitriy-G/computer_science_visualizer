import { HashMap } from '../HashMap/HashMap.ts'
import type { HashEntry } from '../HashMap/HashMap.ts'
import type { HashObserver, HashOperation } from '../../../../visualization/Hashing.ts'

export class HashSet {
  private storage = new HashMap()

  public get length(): number { return this.storage.length }
  public get bucketCount(): number { return this.storage.bucketCount }

  public static createDefault(): HashSet {
    const model = new HashSet()
    for (let value = 10; value <= 100; value += 10) model.add(value)
    return model
  }

  public getEntries(): HashEntry[] { return this.storage.getEntries() }
  public add(value: number, trace?: HashObserver): void { this.storage.put(value, value, trace) }
  public has(value: number, trace?: HashObserver): boolean { return this.storage.get(value, trace) !== null }
  public delete(value: number, trace?: HashObserver): boolean { return this.storage.delete(value, trace) }
  public clear(trace?: HashObserver): void { this.storage.clear(trace) }

  public apply(operation: HashOperation, key: number, _value: number, trace?: HashObserver): void {
    switch (operation) {
      case 'insert':
        this.add(key, trace)
        return
      case 'search-value':
        this.has(key, trace)
        return
      case 'delete-value':
        this.delete(key, trace)
        return
      case 'clear':
        this.clear(trace)
    }
  }

  public clone(): HashSet {
    const copy = new HashSet()
    copy.storage = this.storage.clone()
    return copy
  }
}
