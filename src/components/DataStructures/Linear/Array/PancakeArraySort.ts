import { ArraySortOperations } from './ArraySortOperations.ts'

export class PancakeArraySort extends ArraySortOperations {
  public sort(): void {
    if (this.entries.length < 2) return
    let ordered = true
    for (let index = 1; index < this.entries.length; index += 1) {
      if (this.entries[index - 1].value > this.entries[index].value) ordered = false
    }
    if (ordered) {
      this.emit('pass', 'The pancake stack is already ordered', 'A linear scan avoids unnecessary prefix flips.', 'if ordered: return')
      return
    }
    for (let end = this.entries.length - 1; end > 0; end -= 1) {
      let maximum = 0
      for (let index = 1; index <= end; index += 1) {
        if (this.compare(maximum, index, { sortedFrom: end + 1, roles: { [maximum]: 'MAXIMUM' } }) < 0) maximum = index
      }
      if (maximum !== end) {
        if (maximum > 0) this.flip(maximum, end)
        this.flip(end, end)
      }
      this.emit('pass', 'The largest remaining pancake is fixed', `Slot ${end} now contains the largest key in the active prefix. Later flips cannot touch the sorted suffix.`, 'shrink active prefix by one', { sortedFrom: end }, end)
    }
  }

  private flip(last: number, end: number): void {
    this.emit('reverse', 'Flip one complete prefix', `Reverse slots 0 through ${last}. Pancake Sort changes order only by prefix reversals.`, `reverse(array[0..${last}])`, { sortedFrom: end + 1, activeIndices: [0, last], roles: { [0]: 'FLIP START', [last]: 'FLIP END' } }, 0, last)
    for (let first = 0; first < last; first += 1, last -= 1) this.swap(first, last, { sortedFrom: end + 1 })
  }
}
