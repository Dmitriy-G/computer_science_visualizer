import { ProbabilisticModel } from '../ProbabilisticModel.ts'
import { ProbabilisticHash } from '../../../../visualization/ProbabilisticHash.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'

export interface QuotientSlot {
  readonly remainder: number | null
  readonly occupied: boolean
  readonly continuation: boolean
  readonly shifted: boolean
}

export class QuotientFilter extends ProbabilisticModel {
  public readonly kind = 'quotient-filter' as const
  private slots: QuotientSlot[] = QuotientFilter.emptySlots()

  private static emptySlots(): QuotientSlot[] {
    return Array.from({ length: 16 }, () => ({ remainder: null, occupied: false, continuation: false, shifted: false }))
  }

  public static createDefault(): QuotientFilter {
    const model = new QuotientFilter()
    for (let value = 10; value <= 100; value += 10) model.execute('insert', { value })
    return model
  }

  public getSlots(): readonly QuotientSlot[] { return this.slots.map((slot) => ({ ...slot })) }
  public fingerprint(value: number): number { return Number(ProbabilisticHash.hash(value) & 4095n) }

  public clone(): QuotientFilter {
    const copy = new QuotientFilter()
    copy.count = this.count
    copy.slots = this.slots.map((slot) => ({ ...slot }))
    return copy
  }

  private runStart(quotient: number, observer?: LinearObserver): number {
    let bucket = quotient
    while (this.slots[bucket].shifted) {
      QuotientFilter.emit(observer, `qslot-${bucket}`, 'Walk backward to the start of this cluster.', 'while shifted[b]: b = previous(b)')
      bucket = (bucket + 15) % 16
    }
    let run = bucket
    while (bucket !== quotient) {
      do { run = (run + 1) % 16 } while (this.slots[run].continuation)
      do { bucket = (bucket + 1) % 16 } while (!this.slots[bucket].occupied)
      QuotientFilter.emit(observer, `qslot-${run}`, `Advance a run for the next occupied canonical quotient ${bucket}.`, 'advance run start and occupied quotient together')
    }
    return run
  }

  // Decode fingerprints from the real packed runs, not from a hidden key set.
  private fingerprints(): number[] {
    const result: number[] = []
    for (let quotient = 0; quotient < 16; quotient += 1) {
      if (!this.slots[quotient].occupied) continue
      let position = this.runStart(quotient)
      do {
        result.push(quotient * 256 + this.slots[position].remainder!)
        position = (position + 1) % 16
      } while (this.slots[position].continuation)
    }
    return result
  }

  private pack(fingerprints: readonly number[]): QuotientSlot[] {
    // Educational rebuild insertion: try circular cuts until all sorted runs
    // fit. One reserved empty slot guarantees a valid cut and lookup sentinel.
    for (let start = 0; start < 16; start += 1) {
      const sorted = [...fingerprints].sort((left, right) => {
        const ql = Math.floor(left / 256)
        const qr = Math.floor(right / 256)
        return (ql - start + 16) % 16 - (qr - start + 16) % 16 || left % 256 - right % 256
      })
      const packed = QuotientFilter.emptySlots()
      let cursor = 0
      let previous = -1
      let fits = true
      for (const fingerprint of sorted) {
        const quotient = Math.floor(fingerprint / 256)
        cursor = Math.max(cursor, (quotient - start + 16) % 16)
        if (cursor >= 16) { fits = false; break }
        const position = (start + cursor) % 16
        packed[position] = { ...packed[position], remainder: fingerprint % 256, continuation: previous === quotient, shifted: position !== quotient }
        packed[quotient] = { ...packed[quotient], occupied: true }
        previous = quotient
        cursor += 1
      }
      if (fits) return packed
    }
    throw new Error('Quotient packing invariant failed')
  }

  public execute(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    if (action === 'clear') {
      this.slots = QuotientFilter.emptySlots()
      this.count = 0
      QuotientFilter.emit(observer, null, 'Clear all remainders and O/C/S metadata.', 'slots = empty')
      return { description: 'All sixteen quotient slots are empty.' }
    }
    const value = QuotientFilter.integer(input, 'value')
    const fingerprint = this.fingerprint(value)
    const quotient = Math.floor(fingerprint / 256)
    const remainder = fingerprint % 256
    QuotientFilter.emit(observer, `qslot-${quotient}`, `Split the 12-bit fingerprint into quotient ${quotient} and remainder ${remainder}.`, 'q = fingerprint >> 8; r = fingerprint & 255')
    if (action === 'search-value') {
      if (!this.slots[quotient].occupied) return { description: `${value} is definitely absent: quotient ${quotient} is unoccupied.`, value: false }
      let position = this.runStart(quotient, observer)
      do {
        const stored = this.slots[position].remainder!
        QuotientFilter.emit(observer, `qslot-${position}`, `Compare remainder ${remainder} with ${stored} in quotient ${quotient}'s sorted run.`, 'compare remainder; stop at larger remainder or run end')
        if (stored === remainder) return { description: `${value} may be present: its quotient and remainder match.`, value: true, activeId: `qslot-${position}` }
        if (stored > remainder) break
        position = (position + 1) % 16
      } while (this.slots[position].continuation)
      return { description: `${value} is definitely absent from its quotient run.`, value: false }
    }
    if (action !== 'insert') throw new RangeError('Unsupported quotient filter operation')
    if (this.count >= 15) return this.rejected('Fifteen fingerprint occurrences fill this lesson. One slot stays empty to terminate circular clusters.')
    const fingerprints = this.fingerprints()
    fingerprints.push(fingerprint)
    const packed = this.pack(fingerprints)
    QuotientFilter.emit(observer, `qslot-${quotient}`, 'Decode stored runs, add the new fingerprint, and sort runs around a valid circular cut.', 'rebuild packed runs from fingerprints (no full keys)')
    this.slots = packed
    this.count += 1
    QuotientFilter.emit(observer, `qslot-${quotient}`, 'Publish remainders with occupied, continuation, and shifted metadata together.', 'commit packed remainder array and O/C/S bits', 'NEW')
    return { description: `Added a fingerprint for ${value}. This variant rebuilds packed runs on insertion; membership uses O/C/S metadata.` }
  }
}
