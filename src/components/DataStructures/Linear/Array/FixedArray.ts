import type { ArraySortCounter, ArraySortObserver } from './ArraySortTrace.ts'
import { HybridArraySort } from './HybridArraySort.ts'
import { BlockMergeArraySort } from './BlockMergeArraySort.ts'
import { WikiArraySort } from './WikiArraySort.ts'
import { SmoothArraySort } from './SmoothArraySort.ts'
import { TreeArraySort } from './TreeArraySort.ts'
import { TournamentArraySort } from './TournamentArraySort.ts'
import { PatienceArraySort } from './PatienceArraySort.ts'
import { CycleArraySort } from './CycleArraySort.ts'
import { CombArraySort } from './CombArraySort.ts'
import { CocktailShakerArraySort } from './CocktailShakerArraySort.ts'
import { GnomeArraySort } from './GnomeArraySort.ts'
import { OddEvenArraySort } from './OddEvenArraySort.ts'
import { OddEvenMergeArraySort } from './OddEvenMergeArraySort.ts'
import { BitonicArraySort } from './BitonicArraySort.ts'
import { PairwiseNetworkArraySort } from './PairwiseNetworkArraySort.ts'
import { SampleArraySort } from './SampleArraySort.ts'
import { ParallelArraySort } from './ParallelArraySort.ts'
import { ExternalArraySort } from './ExternalArraySort.ts'
import { NaturalMergeArraySort } from './NaturalMergeArraySort.ts'
import { FlashArraySort } from './FlashArraySort.ts'
import { AmericanFlagArraySort } from './AmericanFlagArraySort.ts'
import { SpreadArraySort } from './SpreadArraySort.ts'
import { BurstArraySort } from './BurstArraySort.ts'
import { PigeonholeArraySort } from './PigeonholeArraySort.ts'
import { InterpolationArraySort } from './InterpolationArraySort.ts'
import { LibraryArraySort } from './LibraryArraySort.ts'
import { SplayArraySort } from './SplayArraySort.ts'
import { StrandArraySort } from './StrandArraySort.ts'
import { PancakeArraySort } from './PancakeArraySort.ts'
import { StoogeArraySort } from './StoogeArraySort.ts'
import { SlowArraySort } from './SlowArraySort.ts'
import { BogoArraySort } from './BogoArraySort.ts'
import { SleepArraySort } from './SleepArraySort.ts'

export interface ArrayEntry {
  readonly id: string
  readonly value: number
}

export interface BubbleSortEvent {
  readonly kind: 'compare' | 'swap' | 'pass'
  readonly index: number
  readonly end: number
  readonly swapped: boolean
}

export class FixedArray {
  public static readonly maximumCountingRange = 4096
  public static readonly maximumPigeonholeRange = 4096
  public static readonly maximumStoogeSortLength = 12
  public static readonly maximumSlowSortLength = 12
  public static readonly maximumBogoShuffles = 24
  private items: ArrayEntry[]
  private nextId: number

  constructor(values: readonly number[] = []) {
    this.items = new Array<ArrayEntry>(values.length)
    for (let index = 0; index < values.length; index += 1) {
      FixedArray.validateValue(values[index])
      this.items[index] = { id: `array-element-${index}`, value: values[index] }
    }
    this.nextId = values.length
  }

  public get length(): number {
    return this.items.length
  }

  public static createDefault(): FixedArray {
    const values: number[] = []
    for (let value = 10; value <= 100; value += 10) values.push(value)
    return new FixedArray(values)
  }

  public static createSortingDefault(): FixedArray {
    return new FixedArray([60, 20, 90, 40, 10, 80, 30, 100, 50, 70])
  }

  // Sort the existing fixed allocation. Trace consumers can snapshot each operation.
  public bubbleSort(onStep?: (event: BubbleSortEvent) => void): void {
    for (let end = this.length - 1; end > 0; end -= 1) {
      let swapped = false
      for (let index = 0; index < end; index += 1) {
        onStep?.({ kind: 'compare', index, end, swapped })
        if (this.items[index].value > this.items[index + 1].value) {
          const temporary = this.items[index]
          this.items[index] = this.items[index + 1]
          this.items[index + 1] = temporary
          swapped = true
          onStep?.({ kind: 'swap', index, end, swapped })
        }
      }
      onStep?.({ kind: 'pass', index: end, end, swapped })
      if (!swapped) break
    }
  }

