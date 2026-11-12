import { ArrayMergeOperations } from './ArrayMergeOperations.ts'
import type { ArraySortFrame, ArraySortStorage } from './ArraySortTrace.ts'

interface NaturalRun {
  readonly start: number
  readonly end: number
}

export class NaturalMergeArraySort extends ArrayMergeOperations {
  private visualRuns: readonly ArraySortStorage[] = []

  protected context(): ArraySortFrame { return { storage: this.visualRuns } }

  public sort(): void {
    if (this.entries.length < 2) return
    let runs: NaturalRun[] = []
    let start = 0
    while (start < this.entries.length) {
      let end = start + 1
      let descending = false
      if (end < this.entries.length) {
        descending = this.compare(start, end, this.context()) > 0
        end += 1
        while (end < this.entries.length) {
          const order = this.compare(end - 1, end, this.context())
          if (descending ? order <= 0 : order > 0) break
          end += 1
        }
      }
      if (descending) {
        this.trace('reverse', 'Reverse a strictly decreasing run', `Reverse [${start}, ${end}). Strict decrease excludes equal keys, preserving stability.`, 'reverse strictly decreasing run', { roles: { [start]: 'RUN START', [end - 1]: 'RUN END' } }, start, end - 1)
        for (let first = start, last = end - 1; first < last; first += 1, last -= 1) this.swap(first, last, this.context())
      }
      runs.push({ start, end })
      this.updateVisual(runs)
      this.trace('run', 'Recognize a natural sorted run', `Indices ${start} through ${end - 1} already form a sorted run${descending ? ' after strict reversal' : ''}.`, `run = [${start}, ${end})`, { roles: { [start]: 'RUN START', [end - 1]: 'RUN END' } }, start, end - 1)
      start = end
    }
    while (runs.length > 1) {
      const next: NaturalRun[] = []
      for (let index = 0; index < runs.length; index += 2) {
        const first = runs[index]
        const second = runs[index + 1]
        if (second) this.mergeRange(first.start, first.end, second.end)
        next.push({ start: first.start, end: second?.end ?? first.end })
        if (this.observer) {
          const visible = [...next, ...runs.slice(index + 2)]
          this.updateVisual(visible)
        }
        this.trace('pass', second ? 'Replace two runs with their merge' : 'Carry the unpaired run forward', 'Keep run order and halve the number of runs on each complete merge pass.', 'nextPass.push(merged or unpaired run)')
      }
      runs = next
    }
  }

  private updateVisual(runs: readonly NaturalRun[]): void {
    if (!this.observer) return
    const snapshots = []
    for (const run of runs) snapshots.push({ id: `natural-${run.start}-${run.end}`, label: `[${run.start},${run.end})`, entries: this.entries.slice(run.start, run.end), status: 'RUN' })
    this.visualRuns = [{ id: 'natural-runs', label: 'runs', status: 'RUNS', runs: snapshots }]
  }
}
