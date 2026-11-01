import { RecursiveDemoSort } from './RecursiveDemoSort.ts'

export class StoogeArraySort extends RecursiveDemoSort {
  public sort(limit: number): boolean {
    if (!this.accept('Stooge Sort', limit)) return false
    this.sortRange(0, this.entries.length - 1)
    if (this.entries.length > 1) this.complete()
    return true
  }

  private sortRange(start: number, end: number): void {
    if (start >= end) return
    this.compareRange(start, end, 'if first > last: swap')
    if (end - start < 2) return
    const third = Math.floor((end - start + 1) / 3)
    this.sortRange(start, end - third)
    this.sortRange(start + third, end)
    this.sortRange(start, end - third)
  }
}
