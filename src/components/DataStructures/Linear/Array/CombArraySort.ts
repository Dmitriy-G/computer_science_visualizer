import { ArraySortOperations } from './ArraySortOperations.ts'

export class CombArraySort extends ArraySortOperations {
  public sort(): void {
    const length = this.entries.length
    if (length < 2) return
    let gap = length
    let swapped = true
    while (gap > 1 || swapped) {
      // Use the basic 1.3 shrink rule, without the optional CombSort11 rule.
      gap = Math.max(1, Math.floor(gap * 10 / 13))
      swapped = false
      this.observer?.({ kind: 'gap', index: 0, amount: gap, label: 'Shrink the comparison gap', detail: `Compare entries ${gap} slots apart. Continue shrinking even after a pass without swaps, until gap 1 also has a clean pass.`, code: `gap = max(1, floor(gap * 10 / 13)) // ${gap}`, frame: {} })
      for (let index = 0; index + gap < length; index += 1) {
        const other = index + gap
        const frame = { roles: { [index]: 'GAP LEFT', [other]: 'GAP RIGHT' } }
        if (this.compare(index, other, frame) <= 0) continue
        this.swap(index, other, frame)
        swapped = true
      }
      const complete = gap === 1 && !swapped
      this.emit('pass', complete ? 'Adjacent pass confirms the order' : 'Gap pass complete', complete
        ? 'No adjacent pair needs an exchange. The entire array is sorted.'
        : `The gap-${gap} pass is complete. ${gap > 1 ? 'Smaller gaps must still be checked.' : 'An exchange occurred, so repeat the adjacent pass.'}`, `repeat while gap > 1 or swapped`, complete ? { sortedPrefix: length } : {})
    }
  }
}
