import type { ArrayEntry } from '../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import type { ArraySortEvent, ArraySortFrame, ArraySortObserver } from './ArraySortTrace.ts'

interface SortRun {
  readonly start: number
  readonly length: number
}

export class HybridArraySort {
  private readonly entries: ArrayEntry[]
  private readonly observer?: ArraySortObserver

  constructor(entries: ArrayEntry[], observer?: ArraySortObserver) {
    this.entries = entries
    this.observer = observer
  }

  private emit(kind: ArraySortEvent['kind'], label: string, detail: string, code: string, frame: ArraySortFrame = {}, index = 0, other?: number): void {
    this.observer?.({ kind, label, detail, code, frame, index, other })
  }

  private compare(first: number, second: number): number {
    const a = this.entries[first].value
    const b = this.entries[second].value
    this.emit('compare', 'Compare entries', `Compare ${a} at index ${first} with ${b} at index ${second}.`, `compare(array[${first}], array[${second}])`, { activeIndices: [first, second] }, first, second)
    return a < b ? -1 : a > b ? 1 : 0
  }

  private swap(first: number, second: number): void {
    if (first === second) return
    const temporary = this.entries[first]
    this.entries[first] = this.entries[second]
    this.entries[second] = temporary
    this.emit('swap', 'Exchange entries', `Swap indices ${first} and ${second}; retain each entry's identity.`, `swap(array[${first}], array[${second}])`, { roles: { [first]: 'SWAP', [second]: 'SWAP' } }, first, second)
  }

  private insertion(start: number, end: number, sortedEnd = start + 1): void {
    for (let index = sortedEnd; index < end; index += 1) {
      let low = start
      let high = index
      while (low < high) {
        const middle = low + Math.floor((high - low) / 2)
        if (this.compare(index, middle) < 0) high = middle
        else low = middle + 1
      }
      for (let position = index; position > low; position -= 1) this.swap(position, position - 1)
    }
  }

  public timSort(): void {
    const size = this.entries.length
    if (size < 2) return
    let minimum = size
    let remainder = 0
    while (minimum >= 8) {
      remainder |= minimum % 2
      minimum = Math.floor(minimum / 2)
    }
    minimum += remainder
    const runs: SortRun[] = []
    let start = 0
    while (start < size) {
      let end = start + 1
      const descending = end < size && this.compare(end, start) < 0
      if (end < size) end += 1
      while (end < size) {
        const order = this.compare(end, end - 1)
        if (descending ? order >= 0 : order < 0) break
        end += 1
      }
      this.emit('run', 'Detect a natural run', `Indices ${start} through ${end - 1} form a ${descending ? 'strictly decreasing' : 'nondecreasing'} run. Equal keys are never reversed.`, `run = [${start}, ${end})`, { roles: { [start]: 'RUN START', [end - 1]: 'RUN END' } }, start, end - 1)
      if (descending) {
        for (let left = start, right = end - 1; left < right; left += 1, right -= 1) this.swap(left, right)
        this.emit('reverse', 'Reverse the decreasing run', 'The run is now ascending. Strict descent ensures that equal keys retain their order.', `reverse(array[${start}:${end}])`, {}, start, end - 1)
      }
      const extended = Math.min(size, Math.max(end, start + minimum))
      if (extended > end) {
        this.emit('extend', 'Extend a short run', `Stable binary insertion extends this run to ${extended - start} entries. The teaching minrun is ${minimum}.`, `binaryInsertion(array, ${start}, ${end}, ${extended})`, {}, start, extended)
        this.insertion(start, extended, end)
      }
      runs.push({ start, length: extended - start })
      this.collapseRuns(runs, false)
      start = extended
    }
    this.collapseRuns(runs, true)
  }

  private collapseRuns(runs: SortRun[], force: boolean): void {
    while (runs.length > 1) {
      let index = runs.length - 2
      if (!force) {
        if (index > 0 && runs[index - 1].length <= runs[index].length + runs[index + 1].length || index > 1 && runs[index - 2].length <= runs[index - 1].length + runs[index].length) {
          if (runs[index - 1].length < runs[index + 1].length) index -= 1
        } else if (runs[index].length > runs[index + 1].length) break
      } else if (index > 0 && runs[index - 1].length < runs[index + 1].length) index -= 1
      const first = runs[index]
      const second = runs[index + 1]
      this.emit('collapse', force ? 'Finish the pending run stack' : 'Restore the run-stack invariant', `Merge adjacent runs of lengths ${first.length} and ${second.length}. Check both top triples so older runs cannot violate the invariant.`, `mergeRuns(${first.start}, ${second.start}, ${second.start + second.length})`, {}, first.start, second.start)
      this.mergeRuns(first.start, second.start, second.start + second.length)
      runs.splice(index, 2, { start: first.start, length: first.length + second.length })
    }
  }

