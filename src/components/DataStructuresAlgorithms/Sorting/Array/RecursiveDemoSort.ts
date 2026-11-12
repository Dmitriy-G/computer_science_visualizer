import { ArraySortOperations } from './ArraySortOperations.ts'

export class RecursiveDemoSort extends ArraySortOperations {
  private comparisons = 0
  private exchanges = 0
  private recorded = 0
  private omitted = 0

  protected accept(name: string, limit: number): boolean {
    if (this.entries.length <= limit) return true
    this.emit('reject', 'Input exceeds the demonstration limit', `${name} accepts at most ${limit} entries in this visualizer. Its expensive recurrence was not started; the array is unchanged.`, `if n > ${limit}: return unchanged`)
    return false
  }

  protected compareRange(first: number, second: number, code: string): void {
    this.comparisons += 1
    const exchange = this.entries[first].value > this.entries[second].value
    if (this.observer && this.recorded < 24) {
      this.recorded += 1
      this.emit('compare', 'Compare recursive subproblem endpoints', `Compare keys ${this.entries[first].value} and ${this.entries[second].value}. Repeated recursive comparisons are summarized after the initial detail.`, code, { activeIndices: [first, second] }, first, second)
    } else if (this.observer) this.omitted += 1
    if (!exchange) return
    const entry = this.entries[first]
    this.entries[first] = this.entries[second]
    this.entries[second] = entry
    this.exchanges += 1
    if (this.observer && this.recorded < 64) {
      const grouped = this.omitted
      this.omitted = 0
      this.recorded += 1
      this.emit('swap', 'Exchange inverted recursive endpoints', `Exchange slots ${first} and ${second}.${grouped ? ` The preceding ${grouped} repeated operations were summarized.` : ''}`, 'swap inverted endpoints', { activeIndices: [first, second] }, first, second)
    } else if (this.observer) this.omitted += 1
  }

  protected complete(): void {
    this.emit('pass', 'The complete recurrence has finished', `Executed ${this.comparisons} endpoint comparisons and ${this.exchanges} exchanges.${this.omitted ? ` The last ${this.omitted} repeated operations are summarized in this frame.` : ''} The trace contains at most 64 detailed operation frames.`, 'recurrence complete; commit sorted array', { sortedPrefix: this.entries.length })
  }
}