  public selectionSort(onStep?: ArraySortObserver): void {
    for (let start = 0; start < this.length - 1; start += 1) {
      let minimum = start
      onStep?.({ kind: 'select', index: minimum, frame: { sortedPrefix: start, roles: { [minimum]: 'MIN' } } })
      for (let index = start + 1; index < this.length; index += 1) {
        onStep?.({ kind: 'compare', index, other: minimum, frame: { sortedPrefix: start, activeIndices: [index, minimum], roles: { [minimum]: 'MIN', [index]: 'COMPARE' } } })
        if (this.items[index].value < this.items[minimum].value) {
          minimum = index
          onStep?.({ kind: 'select', index: minimum, frame: { sortedPrefix: start, roles: { [minimum]: 'MIN' } } })
        }
      }
      if (minimum !== start) {
        this.swapEntries(start, minimum)
        onStep?.({ kind: 'swap', index: start, other: minimum, frame: { sortedPrefix: start, activeIndices: [start, minimum], roles: { [start]: 'SWAP', [minimum]: 'SWAP' } } })
      }
      onStep?.({ kind: 'pass', index: start, frame: { sortedPrefix: start + 1 } })
    }
  }

  public timSort(onStep?: ArraySortObserver): void {
    new HybridArraySort(this.items, onStep).timSort()
  }

  public introSort(onStep?: ArraySortObserver): void {
    new HybridArraySort(this.items, onStep).introSort()
  }

  public dualPivotQuickSort(onStep?: ArraySortObserver): void {
    new HybridArraySort(this.items, onStep).dualPivotQuickSort()
  }

  public blockMergeSort(onStep?: ArraySortObserver): void {
    new BlockMergeArraySort(this.items, onStep).sort()
  }

  public wikiSort(onStep?: ArraySortObserver): void {
    new WikiArraySort(this.items, onStep).sort()
  }

  public smoothSort(onStep?: ArraySortObserver): void {
    new SmoothArraySort(this.items, onStep).sort()
  }

  public treeSort(onStep?: ArraySortObserver): void {
    new TreeArraySort(this.items, onStep).sort()
  }

  public tournamentSort(onStep?: ArraySortObserver): void {
    new TournamentArraySort(this.items, onStep).sort()
  }

  public patienceSort(onStep?: ArraySortObserver): void {
    new PatienceArraySort(this.items, onStep).sort()
  }

  public cycleSort(onStep?: ArraySortObserver): void {
    new CycleArraySort(this.items, onStep).sort()
  }

  public combSort(onStep?: ArraySortObserver): void {
    new CombArraySort(this.items, onStep).sort()
  }

  public cocktailShakerSort(onStep?: ArraySortObserver): void {
    new CocktailShakerArraySort(this.items, onStep).sort()
  }

  public gnomeSort(onStep?: ArraySortObserver): void {
    new GnomeArraySort(this.items, onStep).sort()
  }

  public oddEvenSort(onStep?: ArraySortObserver): void {
    new OddEvenArraySort(this.items, onStep).sort()
  }

  public oddEvenMergeSort(onStep?: ArraySortObserver): void {
    new OddEvenMergeArraySort(this.items, onStep).sort()
  }

  public bitonicSort(onStep?: ArraySortObserver): void {
    new BitonicArraySort(this.items, onStep).sort()
  }

  public pairwiseSortingNetwork(onStep?: ArraySortObserver): void {
    new PairwiseNetworkArraySort(this.items, onStep).sort()
  }

  public parallelMergeSort(onStep?: ArraySortObserver): void {
    new ParallelArraySort(this.items, onStep).mergeSort()
  }

  public parallelQuickSort(onStep?: ArraySortObserver): void {
    new ParallelArraySort(this.items, onStep).quickSort()
  }

  public externalMergeSort(onStep?: ArraySortObserver): void {
    new ExternalArraySort(this.items, onStep).externalMergeSort()
  }

