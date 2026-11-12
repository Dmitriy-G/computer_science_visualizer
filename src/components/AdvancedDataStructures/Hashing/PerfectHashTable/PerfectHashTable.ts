import { HashTableModel } from '../../../../visualization/HashTableModel.ts'
import type { HashRecord } from '../../../../visualization/HashTableModel.ts'
import { HashTableHash } from '../../../../visualization/HashTableHash.ts'
import { LinearModel } from '../../../../visualization/LinearModel.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'

export interface PerfectBucket {
  readonly seed: number
  readonly slots: readonly (HashRecord | null)[]
}

export interface PerfectBuildView {
  readonly primarySeed: number
  readonly bucketSizes: readonly number[]
  readonly activeBucket: number
  readonly trialSeed: number
  readonly trialSlots: readonly (HashRecord | null)[]
  readonly collisionKey: number | null
  readonly collisionIndex: number | null
}

export class PerfectHashTable extends HashTableModel {
  public readonly kind = 'perfect-hash-table'
  public static readonly maximumTrials = 128
  private buckets: PerfectBucket[] = []
  private seed = 0
  private count = 0
  private work: PerfectBuildView | null = null
  public get length(): number { return this.count }
  public get primarySeed(): number { return this.seed }
  public getBuildView(): PerfectBuildView | null {
    return this.work ? { ...this.work, bucketSizes: [...this.work.bucketSizes], trialSlots: [...this.work.trialSlots] } : null
  }
  public getBuckets(): readonly PerfectBucket[] {
    const buckets: PerfectBucket[] = []
    for (const bucket of this.buckets) buckets.push({ seed: bucket.seed, slots: [...bucket.slots] })
    return buckets
  }
  public static parseKeys(text: string): number[] {
    const parts = text.split(',')
    if (!text.trim() || parts.length > LinearModel.maximumElements) throw new TypeError('Enter 1 to 64 distinct comma-separated safe integers')
    const keys: number[] = []
    const seen = new Set<number>()
    for (const part of parts) {
      const value = Number(part.trim())
      if (!/^-?\d+$/.test(part.trim()) || !Number.isSafeInteger(value) || seen.has(value)) throw new TypeError('Enter 1 to 64 distinct comma-separated safe integers')
      keys.push(value)
      seen.add(value)
    }
    return keys
  }
  public static createDefault(): PerfectHashTable {
    const table = new PerfectHashTable()
    table.build([10, 20, 30, 40, 50, 60, 70, 80, 90, 100])
    return table
  }
  public clone(): PerfectHashTable {
    const copy = new PerfectHashTable()
    for (const bucket of this.buckets) copy.buckets.push({ seed: bucket.seed, slots: [...bucket.slots] })
    copy.seed = this.seed
    copy.count = this.count
    copy.nextId = this.nextId
    copy.work = this.getBuildView()
    return copy
  }
  public getRecords(): HashRecord[] {
    const records: HashRecord[] = []
    for (const bucket of this.buckets) for (const record of bucket.slots) if (record) records.push(record)
    return records
  }
  private build(keys: readonly number[], observer?: LinearObserver): LinearResult {
    const records: HashRecord[] = []
    for (let index = 0; index < keys.length; index += 1) records.push({ id: `${this.kind}-entry-${this.nextId + index}`, key: keys[index], value: keys[index] })
    for (let primary = 1; primary <= PerfectHashTable.maximumTrials; primary += 1) {
      const groups: HashRecord[][] = []
      for (let index = 0; index < keys.length; index += 1) groups.push([])
      for (const record of records) groups[HashTableHash.index(record.key, primary, keys.length)].push(record)
      let cells = 0
      const sizes: number[] = []
      for (const group of groups) {
        cells += group.length ** 2
        sizes.push(group.length)
      }
      this.work = { primarySeed: primary, bucketSizes: sizes, activeBucket: -1, trialSeed: 0, trialSlots: [], collisionKey: null, collisionIndex: null }
      LinearModel.emit(observer, null, `Try primary seed ${primary}; sum of squared bucket sizes is ${cells}, budget ${4 * keys.length}.`, 'accept primary hash only when sum(bucketSize²) <= 4n', 'TRY PRIMARY')
      if (cells > 4 * keys.length) continue
      const candidate: PerfectBucket[] = []
      let complete = true
      for (let bucket = 0; bucket < groups.length; bucket += 1) {
        const group = groups[bucket]
        if (!group.length) {
          candidate.push({ seed: 0, slots: [] })
          continue
        }
        let secondary: PerfectBucket | null = null
        for (let trial = 1; trial <= PerfectHashTable.maximumTrials; trial += 1) {
          const seed = 1000 + primary * 257 + bucket * 131 + trial
          const slots = new Array<HashRecord | null>(group.length ** 2).fill(null)
          let collision = false
          let collisionKey: number | null = null
          let collisionIndex: number | null = null
          for (const record of group) {
            const index = HashTableHash.index(record.key, seed, slots.length)
            if (slots[index]) {
              collision = true
              collisionKey = record.key
              collisionIndex = index
              break
            }
            slots[index] = record
          }
          this.work = { primarySeed: primary, bucketSizes: sizes, activeBucket: bucket, trialSeed: seed, trialSlots: slots, collisionKey, collisionIndex }
          LinearModel.emit(observer, `${this.kind}-candidate-bucket-${bucket}`, `Try secondary seed ${seed} for bucket ${bucket} with ${group.length ** 2} cells: ${collision ? `key ${collisionKey} collides at slot ${collisionIndex}; retry` : 'collision-free'}.`, 'allocate s² slots; reject colliding secondary seeds', collision ? 'RETRY' : 'PERFECT')
          if (!collision) {
            secondary = { seed, slots }
            break
          }
        }
        if (!secondary) {
          complete = false
          break
        }
        candidate.push(secondary)
      }
      if (!complete) continue
      this.buckets = candidate
      this.seed = primary
      this.count = keys.length
      this.nextId += keys.length
      this.work = null
      LinearModel.emit(observer, null, `Publish the static key set: ${keys.length} keys, ${cells} collision-free secondary cells.`, 'commit fully constructed FKS tables', 'BUILT')
      return { description: `Built a static perfect hash set for ${keys.length} keys using ${cells} secondary cells. Lookup still compares the stored key to reject nonmembers.` }
    }
    this.work = null
    LinearModel.emit(observer, null, 'Discard unsuccessful candidate allocations; retain the previous perfect table.', 'reject candidate; preserve original tables', 'REJECTED')
    return { description: 'Rejected: the bounded deterministic hash-family search was exhausted. The previous perfect table and its ID counter are unchanged.', status: 'REJECTED' }
  }
  public execute(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    if (action === 'build-values') {
      if (typeof input.keys !== 'string') throw new TypeError('Enter comma-separated keys')
      return this.build(PerfectHashTable.parseKeys(input.keys), observer)
    }
    if (action === 'search-value') {
      const key = LinearModel.integer(input, 'key')
      const record = this.find(key, observer)
      return { description: record ? `Key ${key} is a member of the static set at ${this.lastLocation}.` : `Key ${key} is absent from the static set.`,
        value: !!record, activeId: record?.id, status: record ? 'FOUND' : 'ABSENT' }
    }
    return super.execute(action, input, observer)
  }
  protected find(key: number, observer?: LinearObserver): HashRecord | null {
    if (!this.count) return null
    const primary = HashTableHash.index(key, this.seed, this.count)
    const bucket = this.buckets[primary]
    LinearModel.emit(observer, `${this.kind}-bucket-${primary}`, `Select primary bucket ${primary}.`, 'bucket = primary[hash1(key)]', 'PRIMARY')
    if (!bucket.slots.length) return null
    const index = HashTableHash.index(key, bucket.seed, bucket.slots.length)
    this.lastLocation = `primary bucket ${primary}, secondary slot ${index}`
    LinearModel.emit(observer, `${this.kind}-slot-${primary}-${index}`, `Read secondary slot ${index} and compare the full key.`, 'record = secondary[hash2(key)]; require record.key == key', 'SECONDARY')
    return bucket.slots[index]?.key === key ? bucket.slots[index] : null
  }
  protected put(): LinearResult { return { description: 'This is a static perfect hash set. Build a complete key set instead of inserting one key.', status: 'REJECTED' } }
  protected remove(): LinearResult { return { description: 'This is a static perfect hash set. Rebuild the key set to remove a key.', status: 'REJECTED' } }
  protected clear(observer?: LinearObserver): void {
    this.buckets = []
    this.count = 0
    this.seed = 0
    this.work = null
    LinearModel.emit(observer, null, 'Discard both levels of the static perfect table.', 'primary = []; secondary = []', 'CLEARED')
  }
}
