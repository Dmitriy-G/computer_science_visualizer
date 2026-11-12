import { ArraySortOperations } from './ArraySortOperations.ts'

class WikiRange {
  public start: number
  public end: number

  constructor(start = 0, end = 0) {
    this.start = start
    this.end = end
  }

  public get length(): number { return this.end - this.start }
}

class WikiPull {
  public readonly pair: WikiRange
  public readonly left: boolean
  public readonly count: number
  public from: number

  constructor(pair: WikiRange, left: boolean, count: number, from: number) {
    this.pair = pair
    this.left = left
    this.count = count
    this.from = from
  }

  public get buffer(): WikiRange {
    return this.left ? new WikiRange(this.pair.start, this.pair.start + this.count) : new WikiRange(this.pair.end - this.count, this.pair.end)
  }
}

export class WikiArraySort extends ArraySortOperations {
  public sort(): void {
    const length = this.entries.length
    if (length < 2) return
    let ordered = true
    for (let index = 1; index < length; index += 1) {
      if (this.compare(index - 1, index) > 0) { ordered = false; break }
    }
    if (ordered) return
    let runs = 1
    while (runs * 8 <= length) runs *= 2
    for (let run = 0; run < runs; run += 1) {
      const start = Math.floor(length * run / runs)
      const end = Math.floor(length * (run + 1) / runs)
      this.emit('run', 'Sort a small base run', `Stably sort indices ${start} through ${end - 1} before bottom-up block merging.`, `insertionSort(${start}, ${end})`, { roles: { [start]: 'RUN', [end - 1]: 'RUN' } }, start)
      this.insertion(start, end)
    }
    while (runs > 1) {
      const width = Math.floor(length / runs)
      this.mergeLevel(runs, width)
      runs /= 2
    }
  }

  private insertion(start: number, end: number): void {
    for (let index = start + 1; index < end; index += 1) {
      for (let position = index; position > start && this.compare(position, position - 1) < 0; position -= 1) this.swap(position, position - 1)
    }
  }

  private bound(value: number, start: number, end: number, upper = false): number {
    while (start < end) {
      const middle = start + Math.floor((end - start) / 2)
      this.emit('compare', 'Locate a stable boundary', `Compare key ${this.entries[middle].value} with ${value}; ${upper ? 'skip equal keys' : 'stop before equal keys'} to preserve their order.`, `${upper ? 'upper' : 'lower'}Bound(${value})`, { roles: { [middle]: 'BOUNDARY' } }, middle)
      if (this.entries[middle].value < value || upper && this.entries[middle].value === value) start = middle + 1
      else end = middle
    }
    return start
  }

  private reverse(start: number, end: number): void {
    while (start < --end) {
      const temporary = this.entries[start]
      this.entries[start++] = this.entries[end]
      this.entries[end] = temporary
    }
  }

  private rotate(start: number, middle: number, end: number): void {
    if (start === middle || middle === end) return
    this.reverse(start, middle)
    this.reverse(middle, end)
    this.reverse(start, end)
    this.emit('swap', 'Rotate adjacent ranges', `Move [${middle}, ${end}) before [${start}, ${middle}), preserving the order within both ranges.`, `rotate(${start}, ${middle}, ${end})`, { roles: { [start]: 'ROTATE', [end - 1]: 'ROTATE' } }, start, end - 1)
  }

  private blockSwap(first: number, second: number, length: number): void {
    if (first === second || length === 0) return
    for (let offset = 0; offset < length; offset += 1) {
      const temporary = this.entries[first + offset]
      this.entries[first + offset] = this.entries[second + offset]
      this.entries[second + offset] = temporary
    }
    this.emit('block', 'Exchange whole blocks', `Exchange ${length} entries at indices ${first} and ${second} without changing either block's internal order.`, `blockSwap(${first}, ${second}, ${length})`, { roles: { [first]: 'BLOCK', [second]: 'BLOCK' } }, first, second)
  }

