import { SetUnionModel } from '../../../../visualization/SetUnionModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'

export interface MultisetEntry {
  readonly id: string
  readonly value: number
  readonly count: number
}

export class Multiset extends SetUnionModel {
  public readonly kind = 'multiset'
  private entries = new Map<number, MultisetEntry>()
  private total = 0
  private nextId = 0
  public get length(): number { return this.total }
  public get distinctCount(): number { return this.entries.size }

  public static createDefault(): Multiset {
    const model = new Multiset()
    for (const value of [10, 20, 20, 30, 30, 30, 40, 50, 60, 60]) model.execute('insert', { value })
    return model
  }

  public getEntries(): MultisetEntry[] {
    const result: MultisetEntry[] = []
    for (const entry of this.entries.values()) result.push({ ...entry })
    return result
  }

  public clone(): Multiset {
    const copy = new Multiset()
    for (const entry of this.entries.values()) copy.entries.set(entry.value, { ...entry })
    copy.total = this.total
    copy.nextId = this.nextId
    return copy
  }

  public execute(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    if (action === 'clear') {
      for (const entry of this.entries.values()) {
        SetUnionModel.emit(observer, entry.id, `Release the counter for ${entry.value}, removing ${entry.count} occurrences.`, 'total -= count[value]; delete count[value]')
        this.total -= entry.count
        this.entries.delete(entry.value)
      }
      return { description: 'All occurrence counters have been released; total count is zero.' }
    }
    if (action !== 'insert' && action !== 'delete-value' && action !== 'count-value') throw new RangeError('Unsupported multiset action')
    const value = SetUnionModel.integer(input, 'value')
    const entry = this.entries.get(value)
    SetUnionModel.emit(observer, entry?.id ?? null, `Look up the occurrence counter for ${value}.`, 'entry = counts.get(value)', entry ? 'FOUND' : 'ABSENT')
    if (action === 'count-value') return { description: `${value} occurs ${entry?.count ?? 0} time(s); total occurrences ${this.total}.`, activeId: entry?.id, status: entry ? 'FOUND' : 'ABSENT', value: entry?.count ?? 0 }
    if (action === 'insert') {
      if (this.total >= SetUnionModel.maximumElements) return this.reject('The bag allows at most 64 total occurrences, including duplicates.')
      const updated = { id: entry?.id ?? `bag-${this.nextId++}`, value, count: (entry?.count ?? 0) + 1 }
      this.entries.set(value, updated)
      this.total += 1
      SetUnionModel.emit(observer, updated.id, `Increment ${value} to ${updated.count} occurrence(s).`, 'count[value] += 1; total += 1', entry ? 'INCREMENT' : 'NEW')
      return { description: `Added one ${value}; count ${updated.count}, total occurrences ${this.total}.`, activeId: updated.id, value: updated.count }
    }
    if (!entry) return { description: `${value} is absent; no occurrence was removed.`, value: false }
    this.total -= 1
    if (entry.count === 1) this.entries.delete(value)
    else this.entries.set(value, { ...entry, count: entry.count - 1 })
    SetUnionModel.emit(observer, entry.count === 1 ? null : entry.id, `Remove one ${value}; ${entry.count - 1} occurrence(s) remain.`, 'decrement count; delete zero counter; total -= 1', 'DECREMENT')
    return { description: `Removed one ${value}; ${entry.count - 1} remain. Total occurrences ${this.total}.`, activeId: entry.count > 1 ? entry.id : null, value: true }
  }
}