  private mergeRuns(start: number, middle: number, end: number): void {
    if (this.compare(middle - 1, middle) <= 0) return
    const buffer = this.entries.slice(start, end)
    const boundary = middle - start
    let first = 0
    let second = boundary
    let destination = start
    let leftWins = 0
    let rightWins = 0
    this.emit('buffer', 'Copy the two runs', 'The auxiliary buffer preserves unread entries while output is written back into the same array.', 'buffer = copy(adjacent runs)', { buffer, bufferStart: start, writeIndex: destination, rangeEnd: end - 1 }, start)
    while (first < boundary || second < buffer.length) {
      if (first < boundary && second < buffer.length) {
        this.emit('compare', 'Compare run heads', `Compare buffered values ${buffer[first].value} and ${buffer[second].value}; choose the left on equality.`, 'take left if left <= right', { buffer, bufferStart: start, writeIndex: destination, rangeEnd: end - 1, activeBufferIndex: start + first, otherBufferIndex: start + second }, start + first, start + second)
      }
      const takeLeft = second === buffer.length || first < boundary && buffer[first].value <= buffer[second].value
      let limit = takeLeft ? first + 1 : second + 1
      leftWins = takeLeft ? leftWins + 1 : 0
      rightWins = takeLeft ? 0 : rightWins + 1
      if (first < boundary && second < buffer.length && (leftWins >= 7 || rightWins >= 7)) {
        limit = this.gallop(buffer, takeLeft ? first : second, takeLeft ? boundary : buffer.length, buffer[takeLeft ? second : first].value, takeLeft)
        this.emit('gallop', 'Gallop across a winning run', `Exponential probing followed by binary search finds ${limit - (takeLeft ? first : second)} consecutive entries to copy. Left ties stay before right ties. This variant uses a fixed trigger of seven wins.`, 'bound = exponentialThenBinarySearch(run, opposingHead)', { buffer, bufferStart: start, writeIndex: destination, rangeEnd: end - 1 }, start + (takeLeft ? first : second))
        leftWins = rightWins = 0
      }
      do {
        const source = takeLeft ? first++ : second++
        this.entries[destination] = buffer[source]
        destination += 1
        this.emit('write', 'Write the next merged entry', `Copy buffered key ${buffer[source].value} to index ${destination - 1}.`, `array[${destination - 1}] = buffer[${start + source}]`, { buffer, bufferStart: start, writeIndex: destination, rangeEnd: end - 1, activeBufferIndex: start + source, roles: { [destination - 1]: 'WRITE' } }, destination - 1)
      } while ((takeLeft ? first : second) < limit)
    }
    this.emit('merge', 'Merged run ready', `Indices ${start} through ${end - 1} are one stable sorted run.`, `run = [${start}, ${end})`, {}, start, end - 1)
  }

  private gallop(buffer: readonly ArrayEntry[], start: number, end: number, key: number, inclusive: boolean): number {
    let step = 1
    while (start + step < end && (inclusive ? buffer[start + step].value <= key : buffer[start + step].value < key)) step *= 2
    let low = start + Math.floor(step / 2)
    let high = Math.min(end, start + step + 1)
    while (low < high) {
      const middle = low + Math.floor((high - low) / 2)
      if (inclusive ? buffer[middle].value <= key : buffer[middle].value < key) low = middle + 1
      else high = middle
    }
    return low
  }

  public introSort(): void {
    if (this.entries.length < 2) return
    this.introRange(0, this.entries.length, 2 * Math.floor(Math.log2(this.entries.length)))
  }

