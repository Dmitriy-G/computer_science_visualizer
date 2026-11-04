import { LinearModel } from '../../../../visualization/LinearModel.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'

export class SparseArray extends LinearModel {
  public readonly kind = 'sparse-array'
  public readonly length: number
  private readonly entries = new Map<number, number>()

  constructor(length = 64) {
    super()
    if (!Number.isSafeInteger(length) || length < 0 || length > 1000000) throw new RangeError('Logical length must be between 0 and 1,000,000')
    this.length = length
  }

  public static createDefault(): SparseArray {
    const model = new SparseArray()
    for (let index = 0; index < 10; index += 1) model.entries.set(index * 3, (index + 1) * 10)
    return model
  }

  public clone(): SparseArray {
    const model = new SparseArray(this.length)
    for (const [index, value] of this.entries) model.entries.set(index, value)
    return model
  }

  public getEntries(): readonly (readonly [number, number])[] { return Array.from(this.entries) }
  public get storedCount(): number { return this.entries.size }

  public execute(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    if (action === 'clear') {
      for (const index of this.entries.keys()) {
        this.entries.delete(index)
        LinearModel.emit(observer, null, `Release stored entry ${index}; logical indices do not shift.`, 'entries.delete(index)')
      }
      return { description: `No entries remain stored; logical length is still ${this.length}. Holes read as zero.` }
    }
    const index = LinearModel.integer(input, 'index')
    LinearModel.index(index, this.length)
    const present = this.entries.has(index)
    LinearModel.emit(observer, present ? `sparse-${index}` : 'sparse-directory', `Look up logical index ${index} in the sparse directory.`, 'entries.has(index)')
    if (action === 'search-index') {
      const value = this.entries.get(index) ?? 0
      return { description: `Index ${index}: ${value}${present ? ' (explicitly stored)' : ' (implicit zero; no entry allocated)'}.`, activeId: present ? `sparse-${index}` : 'sparse-directory', status: present ? 'STORED' : 'IMPLICIT ZERO', value }
    }
    if (action === 'update-index') {
      const value = LinearModel.integer(input, 'value')
      if (!present && this.entries.size >= LinearModel.maximumElements) return { description: 'Set rejected: this teaching example allows 64 stored entries.' }
      this.entries.set(index, value)
      LinearModel.emit(observer, `sparse-${index}`, `Store ${value} at logical index ${index}; zero is also an explicit entry.`, 'entries.set(index, value)', 'STORED')
      return { description: `Stored ${value} at index ${index}; ${this.entries.size} entries occupy ${this.length} logical slots.`, activeId: `sparse-${index}` }
    }
    if (action !== 'delete-index') throw new RangeError('Unsupported sparse-array action')
    this.entries.delete(index)
    LinearModel.emit(observer, 'sparse-directory', `Remove index ${index} without shifting any other index.`, 'entries.delete(index)')
    return { description: present ? `Removed index ${index}; it now reads as implicit zero.` : `Index ${index} was already a hole.` }
  }
}