  public polyphaseMergeSort(onStep?: ArraySortObserver): void {
    new ExternalArraySort(this.items, onStep).polyphaseMergeSort()
  }

  public flashSort(onStep?: ArraySortObserver): void {
    new FlashArraySort(this.items, onStep).sort()
  }

  public americanFlagSort(onStep?: ArraySortObserver): void {
    new AmericanFlagArraySort(this.items, onStep).sort()
  }

  public spreadSort(onStep?: ArraySortObserver): void {
    new SpreadArraySort(this.items, onStep).sort()
  }

  public burstSort(onStep?: ArraySortObserver): void {
    new BurstArraySort(this.items, onStep).sort()
  }

  public interpolationSort(onStep?: ArraySortObserver): void {
    new InterpolationArraySort(this.items, onStep).sort()
  }

  public librarySort(onStep?: ArraySortObserver): void {
    new LibraryArraySort(this.items, onStep).sort()
  }

  public splaySort(onStep?: ArraySortObserver): void {
    new SplayArraySort(this.items, onStep).sort()
  }

  public strandSort(onStep?: ArraySortObserver): void {
    new StrandArraySort(this.items, onStep).sort()
  }

  public pancakeSort(onStep?: ArraySortObserver): void {
    new PancakeArraySort(this.items, onStep).sort()
  }

  public stoogeSort(onStep?: ArraySortObserver): boolean {
    return new StoogeArraySort(this.items, onStep).sort(FixedArray.maximumStoogeSortLength)
  }

  public slowSort(onStep?: ArraySortObserver): boolean {
    return new SlowArraySort(this.items, onStep).sort(FixedArray.maximumSlowSortLength)
  }

  public bogoSort(onStep?: ArraySortObserver): boolean {
    return new BogoArraySort(this.items, onStep).sort(FixedArray.maximumBogoShuffles)
  }

  public sleepSort(onStep?: ArraySortObserver): void {
    new SleepArraySort(this.items, onStep).sort()
  }

  public pigeonholeSort(onStep?: ArraySortObserver): boolean {
    return new PigeonholeArraySort(this.items, onStep).sort(FixedArray.maximumPigeonholeRange)
  }

  public naturalMergeSort(onStep?: ArraySortObserver): void {
    new NaturalMergeArraySort(this.items, onStep).sort()
  }

  public sampleSort(onStep?: ArraySortObserver): void {
    new SampleArraySort(this.items, onStep).sort()
  }

  public insertionSort(onStep?: ArraySortObserver): void {
    this.insertSortedPrefix(false, onStep)
  }

  public binaryInsertionSort(onStep?: ArraySortObserver): void {
    this.insertSortedPrefix(true, onStep)
  }

  private insertSortedPrefix(binary: boolean, onStep?: ArraySortObserver): void {
    for (let index = 1; index < this.length; index += 1) {
      const held = this.items[index]
      onStep?.({ kind: 'hold', index, frame: { held, hole: index, sortedPrefix: index } })
      let position = index
      if (binary) {
        let low = 0
        let high = index
        while (low < high) {
          const middle = low + Math.floor((high - low) / 2)
          onStep?.({ kind: 'compare', index: middle, left: low, right: high, frame: { held, hole: index, sortedPrefix: index, activeIndices: [middle], roles: { [middle]: 'MID' } } })
          if (held.value < this.items[middle].value) high = middle
          else low = middle + 1
        }
        position = low
        onStep?.({ kind: 'bounds', index: position, frame: { held, hole: index, sortedPrefix: index, roles: { [position]: 'INSERT' } } })
      } else {
        while (position > 0) {
          onStep?.({ kind: 'compare', index: position - 1, frame: { held, hole: index, sortedPrefix: index, activeIndices: [position - 1] } })
          if (this.items[position - 1].value <= held.value) break
          position -= 1
        }
      }
      for (let hole = index; hole > position; hole -= 1) {
        this.items[hole] = this.items[hole - 1]
        onStep?.({ kind: 'shift', index: hole - 1, other: hole, frame: { held, hole: hole - 1, sortedPrefix: index, activeIndices: [hole], roles: { [hole]: 'SHIFT' } } })
      }
      this.items[position] = held
      onStep?.({ kind: 'place', index: position, other: index, frame: { sortedPrefix: index + 1, roles: { [position]: 'INSERTED' } } })
    }
  }

