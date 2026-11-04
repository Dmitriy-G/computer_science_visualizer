import { LinearModel } from './LinearModel.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from './LinearModel.ts'
import type { ActionKind } from './ActionCatalog.ts'

export interface HashRecord {
  readonly id: string
  readonly key: number
  readonly value: number
}

// Shared input/result contracts only. Each table owns its canonical collision storage.
export abstract class HashTableModel extends LinearModel {
  protected nextId = 0
  protected lastLocation = ''
  public abstract clone(): HashTableModel
  public abstract getRecords(): readonly HashRecord[]
  protected abstract find(key: number, observer?: LinearObserver): HashRecord | null
  protected abstract put(key: number, value: number, observer?: LinearObserver): LinearResult
  protected abstract remove(key: number, observer?: LinearObserver): LinearResult
  protected abstract clear(observer?: LinearObserver): void

  protected pending(key: number, value: number): HashRecord {
    return { id: `${this.kind}-entry-${this.nextId}`, key, value }
  }

  protected full(): LinearResult | null {
    return this.length >= LinearModel.maximumElements ? { description: 'Rejected: this example supports at most 64 entries. The table is unchanged.', status: 'REJECTED' } : null
  }

  public execute(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    if (action === 'clear') {
      this.clear(observer)
      return { description: 'Removed every entry; the hash structure is empty.' }
    }
    if (action !== 'insert' && action !== 'search-value' && action !== 'delete-value') throw new RangeError('Unsupported hash-table operation')
    const key = LinearModel.integer(input, 'key')
    if (action === 'insert') return this.put(key, LinearModel.integer(input, 'value'), observer)
    if (action === 'delete-value') return this.remove(key, observer)
    const found = this.find(key, observer)
    return { description: found ? `Key ${key} has value ${found.value} at ${this.lastLocation || found.id}.` : `Key ${key} is absent.`,
      value: found?.value ?? null, activeId: found?.id, status: found ? 'FOUND' : 'ABSENT' }
  }
}
