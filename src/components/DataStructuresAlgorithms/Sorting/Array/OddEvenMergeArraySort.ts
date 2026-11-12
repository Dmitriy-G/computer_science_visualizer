import { ArrayNetworkSort } from './ArrayNetworkSort.ts'

export class OddEvenMergeArraySort extends ArrayNetworkSort {
  public sort(): void {
    if (this.entries.length < 2) return
    this.sortRange(0, this.networkWidth())
  }

  private sortRange(start: number, count: number): void {
    if (count < 2 || start >= this.entries.length) return
    const half = count / 2
    this.sortRange(start, half)
    this.sortRange(start + half, half)
    this.emit('stage', 'Odd-even merge two sorted ranges', `Merge the ranges beginning at ${start} and ${start + half}. Recursively compare even and odd wires, then repair neighboring outputs. Comparators outside the ${this.entries.length} real slots are omitted.`, `oddEvenMerge(${start}, ${count}, stride = 1)`, { roles: { [start]: 'MERGE START' } }, start)
    this.merge(start, count, 1)
    this.emit('merge', 'Odd-even merge complete', `The real entries in [${start}, ${Math.min(start + count, this.entries.length)}) are ordered.`, 'finish this merge network', {}, start)
  }

  private merge(start: number, count: number, stride: number): void {
    if (start >= this.entries.length) return
    const doubled = 2 * stride
    if (doubled < count) {
      this.merge(start, count, doubled)
      this.merge(start + stride, count, doubled)
      for (let index = start + stride; index + stride < start + count; index += doubled) this.compareExchange(index, index + stride)
    } else this.compareExchange(start, start + stride)
  }
}
