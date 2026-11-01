import { RecursiveDemoSort } from './RecursiveDemoSort.ts'

export class SlowArraySort extends RecursiveDemoSort {
  public sort(limit: number): boolean {
    if (!this.accept('Slow Sort', limit)) return false
    this.sortRange(0, this.entries.length - 1)
    if (this.entries.length > 1) this.complete()
    return true
  }

  private sortRange(start: number, end: number): void {
    if (start >= end) return
    const middle = start + Math.floor((end - start) / 2)
    this.sortRange(start, middle)
    this.sortRange(middle + 1, end)
    this.compareRange(middle, end, 'sort halves; compare their maxima')
    this.sortRange(start, end - 1)
  }
}
