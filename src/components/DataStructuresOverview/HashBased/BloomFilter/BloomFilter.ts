import { Hashing } from '../../../../visualization/Hashing.ts'
import type { HashObserver, HashOperation } from '../../../../visualization/Hashing.ts'

export class BloomFilter {
  public readonly bitCount = 32
  public readonly hashCount = 3
  private bits: number[] = Array(this.bitCount).fill(0)
  private insertions = 0

  // This is the number of add calls, not an exact count of distinct members.
  public get length(): number { return this.insertions }
  public getBits(): readonly number[] { return [...this.bits] }

  public static createDefault(): BloomFilter {
    const model = new BloomFilter()
    for (let value = 10; value <= 100; value += 10) model.add(value)
    return model
  }

  public getIndices(value: number): number[] {
    const indices: number[] = []
    for (let index = 0; index < this.hashCount; index += 1) indices.push(Hashing.bit(value, index, this.bitCount))
    return indices
  }

  public add(value: number, trace?: HashObserver): void {
    for (let hashIndex = 0; hashIndex < this.hashCount; hashIndex += 1) {
      const bucket = Hashing.bit(value, hashIndex, this.bitCount)
      trace?.({ type: 'hash', key: value, bucket, hashIndex })
      this.bits[bucket] = 1
      trace?.({ type: 'bit', key: value, bucket, hashIndex, value: 1 })
    }
    this.insertions += 1
  }

  public mightContain(value: number, trace?: HashObserver): boolean {
    for (let hashIndex = 0; hashIndex < this.hashCount; hashIndex += 1) {
      const bucket = Hashing.bit(value, hashIndex, this.bitCount)
      trace?.({ type: 'hash', key: value, bucket, hashIndex })
      trace?.({ type: 'bit', key: value, bucket, hashIndex, value: this.bits[bucket] })
      if (this.bits[bucket] === 0) {
        trace?.({ type: 'result', key: value, bucket, found: false })
        return false
      }
    }
    trace?.({ type: 'result', key: value, found: true })
    return true
  }

  public clear(trace?: HashObserver): void {
    for (let bucket = 0; bucket < this.bitCount; bucket += 1) {
      this.bits[bucket] = 0
      trace?.({ type: 'bit', bucket, value: 0 })
    }
    this.insertions = 0
    trace?.({ type: 'clear' })
  }

  public apply(operation: HashOperation, key: number, _value: number, trace?: HashObserver): void {
    switch (operation) {
      case 'insert':
        this.add(key, trace)
        return
      case 'search-value':
        this.mightContain(key, trace)
        return
      case 'clear':
        this.clear(trace)
        return
      default: throw new RangeError('A standard Bloom filter cannot delete individual items')
    }
  }

  public clone(): BloomFilter {
    const copy = new BloomFilter()
    copy.bits = [...this.bits]
    copy.insertions = this.insertions
    return copy
  }
}
