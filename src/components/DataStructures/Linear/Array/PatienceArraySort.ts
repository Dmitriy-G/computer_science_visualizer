import { ArraySortOperations } from './ArraySortOperations.ts'
import type { ArrayEntry } from './FixedArray.ts'

export class PatienceArraySort extends ArraySortOperations {
  public sort(): void {
    if (this.entries.length < 2) return
    const piles: ArrayEntry[][] = []
    for (let index = 0; index < this.entries.length; index += 1) {
      const entry = this.entries[index]
      let low = 0
      let high = piles.length
      while (low < high) {
        const middle = low + Math.floor((high - low) / 2)
        const top = piles[middle][piles[middle].length - 1]
        this.emit('compare', 'Find the leftmost eligible pile', `Compare ${entry.value} with pile ${middle}'s top ${top.value}. Use the first top greater than or equal to the new key.`, 'lowerBound(pile tops, key)', { activeIndices: [index], buckets: this.snapshot(piles), activeBucket: middle, activeBucketIndices: [piles[middle].length - 1] }, index, middle)
        if (top.value < entry.value) low = middle + 1
        else high = middle
      }
      if (low === piles.length) piles.push([])
      piles[low].push(entry)
      this.emit('place', 'Place the entry on its pile', `Push key ${entry.value} onto pile ${low}. Each pile is nonincreasing from bottom to top.`, `piles[${low}].push(array[${index}])`, { activeIndices: [index], buckets: this.snapshot(piles), activeBucket: low, activeBucketIndices: [piles[low].length - 1], bucketStatus: 'TOP' }, index, low)
    }
    // A heap of pile indices avoids rescanning every top for each output entry.
    const heap: number[] = []
    for (let pile = 0; pile < piles.length; pile += 1) heap.push(pile)
    for (let parent = Math.floor(heap.length / 2) - 1; parent >= 0; parent -= 1) this.sift(heap, parent, piles)
    const output = new Array<ArrayEntry | null>(this.entries.length).fill(null)
    for (let destination = 0; heap.length; destination += 1) {
      const pile = heap[0]
      output[destination] = piles[pile].pop()!
      this.emit('extract', 'Merge the smallest pile top', `Pop key ${output[destination]!.value} from pile ${pile} into output index ${destination}. Equal keys within a pile leave in reverse arrival order, so this variant is unstable.`, `output[${destination}] = smallestPile.pop()`, { buckets: this.snapshot(piles), output: this.observer ? [...output] : undefined, activeBucket: pile }, destination, pile)
      if (!piles[pile].length) {
        const last = heap.pop()!
        if (heap.length) heap[0] = last
      }
      this.sift(heap, 0, piles, output)
    }
    for (let index = 0; index < this.entries.length; index += 1) this.entries[index] = output[index]!
    this.emit('gather', 'Copy the pile merge back', 'All piles are empty. Copy the merged output into the existing array without changing its length or entry IDs.', 'array[:] = output[:]', { sortedPrefix: this.entries.length })
  }

  private before(first: number, second: number, piles: readonly (readonly ArrayEntry[])[], output?: readonly (ArrayEntry | null)[]): boolean {
    const a = piles[first][piles[first].length - 1]
    const b = piles[second][piles[second].length - 1]
    this.emit('compare', 'Compare pile tops in the heap', `Compare top ${a.value} of pile ${first} with top ${b.value} of pile ${second}.`, 'compare heap pile tops', { buckets: this.snapshot(piles), output: this.observer && output ? [...output] : undefined, activePileTops: [first, second] }, first, second)
    return a.value < b.value || a.value === b.value && first < second
  }

  private sift(heap: number[], start: number, piles: readonly (readonly ArrayEntry[])[], output?: readonly (ArrayEntry | null)[]): void {
    let parent = start
    while (2 * parent + 1 < heap.length) {
      let child = 2 * parent + 1
      if (child + 1 < heap.length && this.before(heap[child + 1], heap[child], piles, output)) child += 1
      if (!this.before(heap[child], heap[parent], piles, output)) break
      const temporary = heap[parent]
      heap[parent] = heap[child]
      heap[child] = temporary
      parent = child
    }
  }

  private snapshot(piles: readonly (readonly ArrayEntry[])[]): ArrayEntry[][] | undefined {
    if (!this.observer) return undefined
    const copy: ArrayEntry[][] = []
    for (const pile of piles) copy.push([...pile])
    return copy
  }
}
