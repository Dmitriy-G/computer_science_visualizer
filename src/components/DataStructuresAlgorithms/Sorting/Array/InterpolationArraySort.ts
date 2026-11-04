import { IntegerDistributionSort } from './IntegerDistributionSort.ts'
import type { ArrayEntry } from '../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'

// Stable histogram interpolation, followed by comparison cleanup within the
// ordered value regions. Unlike Flashsort, placement uses separate output.
export class InterpolationArraySort extends IntegerDistributionSort {
  public sort(): void {
    if (this.entries.length < 2) return
    const { minimum, maximum } = this.bounds()
    if (minimum === maximum) {
      this.step('pass', 'All keys have the same interpolation value', 'The bounds scan found identical keys; no histogram or cleanup is needed.', 'if min == max: return')
      return
    }
    const count = this.entries.length
    const address = (value: number): number => Number((BigInt(value) - minimum) * BigInt(count - 1) / (maximum - minimum))
    this.hint = `Estimated rank = floor((key - (${minimum})) * ${count - 1} / (${maximum} - (${minimum}))). Stable histogram placement uses exact BigInt arithmetic.`
    this.cells = new Array<number>(count).fill(0)
    for (let index = 0; index < count; index += 1) {
      const bin = address(this.entries[index].value)
      this.cells[bin] += 1
      this.step('count', 'Count an interpolated address', `Key ${this.entries[index].value} estimates address ${bin}. Collisions share a contiguous output interval.`, 'count[estimatedRank(key)] += 1', { activeIndices: [index] }, index, bin, bin)
    }
    let total = 0
    for (let bin = 0; bin < count; bin += 1) {
      const size = this.cells[bin]
      this.cells[bin] = total
      total += size
    }
    this.cellStatus = 'NEXT'
    this.step('prefix', 'Locate each interpolation interval', 'Prefix counts provide the starting output position for every estimated rank, including empty intervals.', 'next = exclusive prefix counts')
    const output = new Array<ArrayEntry | null>(count).fill(null)
    for (let index = 0; index < count; index += 1) {
      const entry = this.entries[index]
      const bin = address(entry.value)
      const destination = this.cells[bin]++
      output[destination] = entry
      this.step('distribute', 'Place an entry at its interpolated interval', `Write key ${entry.value} to output slot ${destination}. Forward source traversal preserves ties inside each interval.`, 'output[next[estimatedRank(key)]++] = entry', { activeIndices: [index], output: this.observer ? [...output] : undefined }, index, destination, bin)
    }
    for (let index = 0; index < count; index += 1) this.entries[index] = output[index]!
    this.cells = []
    this.step('gather', 'Load the interpolated arrangement for cleanup', 'Value intervals are ordered, but colliding keys inside an interval can still be inverted. Insertion exchanges finish the array.', 'array = interpolated output; insertionSort(array)')
    this.insertion(0, count)
  }
}
