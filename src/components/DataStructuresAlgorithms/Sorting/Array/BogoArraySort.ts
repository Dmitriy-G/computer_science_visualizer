import { ArraySortOperations } from './ArraySortOperations.ts'

export class BogoArraySort extends ArraySortOperations {
  private seed = 0x6d2b79f5

  public sort(attempts: number): boolean {
    if (this.ordered()) return true
    const original = [...this.entries]
    for (let attempt = 1; attempt <= attempts; attempt += 1) {
      for (let index = this.entries.length - 1; index > 0; index -= 1) {
        this.seed ^= this.seed << 13
        this.seed ^= this.seed >>> 17
        this.seed ^= this.seed << 5
        const other = (this.seed >>> 0) % (index + 1)
        const entry = this.entries[index]
        this.entries[index] = this.entries[other]
        this.entries[other] = entry
      }
      this.emit('pass', 'Try one seeded random permutation', `Shuffle attempt ${attempt} of ${attempts}. This is a complete Fisher-Yates pass; the fixed seed makes playback reproducible.`, 'shuffle(array); check whether ordered', {  })
      if (this.ordered()) return true
    }
    for (let index = 0; index < this.entries.length; index += 1) this.entries[index] = original[index]
    this.emit('reject', 'Shuffle budget exhausted; array unchanged', `None of the ${attempts} seeded permutations was sorted. Restore the original entry order. A bounded Bogo Sort attempt is not guaranteed to succeed.`, 'restore original array; report unfinished', {  })
    return false
  }

  private ordered(): boolean {
    for (let index = 1; index < this.entries.length; index += 1) {
      if (this.entries[index - 1].value > this.entries[index].value) {
        this.emit('compare', 'The permutation is not sorted', `Slots ${index - 1} and ${index} are inverted. Another random permutation is needed if the budget allows.`, 'if any adjacent inversion: try again', { activeIndices: [index - 1, index] }, index - 1, index)
        return false
      }
    }
    if (this.entries.length > 1) this.emit('pass', 'The permutation is sorted', 'A complete neighboring-key scan found no inversions. This run succeeded without a comparison-sort fallback.', 'if all neighbors ordered: success', { sortedPrefix: this.entries.length })
    return true
  }
}
