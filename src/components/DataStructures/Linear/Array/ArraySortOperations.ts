import type { ArrayEntry } from './FixedArray.ts'
import type { ArraySortEvent, ArraySortFrame, ArraySortObserver } from './ArraySortTrace.ts'

// Shared trace primitives only. Algorithms own their storage and control flow.
export class ArraySortOperations {
  protected readonly entries: ArrayEntry[]
  protected readonly observer?: ArraySortObserver

  constructor(entries: ArrayEntry[], observer?: ArraySortObserver) {
    this.entries = entries
    this.observer = observer
  }

  protected emit(kind: ArraySortEvent['kind'], label: string, detail: string, code: string, frame: ArraySortFrame = {}, index = 0, other?: number): void {
    this.observer?.({ kind, label, detail, code, frame, index, other })
  }

  protected compare(first: number, second: number, frame: ArraySortFrame = {}): number {
    const a = this.entries[first].value
    const b = this.entries[second].value
    this.emit('compare', 'Compare entries', `Compare ${a} at index ${first} with ${b} at index ${second}.`, `compare(array[${first}], array[${second}])`, { ...frame, activeIndices: [first, second] }, first, second)
    return a < b ? -1 : a > b ? 1 : 0
  }

  protected swap(first: number, second: number, frame: ArraySortFrame = {}): void {
    if (first === second) return
    const temporary = this.entries[first]
    this.entries[first] = this.entries[second]
    this.entries[second] = temporary
    this.emit('swap', 'Exchange entries', `Swap indices ${first} and ${second}, retaining both entry IDs.`, `swap(array[${first}], array[${second}])`, { ...frame, activeIndices: [first, second], roles: { ...frame.roles, [first]: 'SWAP', [second]: 'SWAP' } }, first, second)
  }
}