  public mergeSort(onStep?: ArraySortObserver): void {
    const buffer = new Array<ArrayEntry>(this.length)
    this.mergeRange(0, this.length - 1, buffer, onStep)
  }

  private mergeRange(left: number, right: number, buffer: ArrayEntry[], onStep?: ArraySortObserver): void {
    if (left >= right) return
    const middle = left + Math.floor((right - left) / 2)
    onStep?.({ kind: 'split', index: middle, left, middle, right, frame: { roles: { [left]: 'LEFT', [middle]: 'MID', [right]: 'RIGHT' } } })
    this.mergeRange(left, middle, buffer, onStep)
    this.mergeRange(middle + 1, right, buffer, onStep)
    for (let index = left; index <= right; index += 1) buffer[index] = this.items[index]
    // Copies for the observer are visualization overhead, not sorting storage.
    const snapshot = onStep ? buffer.slice(left, right + 1) : undefined
    onStep?.({ kind: 'buffer', index: left, left, middle, right, frame: { buffer: snapshot, bufferStart: left, writeIndex: left, rangeEnd: right } })
    let first = left
    let second = middle + 1
    for (let destination = left; destination <= right; destination += 1) {
      if (first <= middle && second <= right) {
        onStep?.({ kind: 'compare', index: first, other: second, left, middle, right, frame: { buffer: snapshot, bufferStart: left, writeIndex: destination, rangeEnd: right, activeBufferIndex: first, otherBufferIndex: second } })
      }
      let source: number
      if (second > right || first <= middle && buffer[first].value <= buffer[second].value) source = first++
      else source = second++
      this.items[destination] = buffer[source]
      onStep?.({ kind: 'write', index: destination, other: source, left, middle, right, frame: { buffer: snapshot, bufferStart: left, writeIndex: destination + 1, rangeEnd: right, activeIndices: [destination], roles: { [destination]: 'WRITE' }, activeBufferIndex: source } })
    }
    onStep?.({ kind: 'merge', index: left, left, middle, right, frame: { roles: { [left]: 'MERGED', [right]: 'MERGED' } } })
  }

  public quickSort(onStep?: ArraySortObserver): void {
    this.quickSortRange(0, this.length - 1, onStep)
  }

  private quickSortRange(left: number, right: number, onStep?: ArraySortObserver): void {
    if (left > right) return
    if (left === right) {
      onStep?.({ kind: 'partition', index: left, left, right, frame: {} })
      return
    }
    const pivot = this.items[right].value
    onStep?.({ kind: 'pivot', index: right, left, right, frame: { roles: { [right]: 'PIVOT', [left]: 'START' } } })
    let boundary = left
    for (let index = left; index < right; index += 1) {
      onStep?.({ kind: 'compare', index, other: right, left, right, frame: { activeIndices: [index, right], roles: { [right]: 'PIVOT', [index]: 'COMPARE' } } })
      if (this.items[index].value <= pivot) {
        if (boundary !== index) {
          this.swapEntries(boundary, index)
          onStep?.({ kind: 'swap', index: boundary, other: index, left, right, frame: { activeIndices: [boundary, index], roles: { [right]: 'PIVOT', [boundary]: 'SWAP', [index]: 'SWAP' } } })
        }
        boundary += 1
      }
    }
    if (boundary !== right) {
      this.swapEntries(boundary, right)
      onStep?.({ kind: 'swap', index: boundary, other: right, left, right, frame: { activeIndices: [boundary, right], roles: { [boundary]: 'PIVOT', [right]: 'SWAP' } } })
    }
    onStep?.({ kind: 'partition', index: boundary, left, right, frame: { roles: { [boundary]: 'FIXED' } } })
    this.quickSortRange(left, boundary - 1, onStep)
    this.quickSortRange(boundary + 1, right, onStep)
  }

  private swapEntries(first: number, second: number): void {
    const temporary = this.items[first]
    this.items[first] = this.items[second]
    this.items[second] = temporary
  }

