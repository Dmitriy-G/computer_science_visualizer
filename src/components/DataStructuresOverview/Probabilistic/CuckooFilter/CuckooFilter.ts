import { ProbabilisticModel } from '../ProbabilisticModel.ts'
import { ProbabilisticHash } from '../../../../visualization/ProbabilisticHash.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'

export class CuckooFilter extends ProbabilisticModel {
  public readonly kind = 'cuckoo-filter' as const
  private buckets: (number | null)[][] = Array.from({ length: 8 }, () => [null, null])
  // Extra exact-key ledger guards deletions, never membership queries.
  private occurrences = new Map<number, number>()

  public static createDefault(): CuckooFilter {
    const model = new CuckooFilter()
    for (let value = 10; value <= 100; value += 10) model.execute('insert', { value })
    return model
  }

  public getBuckets(): readonly (readonly (number | null)[])[] { return this.buckets.map((bucket) => [...bucket]) }
  public fingerprint(value: number): number { return Number(ProbabilisticHash.hash(value, 1) % 255n) + 1 }
  public alternate(bucket: number, fingerprint: number): number { return bucket ^ (ProbabilisticHash.index(fingerprint, 2, 7) + 1) }
  public candidates(value: number): readonly number[] {
    const home = ProbabilisticHash.index(value, 0, 8)
    return [home, this.alternate(home, this.fingerprint(value))]
  }

  public clone(): CuckooFilter {
    const copy = new CuckooFilter()
    copy.count = this.count
    copy.buckets = this.buckets.map((bucket) => [...bucket])
    copy.occurrences = new Map(this.occurrences)
    return copy
  }

  public execute(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    if (action === 'clear') {
      for (let bucket = 0; bucket < 8; bucket += 1) {
        this.buckets[bucket] = [null, null]
        CuckooFilter.emit(observer, `bucket-${bucket}-0`, `Empty bucket ${bucket}.`, 'bucket[i] = [empty, empty]')
      }
      this.count = 0
      this.occurrences.clear()
      return { description: 'All fingerprint buckets and the deletion guard are empty.' }
    }
    const value = CuckooFilter.integer(input, 'value')
    const fingerprint = this.fingerprint(value)
    const candidates = this.candidates(value)
    if (action === 'search-value' || action === 'delete-value') {
      if (action === 'delete-value' && !this.occurrences.has(value)) return this.rejected('Deletion requires a recorded insertion, even when its fingerprint appears present.')
      for (const bucket of candidates) {
        for (let slot = 0; slot < 2; slot += 1) {
          const id = `bucket-${bucket}-${slot}`
          CuckooFilter.emit(observer, id, `Compare fingerprint ${fingerprint} in bucket ${bucket}, slot ${slot}.`, 'compare stored fingerprint with f(value)')
          if (this.buckets[bucket][slot] !== fingerprint) continue
          if (action === 'search-value') return { description: `${value} may be present: an eight-bit fingerprint matched.`, value: true, activeId: id }
          this.buckets[bucket][slot] = null
          const remaining = this.occurrences.get(value)! - 1
          if (remaining) this.occurrences.set(value, remaining)
          else this.occurrences.delete(value)
          this.count -= 1
          CuckooFilter.emit(observer, id, 'Remove one matching fingerprint after validating the deletion guard.', 'slot = empty')
          return { description: `Removed one recorded occurrence of ${value}.` }
        }
      }
      return { description: `${value} is definitely absent.`, value: false }
    }
    if (action !== 'insert') throw new RangeError('Unsupported cuckoo filter operation')
    // Find a complete relocation path before changing storage. This bounded BFS
    // variant replaces random kicks and guarantees transactional failure.
    const parents = new Map<number, { bucket: number, slot: number } | null>()
    const queue: number[] = []
    for (const bucket of candidates) { parents.set(bucket, null); queue.push(bucket) }
    let destination = -1
    let hole = -1
    for (let head = 0; head < queue.length && destination < 0; head += 1) {
      const bucket = queue[head]
      for (let slot = 0; slot < 2; slot += 1) {
        CuckooFilter.emit(observer, `bucket-${bucket}-${slot}`, `Find an empty slot or follow a resident to its alternate bucket.`, 'BFS over fingerprint alternate buckets')
        const resident = this.buckets[bucket][slot]
        if (resident === null) { destination = bucket; hole = slot; break }
        const alternate = this.alternate(bucket, resident)
        if (!parents.has(alternate)) {
          parents.set(alternate, { bucket, slot })
          queue.push(alternate)
        }
      }
    }
    if (destination < 0) return this.rejected('No relocation path reaches an empty slot. The fixed-size filter is unchanged.')
    let parent = parents.get(destination) ?? null
    while (parent) {
      this.buckets[destination][hole] = this.buckets[parent.bucket][parent.slot]
      this.buckets[parent.bucket][parent.slot] = null
      CuckooFilter.emit(observer, `bucket-${destination}-${hole}`, `Move a resident fingerprint from bucket ${parent.bucket} to alternate bucket ${destination}.`, 'move resident into hole; source becomes new hole')
      destination = parent.bucket
      hole = parent.slot
      parent = parents.get(destination) ?? null
    }
    this.buckets[destination][hole] = fingerprint
    this.occurrences.set(value, (this.occurrences.get(value) ?? 0) + 1)
    this.count += 1
    CuckooFilter.emit(observer, `bucket-${destination}-${hole}`, `Store fingerprint ${fingerprint}; full keys are absent from filter buckets.`, 'hole = f(value)', 'NEW')
    return { description: `Added one fingerprint for ${value}; eight buckets, two slots each.` }
  }
}
