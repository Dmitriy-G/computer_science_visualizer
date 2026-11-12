import { ArraySortOperations } from './ArraySortOperations.ts'
import type { ArrayEntry } from '../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import type { ArraySortEvent, ArraySortFrame, ArraySortRun } from './ArraySortTrace.ts'

export class PigeonholeArraySort extends ArraySortOperations {
  private holes: ArrayEntry[][] = []
  private minimum = 0n
  private output: (ArrayEntry | null)[] = []

  public sort(maximumRange: number): boolean {
    if (this.entries.length < 2) return true
    this.minimum = BigInt(this.entries[0].value)
    let maximum = this.minimum
    for (const entry of this.entries) {
      const key = BigInt(entry.value)
      if (key < this.minimum) this.minimum = key
      if (key > maximum) maximum = key
    }
    const range = maximum - this.minimum + 1n
    if (range > BigInt(maximumRange)) {
      this.emit('reject', 'Pigeonhole range is too wide', `The inclusive range has ${range} possible keys, exceeding the ${maximumRange}-hole limit. The array is unchanged.`, 'if range > hole limit: return unchanged')
      return false
    }
    for (let index = 0; index < Number(range); index += 1) this.holes.push([])
    this.step('bounds', 'Allocate one pigeonhole per possible key', `Allocate ${range} holes for integer keys ${this.minimum} through ${maximum}. The diagram shows occupied holes only; gaps still exist in the logical hole array.`, 'holes = one list per key in [min, max]')
    for (let index = 0; index < this.entries.length; index += 1) {
      const entry = this.entries[index]
      const hole = Number(BigInt(entry.value) - this.minimum)
      this.holes[hole].push(entry)
      this.step('distribute', 'Append the full record to its pigeonhole', `Put key ${entry.value} in hole ${hole}. Store the original entry and ID rather than reconstructing values from a count.`, 'holes[key - min].push(entry)', { activeIndices: [index] }, index, hole)
    }
    this.output = new Array<ArrayEntry | null>(this.entries.length).fill(null)
    let destination = 0
    for (let hole = 0; hole < this.holes.length; hole += 1) {
      for (const entry of this.holes[hole]) {
        this.output[destination] = entry
        this.step('write', 'Gather pigeonholes in increasing key order', `Copy key ${entry.value} to output slot ${destination}. Arrival order inside each hole preserves equal-key stability.`, 'output[next++] = next record in hole', {}, destination, hole)
        destination += 1
      }
    }
    for (let index = 0; index < this.entries.length; index += 1) this.entries[index] = this.output[index]!
    this.emit('gather', 'Copy the complete pigeonhole output back', 'Every original entry is in ascending order with stable ties. Replace the existing array contents without changing its length.', 'array[:] = output[:]', { sortedPrefix: this.entries.length })
    return true
  }

  private step(kind: ArraySortEvent['kind'], label: string, detail: string, code: string, extra: ArraySortFrame = {}, index = 0, active = -1): void {
    if (!this.observer) return
    const runs: ArraySortRun[] = []
    for (let hole = 0; hole < this.holes.length; hole += 1) {
      if (!this.holes[hole].length) continue
      const activeIndices: number[] = []
      if (hole === active) {
        for (let position = 0; position < this.holes[hole].length; position += 1) activeIndices.push(position)
      }
      runs.push({ id: `hole-${hole}`, label: `hole ${hole}`, entries: [...this.holes[hole]], status: hole === active ? 'SELECTED' : 'HOLE', activeIndices })
    }
    this.emit(kind, label, detail, code, { storage: [{ id: 'pigeonholes', label: 'HOLES', status: 'OCCUPIED', runs }], output: this.output.length ? [...this.output] : undefined, ...extra }, index, active)
  }
}