  public heapSort(onStep?: ArraySortObserver): void {
    if (this.length < 2) return
    for (let parent = Math.floor(this.length / 2) - 1; parent >= 0; parent -= 1) {
      onStep?.({ kind: 'heap', index: parent, amount: this.length, frame: { roles: { [parent]: 'SIFT' } } })
      this.siftSortHeap(parent, this.length, onStep)
    }
    onStep?.({ kind: 'pass', index: 0, amount: this.length, frame: { roles: { 0: 'MAX' } } })
    for (let end = this.length - 1; end > 0; end -= 1) {
      this.swapEntries(0, end)
      onStep?.({ kind: 'extract', index: end, amount: end, frame: { sortedFrom: end, activeIndices: [0, end], roles: { 0: 'REPAIR', [end]: 'MAX' } } })
      this.siftSortHeap(0, end, onStep)
    }
  }

  private siftSortHeap(start: number, size: number, onStep?: ArraySortObserver): void {
    let parent = start
    while (2 * parent + 1 < size) {
      let child = 2 * parent + 1
      if (child + 1 < size) {
        onStep?.({ kind: 'compare', index: child, other: child + 1, amount: size, frame: { sortedFrom: size, activeIndices: [child, child + 1], roles: { [child]: 'CHILD', [child + 1]: 'CHILD' } } })
        if (this.items[child].value < this.items[child + 1].value) child += 1
      }
      onStep?.({ kind: 'compare', index: parent, other: child, amount: size, frame: { sortedFrom: size, activeIndices: [parent, child], roles: { [parent]: 'PARENT', [child]: 'LARGER' } } })
      if (this.items[parent].value >= this.items[child].value) break
      this.swapEntries(parent, child)
      onStep?.({ kind: 'swap', index: parent, other: child, amount: size, frame: { sortedFrom: size, activeIndices: [parent, child], roles: { [parent]: 'SWAP', [child]: 'SWAP' } } })
      parent = child
    }
  }

  public shellSort(onStep?: ArraySortObserver): void {
    if (this.length < 2) return
    let gap = 1
    while (gap < Math.floor(this.length / 3)) gap = 3 * gap + 1
    while (gap >= 1) {
      onStep?.({ kind: 'gap', index: 0, amount: gap, frame: {} })
      for (let index = gap; index < this.length; index += 1) {
        for (let position = index; position >= gap; position -= gap) {
          onStep?.({ kind: 'compare', index: position - gap, other: position, amount: gap, frame: { activeIndices: [position - gap, position], roles: { [position - gap]: 'GAP LEFT', [position]: 'GAP RIGHT' } } })
          if (this.items[position - gap].value <= this.items[position].value) break
          this.swapEntries(position - gap, position)
          onStep?.({ kind: 'swap', index: position - gap, other: position, amount: gap, frame: { activeIndices: [position - gap, position], roles: { [position - gap]: 'SWAP', [position]: 'SWAP' } } })
        }
      }
      onStep?.({ kind: 'pass', index: 0, amount: gap, frame: {} })
      gap = Math.floor(gap / 3)
    }
  }

  public countingSort(onStep?: ArraySortObserver): boolean {
    if (this.length < 2) return true
    const { minimum, maximum } = this.sortBounds()
    const span = maximum - minimum + 1n
    if (span > BigInt(FixedArray.maximumCountingRange)) {
      onStep?.({ kind: 'reject', index: 0, label: span.toString(), detail: `The key range has ${span} values; Counting Sort is limited to ${FixedArray.maximumCountingRange} count cells. The array is unchanged. Use a comparison sort or Radix Sort for this input.`, frame: {} })
      return false
    }
    const range = Number(span)
    const counts = new Array<number>(range).fill(0)
    const hint = `${range} count cells represent keys ${minimum} through ${maximum}. Only observed keys are drawn; omitted keys have frequency zero.`
    for (let index = 0; index < this.length; index += 1) {
      const key = Number(BigInt(this.items[index].value) - minimum)
      counts[key] += 1
      onStep?.({ kind: 'count', index, amount: counts[key], label: String(this.items[index].value), frame: { activeIndices: [index], counters: this.countCells(counts, minimum, key), counterHint: hint } })
    }
    const next = new Array<number>(range).fill(0)
    let position = 0
    for (let key = 0; key < range; key += 1) {
      next[key] = position
      position += counts[key]
      if (counts[key] > 0) onStep?.({ kind: 'prefix', index: key, amount: next[key], label: String(minimum + BigInt(key)), frame: { counters: this.countCells(counts, minimum, key, next), counterHint: hint } })
    }
    const output = new Array<ArrayEntry | null>(this.length).fill(null)
    for (let index = 0; index < this.length; index += 1) {
      const entry = this.items[index]
      const key = Number(BigInt(entry.value) - minimum)
      const destination = next[key]++
      output[destination] = entry
      onStep?.({ kind: 'distribute', index, other: destination, label: String(entry.value), frame: { activeIndices: [index], output: output.slice(), counters: this.countCells(counts, minimum, key, next), counterHint: hint } })
    }
    for (let index = 0; index < this.length; index += 1) this.items[index] = output[index]!
    onStep?.({ kind: 'gather', index: 0, frame: { sortedPrefix: this.length } })
    return true
  }