  private findPull(a: WikiRange, b: WikiRange, left: boolean, wanted: number): WikiPull {
    const start = left ? a.start : b.start
    const end = left ? a.end : b.end
    let from = left ? start : end - 1
    let count = 1
    while (count < wanted) {
      const next = left ? this.bound(this.entries[from].value, from + 1, end, true) : this.bound(this.entries[from].value, start, from) - 1
      if (next < start || next >= end) break
      from = next
      count += 1
    }
    return new WikiPull(new WikiRange(a.start, b.end), left, count, from)
  }

  private extract(pull: WikiPull): void {
    let index = pull.from + (pull.left ? 0 : 1)
    for (let count = 1; count < pull.count; count += 1) {
      if (pull.left) {
        index = this.bound(this.entries[index - 1].value, pull.pair.start, pull.from - (count - 1))
        this.rotate(index + 1, pull.from + 1 - count, pull.from + 1)
        pull.from = index + count
      } else {
        index = this.bound(this.entries[index].value, index, pull.pair.end, true)
        this.rotate(pull.from, pull.from + count, index - 1)
        pull.from = index - 1 - count
      }
    }
    this.emit('buffer', 'Extract unique internal buffer keys', `Borrow ${pull.count} distinct entries at the ${pull.left ? 'start' : 'end'} of this pair. They remain inside the fixed array.`, `internalBuffer = [${pull.buffer.start}, ${pull.buffer.end})`, { roles: { [pull.buffer.start]: 'INTERNAL BUFFER', [pull.buffer.end - 1]: 'INTERNAL BUFFER' } }, pull.buffer.start)
  }

  private mergeLevel(runs: number, width: number): void {
    const initialBlock = Math.floor(Math.sqrt(width))
    const wanted = Math.floor(width / initialBlock) + 1
    let first: WikiPull | null = null
    let second: WikiPull | null = null
    let fallback: WikiPull | null = null
    let split = false
    for (let run = 0; run < runs && !second; run += 2) {
      const a = new WikiRange(Math.floor(this.entries.length * run / runs), Math.floor(this.entries.length * (run + 1) / runs))
      const b = new WikiRange(a.end, Math.floor(this.entries.length * (run + 2) / runs))
      for (const left of [true, false]) {
        const candidate = this.findPull(a, b, left, first ? wanted : 2 * wanted)
        if (!first && (!fallback || candidate.count > fallback.count)) fallback = candidate
        if (candidate.count < wanted) continue
        if (!first) {
          first = candidate
          if (candidate.count === 2 * wanted) { split = true; break }
        } else { second = candidate; break }
      }
      if (split) break
    }
    first ??= fallback!
    this.extract(first)
    if (second) this.extract(second)
    const tags = first.buffer
    let work = second?.buffer ?? new WikiRange()
    if (split) {
      work = new WikiRange(tags.start + wanted, tags.end)
      tags.end = work.start
    }
    const blockSize = Math.floor(width / tags.length) + 1
    this.emit('stage', 'Tag and roll the merge blocks', `Use ${tags.length} distinct tags and blocks of ${blockSize} entries. ${work.length ? 'A second internal buffer holds local merge data.' : 'With too few distinct keys for a second buffer, merge local pieces by stable rotations.'}`, `blockSize = ${blockSize}; tagCount = ${tags.length}`)
    for (let run = 0; run < runs; run += 2) {
      const pairStart = Math.floor(this.entries.length * run / runs)
      const a = new WikiRange(pairStart, Math.floor(this.entries.length * (run + 1) / runs))
      const b = new WikiRange(a.end, Math.floor(this.entries.length * (run + 2) / runs))
      for (const pull of [first, second]) {
        if (!pull || pull.pair.start !== pairStart) continue
        if (pull.left) a.start += pull.count
        else b.end -= pull.count
      }
      if (!a.length || !b.length) continue
      if (this.compare(b.end - 1, a.start) < 0) this.rotate(a.start, a.end, b.end)
      else if (this.compare(b.start, a.end - 1) < 0) this.roll(a, b, tags, work, blockSize)
    }
    this.insertion(work.start, work.end)
    if (second && first.left && !second.left && first.pair.start === second.pair.start) first.pair.end -= second.count
    this.redistribute(first)
    if (second) this.redistribute(second)
    this.emit('merge', 'Merge level complete', 'Return every borrowed buffer entry to stable sorted order before doubling the run size.', 'restore internal buffers; double run size')
  }

