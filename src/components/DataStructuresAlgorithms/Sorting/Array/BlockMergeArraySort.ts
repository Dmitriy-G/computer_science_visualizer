import type { ArrayEntry } from '../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import type { ArraySortEvent, ArraySortFrame, ArraySortObserver } from './ArraySortTrace.ts'

interface SortedBlock {
  readonly start: number
  readonly end: number
  next: number
}

export class BlockMergeArraySort {
  private readonly entries: ArrayEntry[]
  private readonly observer?: ArraySortObserver
  private output: (ArrayEntry | null)[] | null = null

  constructor(entries: ArrayEntry[], observer?: ArraySortObserver) {
    this.entries = entries
    this.observer = observer
  }

  private emit(kind: ArraySortEvent['kind'], label: string, detail: string, code: string, frame: ArraySortFrame = {}, index = 0, other?: number): void {
    if (!this.observer) return
    this.observer({ kind, label, detail, code, frame: { ...frame, output: this.output ? [...this.output] : undefined }, index, other })
  }

  public sort(): void {
    const length = this.entries.length
    if (length < 2) return
    let ordered = true
    for (let index = 1; index < length; index += 1) {
      this.emit('compare', 'Check the input order', `Compare ${this.entries[index - 1].value} and ${this.entries[index].value} before allocating working storage.`, `array[${index - 1}] <= array[${index}]`, { activeIndices: [index - 1, index] }, index - 1, index)
      if (this.entries[index - 1].value > this.entries[index].value) {
        ordered = false
        break
      }
    }
    if (ordered) {
      this.emit('pass', 'Array already ordered', 'No block sorting or output buffer is needed.', 'if ordered: return array')
      return
    }
    const blockSize = Math.max(2, Math.ceil(Math.sqrt(length)))
    const blocks: SortedBlock[] = []
    const work = new Array<ArrayEntry>(length)
    for (let start = 0; start < length; start += blockSize) {
      const end = Math.min(length, start + blockSize)
      this.emit('block', 'Sort one block', `Build a stable sorted block at indices ${start} through ${end - 1}. The final block may be shorter than ${blockSize} entries.`, `sortBlock(${start}, ${end})`, { roles: { [start]: 'BLOCK START', [end - 1]: 'BLOCK END' } }, start, end - 1)
      for (let width = 1; width < end - start; width *= 2) {
        for (let left = start; left + width < end; left += 2 * width) this.mergePair(left, left + width, Math.min(end, left + 2 * width), work)
      }
      blocks.push({ start, end, next: start })
      this.emit('pass', 'Sorted block ready', `Indices ${start} through ${end - 1} are sorted, preserving equal-key order inside this block.`, `block = [${start}, ${end})`, { roles: { [start]: 'SORTED BLOCK', [end - 1]: 'SORTED BLOCK' } }, start, end - 1)
    }
    this.output = new Array<ArrayEntry | null>(length).fill(null)
    const heap: number[] = []
    this.emit('stage', 'Merge the sorted block heads', `Use a min-heap with one head per block. Compare keys first and original block positions second to preserve stable ties. There are ${blocks.length} blocks.`, 'heap = block heads; output = empty array')
    for (let index = 0; index < blocks.length; index += 1) {
      heap.push(index)
      let child = heap.length - 1
      while (child > 0) {
        const parent = Math.floor((child - 1) / 2)
        if (!this.headBefore(blocks, heap[child], heap[parent])) break
        const temporary = heap[parent]
        heap[parent] = heap[child]
        heap[child] = temporary
        child = parent
      }
    }
    let destination = 0
    while (heap.length) {
      const block = blocks[heap[0]]
      const source = block.next++
      this.output[destination] = this.entries[source]
      this.emit('distribute', 'Append the smallest block head', `Copy key ${this.entries[source].value} from index ${source} to output index ${destination}, then advance this block's head.`, `output[${destination}] = array[${source}]`, { roles: { [source]: 'READ' } }, source, destination)
      destination += 1
      if (block.next === block.end) {
        const last = heap.pop()!
        if (heap.length) heap[0] = last
      }
      this.siftHeads(blocks, heap)
    }
    for (let index = 0; index < length; index += 1) this.entries[index] = this.output[index]!
    this.output = null
    this.emit('merge', 'Copy the merged output back', 'All blocks have been consumed in ascending order. Copy the output into the existing fixed allocation without changing its length or entry IDs.', 'array[:] = output[:]', { sortedPrefix: length })
  }

  private mergePair(start: number, middle: number, end: number, work: ArrayEntry[]): void {
    if (this.entries[middle - 1].value <= this.entries[middle].value) return
    for (let index = start; index < end; index += 1) work[index] = this.entries[index]
    const buffer = this.observer ? work.slice(start, end) : undefined
    let first = start
    let second = middle
    this.emit('buffer', 'Copy adjacent pieces of this block', 'Preserve unread entries in a working buffer while merging back into the block.', `buffer = array[${start}:${end}]`, { buffer, bufferStart: start, writeIndex: start, rangeEnd: end - 1 }, start)
    for (let destination = start; destination < end; destination += 1) {
      if (first < middle && second < end) this.emit('compare', 'Compare buffered block entries', `Compare ${work[first].value} and ${work[second].value}; choose the left entry on equality.`, 'take left if left <= right', { buffer, bufferStart: start, writeIndex: destination, rangeEnd: end - 1, activeBufferIndex: first, otherBufferIndex: second }, first, second)
      const source = second === end || first < middle && work[first].value <= work[second].value ? first++ : second++
      this.entries[destination] = work[source]
      this.emit('write', 'Write a sorted block entry', `Copy key ${work[source].value} to index ${destination}.`, `array[${destination}] = buffer[${source}]`, { buffer, bufferStart: start, writeIndex: destination + 1, rangeEnd: end - 1, activeBufferIndex: source, roles: { [destination]: 'WRITE' } }, destination, source)
    }
    this.emit('merge', 'Block pieces merged', `Indices ${start} through ${end - 1} now form a sorted piece of the current block.`, `merged = [${start}, ${end})`, {}, start, end - 1)
  }

  private headBefore(blocks: readonly SortedBlock[], first: number, second: number): boolean {
    const left = blocks[first]
    const right = blocks[second]
    const a = this.entries[left.next].value
    const b = this.entries[right.next].value
    this.emit('compare', 'Compare block heads', `Compare key ${a} from block ${first} with key ${b} from block ${second}. Equal keys from the earlier original block come first.`, 'compare(head key, original block position)', { roles: { [left.next]: 'HEAD', [right.next]: 'HEAD' } }, left.next, right.next)
    return a < b || a === b && left.start < right.start
  }

  private siftHeads(blocks: readonly SortedBlock[], heap: number[]): void {
    let parent = 0
    while (2 * parent + 1 < heap.length) {
      let child = 2 * parent + 1
      if (child + 1 < heap.length && this.headBefore(blocks, heap[child + 1], heap[child])) child += 1
      if (!this.headBefore(blocks, heap[child], heap[parent])) break
      const temporary = heap[parent]
      heap[parent] = heap[child]
      heap[child] = temporary
      parent = child
    }
  }
}