  public radixSort(onStep?: ArraySortObserver): void {
    if (this.length < 2) return
    const { minimum, maximum } = this.sortBounds()
    const largestKey = maximum - minimum
    for (let place = 1n; place === 1n || place <= largestKey; place *= 10n) {
      const buckets: ArrayEntry[][] = []
      for (let digit = 0; digit < 10; digit += 1) buckets.push([])
      onStep?.({ kind: 'digit', index: 0, label: place.toString(), detail: `Use decimal place ${place} of exact key value - (${minimum}). Subtracting the minimum handles negative values without reversing equal entries.`, frame: {} })
      for (let index = 0; index < this.length; index += 1) {
        const entry = this.items[index]
        const digit = Number(((BigInt(entry.value) - minimum) / place) % 10n)
        buckets[digit].push(entry)
        onStep?.({ kind: 'distribute', index, other: digit, label: place.toString(), frame: { activeIndices: [index], buckets: this.copySortBuckets(buckets), counters: this.bucketCounters(buckets, digit) } })
      }
      let destination = 0
      for (const bucket of buckets) {
        for (const entry of bucket) this.items[destination++] = entry
      }
      onStep?.({ kind: 'gather', index: 0, label: place.toString(), frame: {} })
    }
  }

  public bucketSort(onStep?: ArraySortObserver): void {
    if (this.length < 2) return
    const { minimum, maximum } = this.sortBounds()
    const span = maximum - minimum + 1n
    const bucketCount = this.length
    const buckets: ArrayEntry[][] = []
    for (let bucket = 0; bucket < bucketCount; bucket += 1) buckets.push([])
    onStep?.({ kind: 'bounds', index: 0, amount: bucketCount, detail: `Map keys ${minimum} through ${maximum} into ${bucketCount} equal-width buckets using exact integer arithmetic.`, frame: {} })
    for (let index = 0; index < this.length; index += 1) {
      const entry = this.items[index]
      const bucket = Number(((BigInt(entry.value) - minimum) * BigInt(bucketCount)) / span)
      buckets[bucket].push(entry)
      onStep?.({ kind: 'distribute', index, other: bucket, frame: { activeIndices: [index], buckets: this.copySortBuckets(buckets), counters: this.bucketCounters(buckets, bucket) } })
    }
    for (let bucket = 0; bucket < buckets.length; bucket += 1) {
      onStep?.({ kind: 'bucket-sort', index: bucket, frame: { buckets: this.copySortBuckets(buckets), counters: this.bucketCounters(buckets, bucket) } })
      for (let index = 1; index < buckets[bucket].length; index += 1) {
        for (let position = index; position > 0; position -= 1) {
          const first = buckets[bucket][position - 1]
          const second = buckets[bucket][position]
          onStep?.({ kind: 'compare', index: position - 1, other: position, amount: bucket, label: `${first.value} and ${second.value}`, frame: { buckets: this.copySortBuckets(buckets), counters: this.bucketCounters(buckets, bucket), activeBucket: bucket, activeBucketIndices: [position - 1, position] } })
          if (first.value <= second.value) break
          buckets[bucket][position - 1] = second
          buckets[bucket][position] = first
          onStep?.({ kind: 'swap', index: position - 1, other: position, amount: bucket, frame: { buckets: this.copySortBuckets(buckets), counters: this.bucketCounters(buckets, bucket), activeBucket: bucket, activeBucketIndices: [position - 1, position], bucketStatus: 'SWAP' } })
        }
      }
    }
    let destination = 0
    for (const bucket of buckets) {
      for (const entry of bucket) this.items[destination++] = entry
    }
    onStep?.({ kind: 'gather', index: 0, frame: { sortedPrefix: this.length } })
  }