  private introRange(start: number, end: number, budget: number): void {
    while (end - start > 4) {
      if (budget === 0) {
        this.emit('fallback', 'Switch to Heap Sort', `The partition-depth budget is exhausted. Heap-sort only indices ${start} through ${end - 1}, bounding worst-case time.`, `heapSort(array, ${start}, ${end})`, { roles: { [start]: 'HEAP START', [end - 1]: 'HEAP END' } }, start, end - 1)
        this.heapRange(start, end)
        return
      }
      budget -= 1
      const middle = start + Math.floor((end - start) / 2)
      if (this.compare(start, middle) > 0) this.swap(start, middle)
      if (this.compare(start, end - 1) > 0) this.swap(start, end - 1)
      if (this.compare(middle, end - 1) > 0) this.swap(middle, end - 1)
      this.swap(middle, end - 1)
      const pivot = this.entries[end - 1].value
      this.emit('pivot', 'Choose a median-of-three pivot', `Use pivot ${pivot}; this path has ${budget} partition levels left before Heap Sort.`, `pivot = median(first, middle, last); budget = ${budget}`, { roles: { [end - 1]: 'PIVOT' } }, end - 1)
      let boundary = start
      for (let index = start; index < end - 1; index += 1) {
        if (this.compare(index, end - 1) <= 0) this.swap(boundary++, index)
      }
      this.swap(boundary, end - 1)
      this.emit('partition', 'Finalize the pivot', `Index ${boundary} is fixed. Recurse into the smaller side and iterate over the larger side to bound stack space.`, `partition = ${boundary}`, { roles: { [boundary]: 'FIXED' } }, boundary)
      if (boundary - start < end - boundary - 1) {
        this.introRange(start, boundary, budget)
        start = boundary + 1
      } else {
        this.introRange(boundary + 1, end, budget)
        end = boundary
      }
    }
    if (end - start > 1) {
      this.emit('fallback', 'Finish a small partition by insertion', `Stable binary insertion finishes this ${end - start}-entry partition. The complete hybrid is unstable.`, `insertionSort(array, ${start}, ${end})`, {}, start, end - 1)
      this.insertion(start, end)
    }
  }

  private heapRange(start: number, end: number): void {
    const length = end - start
    for (let parent = Math.floor(length / 2) - 1; parent >= 0; parent -= 1) this.sift(start, parent, length)
    for (let size = length - 1; size > 0; size -= 1) {
      this.swap(start, start + size)
      this.sift(start, 0, size)
    }
  }

  private sift(start: number, parent: number, size: number): void {
    while (2 * parent + 1 < size) {
      let child = 2 * parent + 1
      if (child + 1 < size && this.compare(start + child, start + child + 1) < 0) child += 1
      if (this.compare(start + parent, start + child) >= 0) break
      this.swap(start + parent, start + child)
      parent = child
    }
  }

  public dualPivotQuickSort(): void {
    this.dualPivotRange(0, this.entries.length)
  }

  private dualPivotRange(start: number, end: number): void {
    while (end - start > 3) {
      if (this.compare(start, end - 1) > 0) this.swap(start, end - 1)
      const lower = this.entries[start].value
      const upper = this.entries[end - 1].value
      this.emit('pivot', 'Choose two ordered pivots', `Use endpoint pivots ${lower} and ${upper}. Separate keys into less than p, between p and q, and greater than q.`, `p = array[${start}]; q = array[${end - 1}]`, { roles: { [start]: 'LOW PIVOT', [end - 1]: 'HIGH PIVOT' } }, start, end - 1)
      let left = start + 1
      let right = end - 2
      for (let index = left; index <= right; index += 1) {
        if (this.compare(index, start) < 0) this.swap(index, left++)
        else if (this.compare(index, end - 1) > 0) {
          while (index < right && this.compare(right, end - 1) > 0) right -= 1
          this.swap(index, right--)
          if (this.compare(index, start) < 0) this.swap(index, left++)
        }
      }
      left -= 1
      right += 1
      this.swap(start, left)
      this.swap(end - 1, right)
      this.emit('partition', 'Finalize both pivots', `Pivots are fixed at indices ${left} and ${right}.${lower === upper ? ' Equal pivots make the entire middle equal, so skip it.' : ' Sort all three remaining ranges.'}`, `partitions = [${start}, ${left}), (${left}, ${right}), (${right}, ${end})`, { roles: { [left]: 'FIXED P', [right]: 'FIXED Q' } }, left, right)
      const ranges = [{ start, end: left }, { start: left + 1, end: lower === upper ? left + 1 : right }, { start: right + 1, end }]
      let largest = 0
      for (let index = 1; index < ranges.length; index += 1) {
        if (ranges[index].end - ranges[index].start > ranges[largest].end - ranges[largest].start) largest = index
      }
      for (let index = 0; index < ranges.length; index += 1) {
        if (index !== largest) this.dualPivotRange(ranges[index].start, ranges[index].end)
      }
      start = ranges[largest].start
      end = ranges[largest].end
    }
    this.insertion(start, end)
  }
}
