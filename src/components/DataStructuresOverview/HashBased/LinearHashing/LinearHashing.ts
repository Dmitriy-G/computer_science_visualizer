import { HashTableModel } from '../HashTableModel.ts'
import type { HashRecord } from '../HashTableModel.ts'
import { HashTableHash } from '../../../../visualization/HashTableHash.ts'
import { LinearModel } from '../../../../visualization/LinearModel.ts'
import type { LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'

class LinearHashPage {
  public readonly id: string
  public records: HashRecord[] = []
  public next: LinearHashPage | null = null
  constructor(id: string) { this.id = id }
}

export interface LinearHashPageView {
  readonly id: string
  readonly records: readonly HashRecord[]
  readonly nextId: string | null
  readonly bucket: number
  readonly overflow: boolean
}

export class LinearHashing extends HashTableModel {
  public readonly kind = 'linear-hashing'
  public static readonly pageCapacity = 3
  private buckets: LinearHashPage[] = []
  private level = 0
  private pointer = 0
  private count = 0
  private nextPage = 0
  constructor() {
    super()
    for (let index = 0; index < 4; index += 1) this.buckets.push(this.allocate())
  }
  public get length(): number { return this.count }
  public get splitPointer(): number { return this.pointer }
  public get roundBase(): number { return 4 * 2 ** this.level }
  public get bucketCount(): number { return this.buckets.length }
  private allocate(): LinearHashPage { return new LinearHashPage(`linear-hash-page-${this.nextPage++}`) }
  public address(key: number): number {
    let bucket = HashTableHash.index(key, 17, this.roundBase)
    if (bucket < this.pointer) bucket = HashTableHash.index(key, 17, this.roundBase * 2)
    return bucket
  }
  public static createDefault(): LinearHashing {
    const table = new LinearHashing()
    for (let key = 10; key <= 100; key += 10) table.put(key, key * 10)
    return table
  }
  public clone(): LinearHashing {
    const copy = new LinearHashing()
    const visit = (page: LinearHashPage): LinearHashPage => {
      const target = new LinearHashPage(page.id)
      target.records = [...page.records]
      target.next = page.next ? visit(page.next) : null
      return target
    }
    copy.buckets = []
    for (const page of this.buckets) copy.buckets.push(visit(page))
    copy.level = this.level
    copy.pointer = this.pointer
    copy.count = this.count
    copy.nextId = this.nextId
    copy.nextPage = this.nextPage
    return copy
  }
  public getPages(): readonly LinearHashPageView[] {
    const pages: LinearHashPageView[] = []
    for (let bucket = 0; bucket < this.buckets.length; bucket += 1) {
      let page: LinearHashPage | null = this.buckets[bucket]
      let overflow = false
      while (page) {
        pages.push({ id: page.id, records: [...page.records], nextId: page.next?.id ?? null, bucket, overflow })
        page = page.next
        overflow = true
      }
    }
    return pages
  }
  public getRecords(): HashRecord[] {
    const records: HashRecord[] = []
    for (const page of this.getPages()) records.push(...page.records)
    return records
  }
  protected find(key: number, observer?: LinearObserver): HashRecord | null {
    const bucket = this.address(key)
    let page: LinearHashPage | null = this.buckets[bucket]
    let pageIndex = 0
    LinearModel.emit(observer, page.id, `Use modulus ${this.roundBase}${HashTableHash.index(key, 17, this.roundBase) < this.pointer ? `, then ${2 * this.roundBase} because this bucket has split` : ''}.`, 'bucket = h_level(key); if bucket < split: use h_next(key)', 'BUCKET')
    while (page) {
      for (const record of page.records) {
        LinearModel.emit(observer, record.id, 'Compare records in this primary or overflow page.', 'scan page; follow overflow link if needed', 'COMPARE')
        if (record.key === key) {
          this.lastLocation = `bucket ${bucket}, ${pageIndex ? `overflow page ${pageIndex}` : 'primary page'}, record slot ${page.records.indexOf(record)}`
          return record
        }
      }
      page = page.next
      pageIndex += 1
    }
    return null
  }
  private append(page: LinearHashPage, record: HashRecord): LinearHashPage {
    while (page.records.length >= LinearHashing.pageCapacity) {
      page.next ??= this.allocate()
      page = page.next
    }
    page.records.push(record)
    return page
  }
  private split(observer?: LinearObserver): void {
    const index = this.pointer
    const source = this.buckets[index]
    const records: HashRecord[] = []
    let page: LinearHashPage | null = source
    while (page) {
      records.push(...page.records)
      page = page.next
    }
    source.records = []
    source.next = null
    const newBucket = this.allocate()
    this.buckets.push(newBucket)
    let originalTail = source
    let newTail = newBucket
    for (const record of records) {
      const destination = HashTableHash.index(record.key, 17, this.roundBase * 2)
      if (destination === index) originalTail = this.append(originalTail, record)
      else newTail = this.append(newTail, record)
    }
    this.pointer += 1
    if (this.pointer === this.roundBase) {
      this.pointer = 0
      this.level += 1
    }
    LinearModel.emit(observer, source.id, `Split bucket ${index}; the next split pointer is ${this.pointer}, round base ${this.roundBase}.`, 'split pointed bucket with next modulus; advance split pointer', 'SPLIT')
  }
  protected put(key: number, value: number, observer?: LinearObserver): LinearResult {
    const existing = this.find(key, observer)
    if (existing) {
      let page: LinearHashPage | null = this.buckets[this.address(key)]
      while (page && !page.records.includes(existing)) page = page.next
      page!.records[page!.records.indexOf(existing)] = { ...existing, value }
      LinearModel.emit(observer, existing.id, 'Update the existing key in its primary or overflow page.', 'record.value = value', 'UPDATED')
      return { description: `Updated ${key}.`, activeId: existing.id }
    }
    const full = this.full()
    if (full) return full
    const record = this.pending(key, value)
    this.append(this.buckets[this.address(key)], record)
    this.count += 1
    this.nextId += 1
    LinearModel.emit(observer, record.id, 'Append to the selected bucket, allocating an overflow page only when needed.', 'append record to bucket pages', 'NEW')
    if (this.count > this.buckets.length * LinearHashing.pageCapacity * 0.75) this.split(observer)
    return { description: `Inserted ${key}; ${this.buckets.length} primary buckets, next split ${this.pointer}.`, activeId: record.id }
  }
  protected remove(key: number, observer?: LinearObserver): LinearResult {
    const record = this.find(key, observer)
    if (!record) return { description: `Key ${key} is absent.` }
    let page = this.buckets[this.address(key)]
    let previous: LinearHashPage | null = null
    while (!page.records.includes(record)) {
      previous = page
      page = page.next!
    }
    page.records.splice(page.records.indexOf(record), 1)
    if (previous && !page.records.length) previous.next = page.next
    this.count -= 1
    LinearModel.emit(observer, this.buckets[this.address(key)].id, 'Remove the record and unlink an empty overflow page; do not reverse split rounds.', 'remove record; unlink empty overflow page', 'REMOVED')
    return { description: `Deleted ${key}; bucket count and split progress are retained.` }
  }
  protected clear(observer?: LinearObserver): void {
    this.buckets = []
    for (let index = 0; index < 4; index += 1) this.buckets.push(this.allocate())
    this.level = 0
    this.pointer = 0
    this.count = 0
    LinearModel.emit(observer, this.buckets[0].id, 'Discard all pages and restart with four empty primary buckets.', 'level = 0; split = 0; buckets = four empty pages', 'CLEARED')
  }
}
