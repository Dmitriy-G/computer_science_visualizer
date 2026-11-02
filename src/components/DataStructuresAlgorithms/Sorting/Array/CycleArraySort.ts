import { ArraySortOperations } from './ArraySortOperations.ts'
import type { ArrayEntry } from '../../../DataStructuresOverview/Linear/Array/FixedArray.ts'
import type { ArraySortFrame } from './ArraySortTrace.ts'

// Comparison-based Cycle Sort: count smaller suffix keys to locate each write.
export class CycleArraySort extends ArraySortOperations {
  public sort(): void {
    for (let start = 0; start < this.entries.length - 1; start += 1) {
      let held = this.entries[start]
      let position = this.rank(held, start, false)
      if (position === start) {
        this.emit('pass', 'The cycle start is already correct', `Key ${held.value} at index ${start} needs no array write. Continue with the next suffix.`, `if destination == ${start}: continue`, { sortedPrefix: start + 1 }, start)
        continue
      }
      this.emit('hold', 'Hold the cycle entry', `Hold key ${held.value} outside index ${start}. The empty slot stays at the cycle start until the cycle closes.`, `held = array[${start}]`, { held, hole: start, sortedPrefix: start }, start)
      while (true) {
        // Equal keys already occupy valid destinations; do not rewrite them.
        while (this.entries[position].value === held.value) {
          this.emit('select', 'Skip an equal-key destination', `Index ${position} already contains ${held.value}. Advance to the next destination without writing an equal value.`, 'while array[destination] == held: destination += 1', { held, hole: start, sortedPrefix: start, activeIndices: [position], roles: { [position]: 'EQUAL' } }, position)
          position += 1
        }
        const placed = held
        held = this.entries[position]
        this.entries[position] = placed
        const closed = position === start
        const frame: ArraySortFrame = closed
          ? { sortedPrefix: start + 1, roles: { [start]: 'CYCLE CLOSED' } }
          : { held, hole: start, sortedPrefix: start, roles: { [position]: 'WRITE' } }
        this.emit('write', closed ? 'Close the cycle' : 'Write one entry to its destination', closed
          ? `Write key ${placed.value} to index ${start}, filling the empty slot and closing this cycle.`
          : `Write key ${placed.value} to index ${position}, then hold displaced key ${held.value}. Only one array slot is written.`, `array[${position}] = held; held = displaced`, frame, position)
        if (closed) break
        position = this.rank(held, start, true)
      }
      this.emit('pass', 'Cycle complete', `The prefix through index ${start} is now final. Remaining cycles use only the suffix.`, `cycleStart = ${start + 1}`, { sortedPrefix: start + 1 }, start)
    }
  }

  private rank(held: ArrayEntry, start: number, lifted: boolean): number {
    let position = start
    for (let index = start + 1; index < this.entries.length; index += 1) {
      const frame: ArraySortFrame = lifted
        ? { held, hole: start, sortedPrefix: start, activeIndices: [index] }
        : { sortedPrefix: start, activeIndices: [start, index], roles: { [start]: 'CYCLE START' } }
      this.emit('compare', 'Count smaller suffix keys', `Compare held key ${held.value} with ${this.entries[index].value} at index ${index}. Each strictly smaller suffix key moves the destination one slot right.`, `if array[${index}] < held: destination += 1`, frame, index, start)
      if (this.entries[index].value < held.value) position += 1
    }
    this.emit('bounds', 'Locate the cycle destination', `There are ${position - start} smaller keys in this suffix. Begin at index ${position}, then skip equal-key destinations.`, `destination = ${start} + ${position - start}`, lifted ? { held, hole: start, sortedPrefix: start } : { sortedPrefix: start, activeIndices: [start] }, position)
    return position
  }
}
