import { IntegerDistributionSort } from './IntegerDistributionSort.ts'

export class FlashArraySort extends IntegerDistributionSort {
  public sort(): void {
    if (this.entries.length < 2) return
    const { minimum, maximum, maximumIndex } = this.bounds()
    if (minimum === maximum) {
      this.step('pass', 'All keys share one value', 'The bounds scan found identical keys. Skip classification and insertion cleanup.', 'if min == max: return')
      return
    }
    const classes = Math.max(2, Math.floor(this.entries.length * 0.43))
    const classify = (value: number): number => Number((BigInt(value) - minimum) * BigInt(classes - 1) / (maximum - minimum))
    this.cells = new Array<number>(classes).fill(0)
    for (let index = 0; index < this.entries.length; index += 1) {
      const bin = classify(this.entries[index].value)
      this.cells[bin] += 1
      this.step('count', 'Classify an entry', `Key ${this.entries[index].value} contributes to class ${bin}. These classes describe intervals, not individual key values.`, 'count[class(key)] += 1', { activeIndices: [index] }, index, bin, bin)
    }
    for (let bin = 1; bin < classes; bin += 1) this.cells[bin] += this.cells[bin - 1]
    this.cellStatus = 'END'
    this.step('prefix', 'Accumulate exclusive class ends', 'Each accumulated count points just beyond its class. Placements decrement this boundary to locate an unfilled destination.', 'end = inclusive prefix sums of counts')
    this.swap(0, maximumIndex, this.frame())
    const ends = this.cells
    let moved = 0
    let start = 0
    let bin = classes - 1
    while (moved < this.entries.length - 1) {
      while (start >= ends[bin]) {
        start += 1
        if (start === this.entries.length) break
        bin = classify(this.entries[start].value)
      }
      if (start === this.entries.length) break
      let held = this.entries[start]
      this.step('hold', 'Lift the next Flashsort cycle leader', `Hold key ${held.value} outside slot ${start}. Class-end pointers identify the next cycle without an entry-sized visited array.`, 'held = array[cycleStart]', { held, hole: start }, start)
      while (start !== ends[bin]) {
        bin = classify(held.value)
        const destination = --ends[bin]
        const placed = held
        held = this.entries[destination]
        this.entries[destination] = placed
        moved += 1
        const closed = destination === start
        this.step('write', closed ? 'Close the Flashsort cycle' : 'Flash an entry into its class', `Write key ${placed.value} to slot ${destination}${closed ? ' and fill the cycle hole' : `, holding displaced key ${held.value}`}. Class ${bin} now ends its unfilled portion at ${ends[bin]}.`, 'array[--end[class(held)]] = held; hold displaced', closed ? { roles: { [start]: 'CYCLE CLOSED' } } : { held, hole: start, roles: { [destination]: 'WRITE' } }, destination, bin, bin)
      }
    }
    this.cells = []
    this.step('partition', 'Finish class permutation', 'Classes are ordered by value range, but entries within a class can still be inverted. Adjacent insertion exchanges finish this near-sorted array.', 'insertionSort(classified array)')
    this.insertion(0, this.entries.length)
  }
}