  private localMerge(a: WikiRange, b: WikiRange, work: WikiRange): void {
    if (work.length) {
      let first = 0
      let next = b.start
      let destination = a.start
      while (first < a.length && next < b.end) {
        if (this.compare(work.start + first, next) <= 0) this.swap(destination++, work.start + first++)
        else this.swap(destination++, next++)
      }
      this.blockSwap(work.start + first, destination, a.length - first)
    } else this.inPlaceMerge(a.start, a.end, b.end)
  }

  private save(a: WikiRange, work: WikiRange): void {
    if (work.length) this.blockSwap(a.start, work.start, a.length)
  }

  private roll(a: WikiRange, b: WikiRange, tags: WikiRange, work: WikiRange, size: number): void {
    const blocks = new WikiRange(a.start, a.end)
    let lastA = new WikiRange(a.start, a.start + a.length % size)
    let lastB = new WikiRange()
    const nextB = new WikiRange(b.start, Math.min(b.end, b.start + size))
    blocks.start = lastA.end
    let tag = tags.start
    for (let index = blocks.start; index < blocks.end; index += size) this.swap(tag++, index)
    tag = tags.start
    this.save(lastA, work)
    while (blocks.length) {
      if (!nextB.length || lastB.length > 0 && this.compare(lastB.end - 1, tag) >= 0) {
        const split = this.bound(this.entries[tag].value, lastB.start, lastB.end)
        const remaining = lastB.end - split
        let minimum = blocks.start
        for (let index = minimum + size; index < blocks.end; index += size) {
          if (this.compare(index, minimum) < 0) minimum = index
        }
        this.blockSwap(blocks.start, minimum, size)
        this.swap(blocks.start, tag++)
        this.localMerge(lastA, new WikiRange(lastA.end, split), work)
        if (work.length) {
          this.save(new WikiRange(blocks.start, blocks.start + size), work)
          this.blockSwap(split, blocks.start + size - remaining, remaining)
        } else this.rotate(split, blocks.start, blocks.start + size)
        lastA = new WikiRange(blocks.start - remaining, blocks.start - remaining + size)
        lastB = new WikiRange(lastA.end, lastA.end + remaining)
        blocks.start += size
      } else if (nextB.length < size) {
        const amount = nextB.length
        this.rotate(blocks.start, nextB.start, nextB.end)
        lastB = new WikiRange(blocks.start, blocks.start + amount)
        blocks.start += amount
        blocks.end += amount
        nextB.end = nextB.start
      } else {
        this.blockSwap(blocks.start, nextB.start, size)
        lastB = new WikiRange(blocks.start, blocks.start + size)
        blocks.start += size
        blocks.end += size
        nextB.start += size
        nextB.end = Math.min(b.end, nextB.end + size)
      }
    }
    this.localMerge(lastA, new WikiRange(lastA.end, b.end), work)
  }

  private inPlaceMerge(start: number, middle: number, end: number): void {
    while (start < middle && middle < end) {
      const split = this.bound(this.entries[start].value, middle, end)
      const amount = split - middle
      this.rotate(start, middle, split)
      if (split === end) break
      start += amount
      middle = split
      start = this.bound(this.entries[start].value, start, middle, true)
    }
  }

  private redistribute(pull: WikiPull): void {
    const buffer = pull.buffer
    while (buffer.length) {
      if (pull.left) {
        const index = this.bound(this.entries[buffer.start].value, buffer.end, pull.pair.end)
        const amount = index - buffer.end
        this.rotate(buffer.start, buffer.end, index)
        buffer.start += amount + 1
        buffer.end += amount
      } else {
        const index = this.bound(this.entries[buffer.end - 1].value, pull.pair.start, buffer.start, true)
        const amount = buffer.start - index
        this.rotate(index, buffer.start, buffer.end)
        buffer.start -= amount
        buffer.end -= amount + 1
      }
    }
  }
}
