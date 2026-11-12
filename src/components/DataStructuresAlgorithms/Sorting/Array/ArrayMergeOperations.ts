import { ArraySortOperations } from './ArraySortOperations.ts'
import type { ArrayEntry } from '../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import type { ArraySortEvent, ArraySortFrame } from './ArraySortTrace.ts'

export class ArrayMergeOperations extends ArraySortOperations {
  private buffer: ArrayEntry[] | null = null

  protected context(): ArraySortFrame { return {} }

  protected trace(kind: ArraySortEvent['kind'], label: string, detail: string, code: string, frame: ArraySortFrame = {}, index = 0, other?: number): void {
    if (!this.observer) return
    this.emit(kind, label, detail, code, { ...this.context(), ...frame }, index, other)
  }

  protected mergeRange(start: number, middle: number, end: number): void {
    this.buffer ??= new Array<ArrayEntry>(this.entries.length)
    const buffer = this.buffer
    for (let index = start; index < end; index += 1) buffer[index] = this.entries[index]
    const snapshot = this.observer ? buffer.slice(start, end) : undefined
    const frame = { buffer: snapshot, bufferStart: start, rangeEnd: end - 1 }
    this.trace('buffer', 'Preserve the two input runs', `Copy [${start}, ${middle}) and [${middle}, ${end}) into shared working storage so unread entries survive output writes.`, 'buffer = left run + right run', { ...frame, writeIndex: start }, start)
    let first = start
    let second = middle
    for (let destination = start; destination < end; destination += 1) {
      if (first < middle && second < end) this.trace('compare', 'Compare the two merge heads', `Compare buffered keys ${buffer[first].value} and ${buffer[second].value}. The left run wins equal-key ties.`, 'take left if left <= right', { ...frame, writeIndex: destination, activeBufferIndex: first, otherBufferIndex: second }, first, second)
      const source = second === end || first < middle && buffer[first].value <= buffer[second].value ? first++ : second++
      this.entries[destination] = buffer[source]
      this.trace('write', 'Write the next merged entry', `Write key ${buffer[source].value} to slot ${destination}; unread output slots remain empty in the diagram.`, `array[${destination}] = buffer[${source}]`, { ...frame, writeIndex: destination + 1, activeBufferIndex: source, roles: { [destination]: 'WRITE' } }, destination, source)
    }
    this.trace('merge', 'Adjacent runs merged', `The range [${start}, ${end}) is sorted, preserving ties across the two original runs.`, 'finish stable merge', {}, start, end - 1)
  }
}
