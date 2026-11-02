import { ArraySortOperations } from './ArraySortOperations.ts'

export class CocktailShakerArraySort extends ArraySortOperations {
  public sort(): void {
    let left = 0
    let right = this.entries.length - 1
    while (left < right) {
      let swapped = false
      this.emit('stage', 'Sweep forward', `Move the largest remaining key toward index ${right} by comparing adjacent entries from left to right.`, `for i = ${left} to ${right - 1}`, { sortedPrefix: left, sortedFrom: right + 1, roles: { [left]: 'FORWARD', [right]: 'RIGHT LIMIT' } }, left, right)
      for (let index = left; index < right; index += 1) {
        const frame = { sortedPrefix: left, sortedFrom: right + 1 }
        if (this.compare(index, index + 1, frame) <= 0) continue
        this.swap(index, index + 1, frame)
        swapped = true
      }
      right -= 1
      const complete = !swapped || left >= right
      this.emit('pass', 'Finalize the forward maximum', `The sorted suffix begins at index ${right + 1}. ${complete ? 'The remaining range is ordered, so the sort can finish.' : 'Reverse direction to move the remaining minimum left.'}`, 'right -= 1; stop if ordered', { sortedPrefix: complete ? this.entries.length : left, sortedFrom: right + 1 }, right + 1)
      if (complete) return
      swapped = false
      this.emit('stage', 'Sweep backward', `Move the smallest remaining key toward index ${left} by comparing adjacent entries from right to left.`, `for i = ${right} down to ${left + 1}`, { sortedPrefix: left, sortedFrom: right + 1, roles: { [right]: 'BACKWARD', [left]: 'LEFT LIMIT' } }, right, left)
      for (let index = right; index > left; index -= 1) {
        const frame = { sortedPrefix: left, sortedFrom: right + 1 }
        if (this.compare(index - 1, index, frame) <= 0) continue
        this.swap(index - 1, index, frame)
        swapped = true
      }
      left += 1
      this.emit('pass', 'Finalize the backward minimum', `The sorted prefix now contains ${left} entries. ${swapped ? 'Continue inside the smaller unsorted range.' : 'This sweep made no swaps, so all entries are ordered.'}`, 'left += 1; stop if no swaps', { sortedPrefix: swapped ? left : this.entries.length, sortedFrom: right + 1 }, left - 1)
      if (!swapped) return
    }
  }
}