  private sortBounds(): { minimum: bigint, maximum: bigint } {
    let minimum = BigInt(this.items[0].value)
    let maximum = minimum
    for (let index = 1; index < this.length; index += 1) {
      const value = BigInt(this.items[index].value)
      if (value < minimum) minimum = value
      if (value > maximum) maximum = value
    }
    return { minimum, maximum }
  }

  private countCells(counts: readonly number[], minimum: bigint, active: number, next?: readonly number[]): ArraySortCounter[] {
    const cells: ArraySortCounter[] = []
    for (let index = 0; index < counts.length; index += 1) {
      if (counts[index] > 0) cells.push({ label: String(minimum + BigInt(index)), count: next ? next[index] : counts[index], active: index === active, status: next ? 'NEXT' : 'COUNT' })
    }
    return cells
  }

  private copySortBuckets(buckets: readonly (readonly ArrayEntry[])[]): ArrayEntry[][] {
    const copy: ArrayEntry[][] = []
    for (const bucket of buckets) copy.push([...bucket])
    return copy
  }

  private bucketCounters(buckets: readonly (readonly ArrayEntry[])[], active: number): ArraySortCounter[] {
    const counters: ArraySortCounter[] = []
    for (let index = 0; index < buckets.length; index += 1) counters.push({ label: `bucket ${index}`, count: buckets[index].length, active: index === active, status: 'COUNT' })
    return counters
  }

  // A fixed array never grows. Insertion produces a separate array of exact length + 1.
  public withInsertedAt(index: number, value: number): FixedArray {
    if (!Number.isInteger(index) || index < 0 || index > this.length) {
      throw new RangeError('Insertion index is outside the array')
    }
    FixedArray.validateValue(value)
    const result = new FixedArray()
    result.items = new Array<ArrayEntry>(this.length + 1)
    for (let position = 0; position < index; position += 1) {
      result.items[position] = { ...this.items[position] }
    }
    result.items[index] = { id: `array-element-${this.nextId}`, value }
    for (let position = index; position < this.length; position += 1) {
      result.items[position + 1] = { ...this.items[position] }
    }
    result.nextId = this.nextId + 1
    return result
  }

  public getAt(index: number): ArrayEntry {
    if (!Number.isInteger(index) || index < 0 || index >= this.length)
      throw new RangeError('Index is outside the array')
    return { ...this.items[index] }
  }

  public findIndex(value: number): number {
    FixedArray.validateValue(value)
    for (let index = 0; index < this.length; index += 1) {
      if (this.items[index].value === value) return index
    }
    return -1
  }

  public withoutAt(index: number): FixedArray {
    this.getAt(index)
    const result = new FixedArray()
    result.items = new Array<ArrayEntry>(this.length - 1)
    let destination = 0
    for (let source = 0; source < this.length; source += 1) {
      if (source === index) continue
      result.items[destination] = { ...this.items[source] }
      destination += 1
    }
    result.nextId = this.nextId
    return result
  }

  public withoutAll(): FixedArray {
    const result = new FixedArray()
    result.nextId = this.nextId
    return result
  }

  public getEntries(): ArrayEntry[] {
    const entries = new Array<ArrayEntry>(this.length)
    for (let index = 0; index < this.length; index += 1) {
      entries[index] = { ...this.items[index] }
    }
    return entries
  }

  public clone(): FixedArray {
    const copy = new FixedArray()
    copy.items = this.getEntries()
    copy.nextId = this.nextId
    return copy
  }

  private static validateValue(value: number): void {
    if (!Number.isSafeInteger(value)) {
      throw new TypeError('Array values must be safe integers')
    }
  }
}
