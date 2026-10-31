import { Hashing } from '../../../../visualization/Hashing.ts'
import type { HashObserver, HashOperation } from '../../../../visualization/Hashing.ts'

export interface HashEntry {
  readonly id: string
  readonly key: number
  readonly value: number
  readonly bucket: number
}

class HashNode {
  public readonly id: string
  public readonly key: number
  public value: number
  public next: HashNode | null = null

  constructor(id: string, key: number, value: number) {
    this.id = id
    this.key = key
    this.value = value
  }
}

export class HashMap {
  private buckets: (HashNode | null)[] = Array(8).fill(null)
  private count = 0
  private nextId = 0

  public get length(): number { return this.count }
  public get bucketCount(): number { return this.buckets.length }

  public static createDefault(): HashMap {
    const model = new HashMap()
    for (let key = 10; key <= 100; key += 10) model.put(key, key * 10)
    return model
  }

  public getEntries(): HashEntry[] {
    const entries: HashEntry[] = []
    for (let bucket = 0; bucket < this.buckets.length; bucket += 1) {
      let node = this.buckets[bucket]
      while (node) {
        entries.push({ id: node.id, key: node.key, value: node.value, bucket })
        node = node.next
      }
    }
    return entries
  }

  public get(key: number, trace?: HashObserver): HashEntry | null {
    const bucket = Hashing.bucket(key, this.bucketCount)
    trace?.({ type: 'hash', key, bucket })
    let node = this.buckets[bucket]
    let chainIndex = 0
    while (node) {
      trace?.({ type: 'compare', key, bucket, id: node.id })
      if (node.key === key) {
        trace?.({ type: 'result', key, value: node.value, bucket, chainIndex, id: node.id, found: true })
        return { id: node.id, key, value: node.value, bucket }
      }
      node = node.next
      chainIndex += 1
    }
    trace?.({ type: 'result', key, bucket, found: false })
    return null
  }

  public put(key: number, value: number, trace?: HashObserver): void {
    Hashing.validate(value)
    let bucket = Hashing.bucket(key, this.bucketCount)
    trace?.({ type: 'hash', key, bucket })
    let node = this.buckets[bucket]
    while (node) {
      trace?.({ type: 'compare', key, bucket, id: node.id })
      if (node.key === key) {
        node.value = value
        trace?.({ type: 'update', key, value, bucket, id: node.id })
        return
      }
      node = node.next
    }
    if ((this.count + 1) / this.bucketCount > 0.75) {
      this.resize(trace)
      bucket = Hashing.bucket(key, this.bucketCount)
      trace?.({ type: 'hash', key, bucket })
    }
    const inserted = new HashNode(`hash-entry-${this.nextId}`, key, value)
    this.nextId += 1
    inserted.next = this.buckets[bucket]
    this.buckets[bucket] = inserted
    this.count += 1
    trace?.({ type: 'insert', key, value, bucket, id: inserted.id })
  }

  public delete(key: number, trace?: HashObserver): boolean {
    const bucket = Hashing.bucket(key, this.bucketCount)
    trace?.({ type: 'hash', key, bucket })
    let previous: HashNode | null = null
    let node = this.buckets[bucket]
    while (node) {
      trace?.({ type: 'compare', key, bucket, id: node.id })
      if (node.key === key) {
        if (previous) previous.next = node.next
        else this.buckets[bucket] = node.next
        node.next = null
        this.count -= 1
        trace?.({ type: 'remove', key, bucket, id: node.id, found: true })
        return true
      }
      previous = node
      node = node.next
    }
    trace?.({ type: 'result', key, bucket, found: false })
    return false
  }

  public clear(trace?: HashObserver): void {
    for (let bucket = 0; bucket < this.bucketCount; bucket += 1) {
      while (this.buckets[bucket]) {
        const node = this.buckets[bucket]!
        this.buckets[bucket] = node.next
        node.next = null
        this.count -= 1
        trace?.({ type: 'remove', key: node.key, bucket, id: node.id })
      }
    }
    trace?.({ type: 'clear' })
  }

  public apply(operation: HashOperation, key: number, value: number, trace?: HashObserver): void {
    switch (operation) {
      case 'insert':
        this.put(key, value, trace)
        return
      case 'search-value':
        this.get(key, trace)
        return
      case 'delete-value':
        this.delete(key, trace)
        return
      case 'clear':
        this.clear(trace)
    }
  }

  private resize(trace?: HashObserver): void {
    const oldBuckets = this.buckets
    this.buckets = Array(oldBuckets.length * 2).fill(null)
    // Retain the old chains until each node is moved; no entry is lost mid-rehash.
    for (const head of oldBuckets) {
      let node = head
      while (node) {
        const next = node.next
        const bucket = Hashing.bucket(node.key, this.bucketCount)
        node.next = this.buckets[bucket]
        this.buckets[bucket] = node
        node = next
      }
    }
    trace?.({ type: 'resize' })
    if (trace) {
      for (const entry of this.getEntries()) trace({ type: 'rehash', key: entry.key, bucket: entry.bucket, id: entry.id })
    }
  }

  public clone(): HashMap {
    const copy = new HashMap()
    copy.buckets = Array(this.bucketCount).fill(null)
    for (let bucket = 0; bucket < this.bucketCount; bucket += 1) {
      let source = this.buckets[bucket]
      let previous: HashNode | null = null
      while (source) {
        const node = new HashNode(source.id, source.key, source.value)
        if (previous) previous.next = node
        else copy.buckets[bucket] = node
        previous = node
        source = source.next
      }
    }
    copy.count = this.count
    copy.nextId = this.nextId
    return copy
  }
}
