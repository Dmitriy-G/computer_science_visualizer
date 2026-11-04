import { HashTableModel } from '../../../../visualization/HashTableModel.ts'
import type { HashRecord } from '../../../../visualization/HashTableModel.ts'
import { HashTableHash } from '../../../../visualization/HashTableHash.ts'
import { LinearModel } from '../../../../visualization/LinearModel.ts'
import type { LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'

export interface ExtendibleBucketView {
  readonly id: string
  readonly depth: number
  readonly records: readonly HashRecord[]
}

class ExtendibleBucket {
  public readonly id: string
  public depth: number
  public records: HashRecord[] = []
  constructor(id: string, depth: number) {
    this.id = id
    this.depth = depth
  }
}

export class ExtendibleHashing extends HashTableModel {
  public readonly kind = 'extendible-hashing'
  public static readonly bucketCapacity = 3
  public static readonly maximumDepth = 8
  private directory: ExtendibleBucket[] = [new ExtendibleBucket('extendible-bucket-0', 0)]
  private depth = 0
  private nextBucketId = 1
  private count = 0
  public get length(): number { return this.count }
  public get globalDepth(): number { return this.depth }
  public getDirectory(): readonly string[] {
    const ids: string[] = []
    for (const bucket of this.directory) ids.push(bucket.id)
    return ids
  }
  public getBuckets(): readonly ExtendibleBucketView[] {
    const result: ExtendibleBucketView[] = []
    const seen = new Set<string>()
    for (const bucket of this.directory) {
      if (seen.has(bucket.id)) continue
      seen.add(bucket.id)
      result.push({ id: bucket.id, depth: bucket.depth, records: [...bucket.records] })
    }
    return result
  }
  public address(key: number): number { return HashTableHash.index(key, 11, 2 ** this.depth) }
  public static createDefault(): ExtendibleHashing {
    const table = new ExtendibleHashing()
    for (let key = 10; key <= 100; key += 10) table.put(key, key * 10)
    return table
  }
  public clone(): ExtendibleHashing {
    const copy = new ExtendibleHashing()
    const buckets = new Map<string, ExtendibleBucket>()
    copy.directory = []
    for (const bucket of this.directory) {
      let target = buckets.get(bucket.id)
      if (!target) {
        target = new ExtendibleBucket(bucket.id, bucket.depth)
        target.records = [...bucket.records]
        buckets.set(bucket.id, target)
      }
      copy.directory.push(target)
    }
    copy.depth = this.depth
    copy.count = this.count
    copy.nextId = this.nextId
    copy.nextBucketId = this.nextBucketId
    return copy
  }
  public getRecords(): HashRecord[] {
    const records: HashRecord[] = []
    for (const bucket of this.getBuckets()) records.push(...bucket.records)
    return records
  }
  protected find(key: number, observer?: LinearObserver): HashRecord | null {
    const address = this.address(key)
    const bucket = this.directory[address]
    LinearModel.emit(observer, `${this.kind}-directory-${address}`, `Use ${this.depth} low hash bits to select directory entry ${address}.`, 'bucket = directory[hash(key) mod 2^globalDepth]', 'DIRECTORY')
    for (const record of bucket.records) {
      LinearModel.emit(observer, record.id, `Compare within ${bucket.id}, local depth ${bucket.depth}.`, 'scan records in selected bucket', 'COMPARE')
      if (record.key === key) {
        this.lastLocation = `directory entry ${address}, bucket B${bucket.id.split('-').at(-1)}, record slot ${bucket.records.indexOf(record)}`
        return record
      }
    }
    return null
  }
  private split(bucket: ExtendibleBucket, observer?: LinearObserver): void {
    const bit = 2 ** bucket.depth
    if (bucket.depth === this.depth) {
      this.directory = [...this.directory, ...this.directory]
      this.depth += 1
      LinearModel.emit(observer, bucket.id, `Double the directory; global depth is now ${this.depth}. Existing entries still alias their original buckets.`, 'directory = directory + directory; globalDepth += 1', 'DOUBLE')
    }
    const sibling = new ExtendibleBucket(`extendible-bucket-${this.nextBucketId++}`, bucket.depth + 1)
    bucket.depth += 1
    for (let index = 0; index < this.directory.length; index += 1) {
      if (this.directory[index] === bucket && (index & bit)) this.directory[index] = sibling
    }
    const records = bucket.records
    bucket.records = []
    for (const record of records) this.directory[this.address(record.key)].records.push(record)
    LinearModel.emit(observer, sibling.id, 'Split only this full bucket, redirect matching directory aliases, and redistribute its records.', 'split on next local hash bit; localDepth += 1', 'SPLIT')
  }
  protected put(key: number, value: number, observer?: LinearObserver): LinearResult {
    const existing = this.find(key, observer)
    if (existing) {
      const bucket = this.directory[this.address(key)]
      bucket.records[bucket.records.indexOf(existing)] = { ...existing, value }
      LinearModel.emit(observer, existing.id, 'Update the existing record without changing directory depths.', 'record.value = value', 'UPDATED')
      return { description: `Updated ${key} in ${bucket.id}.`, activeId: existing.id }
    }
    const full = this.full()
    if (full) return full
    const backup = this.directory[this.address(key)].records.length === ExtendibleHashing.bucketCapacity ? this.clone() : null
    while (this.directory[this.address(key)].records.length >= ExtendibleHashing.bucketCapacity) {
      const bucket = this.directory[this.address(key)]
      if (bucket.depth === ExtendibleHashing.maximumDepth) {
        if (backup) {
          this.directory = backup.directory
          this.depth = backup.depth
          this.nextBucketId = backup.nextBucketId
        }
        LinearModel.emit(observer, null, 'The eight-bit directory limit was reached; restore all original bucket aliases and depths.', 'rollback failed split sequence', 'REJECTED')
        return { description: 'Rejected: this key would require more than eight directory bits. Original entries, buckets, directory, and IDs are unchanged.', status: 'REJECTED' }
      }
      this.split(bucket, observer)
    }
    const record = this.pending(key, value)
    const bucket = this.directory[this.address(key)]
    bucket.records.push(record)
    this.count += 1
    this.nextId += 1
    LinearModel.emit(observer, record.id, `Insert into ${bucket.id}, which now has room.`, 'bucket.records.push(record)', 'NEW')
    return { description: `Inserted ${key}; global depth ${this.depth}, bucket local depth ${bucket.depth}.`, activeId: record.id }
  }
  protected remove(key: number, observer?: LinearObserver): LinearResult {
    const record = this.find(key, observer)
    if (!record) return { description: `Key ${key} is absent.` }
    const bucket = this.directory[this.address(key)]
    bucket.records.splice(bucket.records.indexOf(record), 1)
    this.count -= 1
    LinearModel.emit(observer, bucket.id, 'Remove the record; this teaching variant keeps the directory and does not coalesce buckets.', 'bucket.records.remove(key)', 'REMOVED')
    return { description: `Deleted ${key}; directory aliases and depths are retained.` }
  }
  protected clear(observer?: LinearObserver): void {
    this.directory = [new ExtendibleBucket(`extendible-bucket-${this.nextBucketId++}`, 0)]
    this.depth = 0
    this.count = 0
    LinearModel.emit(observer, this.directory[0].id, 'Drop the directory and buckets; create one empty depth-zero bucket.', 'directory = [emptyBucket]; globalDepth = 0', 'CLEARED')
  }
}
