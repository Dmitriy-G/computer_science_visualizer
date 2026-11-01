import { ArraySortOperations } from './ArraySortOperations.ts'
import type { ArrayEntry } from './FixedArray.ts'
import type { ArraySortEvent, ArraySortFrame } from './ArraySortTrace.ts'

export class LibraryArraySort extends ArraySortOperations {
  private shelf: (ArrayEntry | null)[] = []
  private span = 0

  public sort(): void {
    if (this.entries.length < 2) return
    let ordered = true
    for (let index = 1; index < this.entries.length; index += 1) {
      if (this.entries[index - 1].value > this.entries[index].value) ordered = false
    }
    if (ordered) {
      this.emit('pass', 'The input is already ordered', 'A linear scan avoids allocating the auxiliary gapped shelf for this input.', 'if ordered: return')
      return
    }
    // Auxiliary storage only. The fixed model allocation never gains gaps.
    this.shelf = new Array<ArrayEntry | null>(2 * this.entries.length + 1).fill(null)
    this.span = 3
    this.shelf[1] = this.entries[0]
    this.step('place', 'Place the first book on the auxiliary shelf', 'The original fixed array stays fully occupied. Empty shelf positions are temporary insertion gaps.', 'shelf[1] = array[0]', { shelfActiveIndices: [1], activeIndices: [0] })
    let inserted = 1
    while (inserted < this.entries.length) {
      const target = Math.min(this.entries.length, 2 * inserted)
      this.rebalance(target)
      while (inserted < target) {
        const entry = this.entries[inserted]
        const successor = this.upperBound(entry.value, inserted)
        let right = successor
        while (right < this.span && this.shelf[right]) right += 1
        let left = successor - 1
        while (left >= 0 && this.shelf[left]) left -= 1
        let destination: number
        if (right < this.span && (left < 0 || right - successor <= successor - 1 - left)) {
          for (let hole = right; hole > successor; hole -= 1) {
            this.shelf[hole] = this.shelf[hole - 1]
            this.shelf[hole - 1] = null
            this.step('shift', 'Move a shelf gap toward the insertion point', `Shift one book right, moving the empty slot left toward key ${entry.value}.`, 'shelf[hole] = shelf[hole - 1]; clear old slot', { shelfActiveIndices: [hole, hole - 1], activeIndices: [inserted] })
          }
          destination = successor
        } else {
          for (let hole = left; hole < successor - 1; hole += 1) {
            this.shelf[hole] = this.shelf[hole + 1]
            this.shelf[hole + 1] = null
            this.step('shift', 'Move a shelf gap from the left', `Shift one book left while preserving shelf order. The insertion slot remains before the first strictly greater key.`, 'shelf[hole] = shelf[hole + 1]; clear old slot', { shelfActiveIndices: [hole, hole + 1], activeIndices: [inserted] })
          }
          destination = successor - 1
        }
        this.shelf[destination] = entry
        this.step('place', 'Insert into the nearby gap', `Insert key ${entry.value} into shelf slot ${destination}. Upper-bound search places equal keys after earlier arrivals.`, 'shelf[gap] = next entry', { shelfActiveIndices: [destination], activeIndices: [inserted] })
        inserted += 1
      }
    }
    let destination = 0
    const output = new Array<ArrayEntry | null>(this.entries.length).fill(null)
    for (let index = 0; index < this.span; index += 1) {
      if (this.shelf[index]) output[destination++] = this.shelf[index]
    }
    for (let index = 0; index < this.entries.length; index += 1) this.entries[index] = output[index]!
    this.emit('gather', 'Gather the shelf without its gaps', 'Read occupied shelf slots in order and copy their entries into the existing fixed array. Gaps belong only to auxiliary storage.', 'array = occupied shelf slots', { sortedPrefix: this.entries.length })
  }

  private rebalance(target: number): void {
    const books: ArrayEntry[] = []
    for (let index = 0; index < this.span; index += 1) {
      const entry = this.shelf[index]
      if (entry) books.push(entry)
    }
    this.span = 2 * target + 1
    for (let index = 0; index < this.span; index += 1) this.shelf[index] = null
    for (let index = 0; index < books.length; index += 1) this.shelf[Math.floor((index + 1) * this.span / (books.length + 1))] = books[index]
    this.step('gap', 'Rebalance gaps for the next insertion round', `Spread ${books.length} sorted entries evenly through ${this.span} active shelf slots, leaving room to reach ${target} entries this round.`, 'double round target; spread existing books evenly')
  }

  private upperBound(value: number, source: number): number {
    let low = 0
    let high = this.span
    let answer = this.span
    while (low < high) {
      const middle = low + Math.floor((high - low) / 2)
      let probe = middle
      while (probe < high && this.shelf[probe] === null) probe += 1
      if (probe === high) {
        this.step('select', 'Skip an empty shelf interval', `There are no books in shelf slots [${middle}, ${high}). Continue searching the left portion.`, 'if right half has no books: high = middle', { shelfActiveIndices: [middle], activeIndices: [source] })
        high = middle
      } else {
        this.step('compare', 'Binary-search the gapped shelf', `Compare incoming key ${value} with key ${this.shelf[probe]!.value} at occupied shelf slot ${probe}. Gaps do not participate in comparisons.`, 'find first occupied key strictly greater than incoming', { shelfActiveIndices: [probe], activeIndices: [source] })
        if (this.shelf[probe]!.value > value) {
          answer = probe
          high = middle
        }
        else low = probe + 1
      }
    }
    return answer
  }

  private step(kind: ArraySortEvent['kind'], label: string, detail: string, code: string, extra: ArraySortFrame = {}): void {
    if (!this.observer) return
    this.emit(kind, label, detail, code, { shelf: this.shelf.slice(0, this.span), counterHint: 'Library Sort uses a separate auxiliary shelf with gaps. The numeric array retains its exact fixed length. Insertion rounds grow geometrically; rebalancing redistributes gaps.', ...extra })
  }
}
