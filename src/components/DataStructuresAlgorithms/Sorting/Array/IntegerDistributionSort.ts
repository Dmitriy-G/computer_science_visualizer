import { ArraySortOperations } from './ArraySortOperations.ts'
import type { ArrayEntry } from '../../../DataStructuresOverview/Linear/Array/FixedArray.ts'
import type { ArraySortEvent, ArraySortFrame } from './ArraySortTrace.ts'

// Exact integer bounds and an in-place histogram permutation shared by the
// MSD radix and adaptive spread lessons. No JavaScript 32-bit key coercions.
export class IntegerDistributionSort extends ArraySortOperations {
  protected cells: number[] = []
  protected cellStatus = 'COUNT'
  protected hint = ''

  protected bounds(start = 0, end = this.entries.length): { minimum: bigint, maximum: bigint, maximumIndex: number, ordered: boolean } {
    let minimum = BigInt(this.entries[start].value)
    let maximum = minimum
    let maximumIndex = start
    let ordered = true
    for (let index = start + 1; index < end; index += 1) {
      const value = BigInt(this.entries[index].value)
      if (value < minimum) minimum = value
      if (value > maximum) {
        maximum = value
        maximumIndex = index
      }
      if (this.entries[index - 1].value > this.entries[index].value) ordered = false
    }
    return { minimum, maximum, maximumIndex, ordered }
  }

  protected frame(extra: ArraySortFrame = {}, active = -1): ArraySortFrame {
    if (!this.observer) return extra
    const counters = []
    for (let index = 0; index < this.cells.length; index += 1) counters.push({ label: `bin ${index}`, count: this.cells[index], status: this.cellStatus, active: index === active })
    return { counters, counterHint: this.hint, ...extra }
  }

  protected step(kind: ArraySortEvent['kind'], label: string, detail: string, code: string, extra: ArraySortFrame = {}, index = 0, other?: number, active = -1): void {
    if (this.observer) this.emit(kind, label, detail, code, this.frame(extra, active), index, other)
  }

  protected distribute(start: number, end: number, bins: number, classify: (entry: ArrayEntry) => number): readonly number[] {
    this.cells = new Array<number>(bins).fill(0)
    this.cellStatus = 'COUNT'
    for (let index = start; index < end; index += 1) {
      const bin = classify(this.entries[index])
      this.cells[bin] += 1
      this.step('count', 'Count the current range by bin', `Key ${this.entries[index].value} belongs to bin ${bin} in [${start}, ${end}).`, 'count[bin(key)] += 1', { activeIndices: [index] }, index, bin, bin)
    }
    const boundaries = [start]
    for (let bin = 0; bin < bins; bin += 1) boundaries.push(boundaries[bin] + this.cells[bin])
    const next = boundaries.slice(0, bins)
    this.cells = next
    this.cellStatus = 'NEXT'
    this.step('prefix', 'Compute disjoint bin intervals', `Prefix counts divide [${start}, ${end}) into ${bins} contiguous bins. Each cursor points to the next unfilled slot of its bin.`, 'next = prefix sums of bin counts')
    for (let bin = 0; bin < bins; bin += 1) {
      while (next[bin] < boundaries[bin + 1]) {
        const index = next[bin]
        const target = classify(this.entries[index])
        if (target === bin) {
          next[bin] += 1
          this.step('place', 'Advance past a correctly placed entry', `Slot ${index} already belongs to bin ${bin}. Advance its cursor without an exchange.`, 'next[bin] += 1', { roles: { [index]: 'IN BIN' } }, index, bin, bin)
        } else {
          const destination = next[target]++
          this.swap(index, destination, this.frame({ roles: { [index]: `BIN ${bin}`, [destination]: `BIN ${target}` } }, target))
        }
      }
    }
    this.step('partition', 'Finish the in-place bin permutation', 'Every entry occupies its correct contiguous bin. Lower-order keys inside a bin may still need sorting.', 'recurse into nontrivial bins', { roles: { [start]: 'RANGE START', [end - 1]: 'RANGE END' } }, start, end - 1)
    return boundaries
  }

  protected insertion(start: number, end: number): void {
    for (let index = start + 1; index < end; index += 1) {
      for (let position = index; position > start; position -= 1) {
        if (this.compare(position - 1, position, this.frame()) <= 0) break
        this.swap(position - 1, position, this.frame())
      }
    }
  }
}
