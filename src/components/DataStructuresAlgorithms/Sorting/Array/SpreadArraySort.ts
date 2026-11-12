import { IntegerDistributionSort } from './IntegerDistributionSort.ts'

export class SpreadArraySort extends IntegerDistributionSort {
  public sort(): void {
    if (this.entries.length < 2) return
    this.sortRange(0, this.entries.length, 2 * Math.floor(Math.log2(this.entries.length)))
  }

  private sortRange(start: number, end: number, budget: number): void {
    if (end - start < 2) return
    const { minimum, maximum, ordered } = this.bounds(start, end)
    this.cells = []
    if (ordered) {
      this.step('pass', 'The range is already ordered', 'A linear bounds scan also checked neighboring keys. No distribution or comparison-sort fallback is needed.', 'if range is ordered: return', {}, start, end - 1)
      return
    }
    if (end - start <= 4) {
      this.step('bucket-sort', 'Comparison-sort a small range', 'Use adjacent insertion exchanges for at most four entries, avoiding histogram overhead.', 'if size <= 4: insertionSort(range)', {}, start, end - 1)
      this.insertion(start, end)
      return
    }
    if (budget === 0) {
      this.step('fallback', 'Use the comparison-sort safety fallback', 'The partition depth budget is exhausted. Heap-sort the remaining range to bound total work by O(n log n).', 'if budget == 0: heapSort(range)', {}, start, end - 1)
      this.heapSort(start, end)
      return
    }
    const range = maximum - minimum
    let bits = 0
    for (let remaining = range; remaining > 0n; remaining /= 2n) bits += 1
    const splitBits = Math.min(4, Math.max(1, Math.floor(Math.log2((end - start) / 2))))
    const shift = Math.max(0, bits - splitBits)
    const divisor = 2n ** BigInt(shift)
    const bins = Number(range / divisor) + 1
    this.step('split', 'Choose a range-sensitive radix split', `The actual range needs ${bits} bits. Retain up to ${splitBits} high bits after subtracting the local minimum, rather than reading a fixed digit position.`, `divider = 2^${shift}; bins = ${bins}`, {}, start, end - 1)
    const boundaries = this.distribute(start, end, bins, (entry) => Number((BigInt(entry.value) - minimum) / divisor))
    for (let bin = 0; bin < bins; bin += 1) this.sortRange(boundaries[bin], boundaries[bin + 1], budget - 1)
  }

  private heapSort(start: number, end: number): void {
    const size = end - start
    for (let root = Math.floor(size / 2) - 1; root >= 0; root -= 1) this.sift(start, root, size)
    for (let remaining = size - 1; remaining > 0; remaining -= 1) {
      this.swap(start, start + remaining, this.frame())
      this.sift(start, 0, remaining)
    }
  }

  private sift(start: number, root: number, size: number): void {
    while (root * 2 + 1 < size) {
      let child = root * 2 + 1
      if (child + 1 < size && this.compare(start + child, start + child + 1, this.frame()) < 0) child += 1
      if (this.compare(start + root, start + child, this.frame()) >= 0) return
      this.swap(start + root, start + child, this.frame())
      root = child
    }
  }
}
