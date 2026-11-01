import { ArraySortOperations } from './ArraySortOperations.ts'
import type { ArrayEntry } from './FixedArray.ts'
import type { ArraySortEvent } from './ArraySortTrace.ts'

interface WakeEvent {
  readonly entry: ArrayEntry
  readonly deadline: bigint
  readonly order: number
}

// Virtual event-time demonstration, not OS timers. A priority queue makes the
// scheduling work explicit; signed and extreme integers never become delays.
export class SleepArraySort extends ArraySortOperations {
  private readonly queue: WakeEvent[] = []
  private output: (ArrayEntry | null)[] = []
  private minimum = 0n
  private now = 0n

  public sort(): void {
    if (this.entries.length < 2) return
    this.minimum = BigInt(this.entries[0].value)
    for (const entry of this.entries) {
      if (BigInt(entry.value) < this.minimum) this.minimum = BigInt(entry.value)
    }
    this.output = new Array<ArrayEntry | null>(this.entries.length).fill(null)
    for (let index = 0; index < this.entries.length; index += 1) {
      const entry = this.entries[index]
      this.queue.push({ entry, deadline: BigInt(entry.value) - this.minimum, order: index })
      let child = this.queue.length - 1
      while (child > 0) {
        const parent = Math.floor((child - 1) / 2)
        if (!this.less(child, parent)) break
        this.exchange(child, parent)
        child = parent
      }
      this.step('distribute', 'Schedule a virtual wake-up event', `Key ${entry.value} has exact virtual deadline ${BigInt(entry.value) - this.minimum}. Insert its event into the min-heap; no real timer is created.`, 'enqueue(deadline = key - min, input order)', index)
    }
    let destination = 0
    while (this.queue.length) {
      const event = this.queue[0]
      this.step('select', 'Select the earliest virtual wake-up', `The heap root has deadline ${event.deadline}. Equal deadlines are resolved by original input order.`, 'event = priorityQueue.minimum()', undefined, true)
      const last = this.queue.pop()!
      if (this.queue.length) {
        this.queue[0] = last
        let parent = 0
        while (parent * 2 + 1 < this.queue.length) {
          let child = parent * 2 + 1
          if (child + 1 < this.queue.length && this.less(child + 1, child)) child += 1
          if (!this.less(child, parent)) break
          this.exchange(child, parent)
          parent = child
        }
      }
      this.now = event.deadline
      this.output[destination++] = event.entry
      this.step('write', 'Advance virtual time and emit the waking entry', `Jump directly to virtual time ${this.now} and emit key ${event.entry.value}. Large key differences never cause actual waiting.`, 'virtualTime = event.deadline; output.push(event.entry)')
    }
    for (let index = 0; index < this.entries.length; index += 1) this.entries[index] = this.output[index]!
    this.emit('gather', 'Copy the virtual wake-up order back', 'The event queue produced stable ascending output. This simulation explicitly paid for heap scheduling rather than relying on real timers.', 'array[:] = simulated wake-up output', { sortedPrefix: this.entries.length })
  }

  private less(first: number, second: number): boolean {
    const a = this.queue[first]
    const b = this.queue[second]
    return a.deadline < b.deadline || a.deadline === b.deadline && a.order < b.order
  }

  private exchange(first: number, second: number): void {
    const event = this.queue[first]
    this.queue[first] = this.queue[second]
    this.queue[second] = event
  }

  private step(kind: ArraySortEvent['kind'], label: string, detail: string, code: string, source?: number, reading = false): void {
    if (!this.observer) return
    const entries: ArrayEntry[] = []
    for (const event of this.queue) entries.push(event.entry)
    this.emit(kind, label, detail, code, { activeIndices: source === undefined ? [] : [source], output: [...this.output], storage: [{ id: 'wake-queue', label: 'EVENTS', status: 'MIN-HEAP', runs: [{ id: 'wake-queue', label: 'heap', entries, status: 'WAITING', activeIndices: reading ? [0] : [] }] }], counterHint: `Simulated Sleep Sort: virtual deadline = key - (${this.minimum}), virtual time ${this.now}. Heap scheduling costs O(n log n); no threads, real timers, or wall-clock delays.` })
  }
}
