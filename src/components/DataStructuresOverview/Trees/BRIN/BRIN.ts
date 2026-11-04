import { AppliedModel } from '../../../../visualization/AppliedModel.ts'
import type { AppliedDiagram } from '../../../../visualization/AppliedModel.ts'
import { LinearModel } from '../../../../visualization/LinearModel.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'

interface HeapRecord { readonly id: number, readonly value: number }
interface RangeSummary { readonly minimum: number, readonly maximum: number }

export class BRIN extends AppliedModel {
  public readonly kind = 'brin'
  public readonly representation = 'Min/max summaries cover groups of three consecutive heap records. Queries prune disjoint groups, then recheck every record in candidate groups. This bounded in-memory BRIN variant eagerly maintains summaries; groups represent page ranges, not actual PostgreSQL pages or operator classes.'
  private records: HeapRecord[] = []
  private summaries: RangeSummary[] = []
  private nextId = 1
  public get length(): number { return this.records.length }

  public static createDefault(): BRIN {
    const model = new BRIN()
    for (const value of [3, 7, 5, 22, 20, 25, 42, 38, 40, 60]) model.execute('insert-end', { value })
    return model
  }

  public clone(): BRIN {
    const copy = new BRIN()
    copy.records = this.records.map((record) => ({ ...record }))
    copy.summaries = this.summaries.map((summary) => ({ ...summary }))
    copy.nextId = this.nextId
    return copy
  }

  public getDiagram(): AppliedDiagram {
    return { rows: [
      this.summaries.map((summary, index) => ({ id: `brin-range-${index}`, text: `${summary.minimum}..${summary.maximum}`, label: `page range ${index}`, children: this.records.slice(index * 3, index * 3 + 3).map((record) => `brin-record-${record.id}`) })),
      this.records.map((record, index) => ({ id: `brin-record-${record.id}`, text: String(record.value), label: `heap slot ${index}` })),
    ] }
  }

  public execute(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    if (action === 'inspect-storage') return this.inspect(observer)
    if (action === 'insert-end') {
      const value = LinearModel.integer(input, 'value')
      if (this.length === 64) return this.reject('At most 64 heap records are supported.')
      const index = Math.floor(this.length / 3)
      const previous = this.summaries[index]
      const record = { id: this.nextId++, value }
      this.records.push(record)
      this.summaries[index] = { minimum: Math.min(previous?.minimum ?? value, value), maximum: Math.max(previous?.maximum ?? value, value) }
      LinearModel.emit(observer, `brin-record-${record.id}`, `Append ${value} and maintain page-range ${index}.`, 'append heap record; widen range min/max')
      return { description: `Appended ${value}; page-range ${index} is summarized.` }
    }
    if (action === 'search-overlap') {
      const minimum = LinearModel.integer(input, 'minimum')
      const maximum = LinearModel.integer(input, 'maximum')
      if (minimum > maximum) throw new RangeError('Maximum must be at least minimum')
      const matches: number[] = []
      let candidates = 0
      let rechecks = 0
      for (let index = 0; index < this.summaries.length; index += 1) {
        const summary = this.summaries[index]
        const candidate = summary.maximum >= minimum && summary.minimum <= maximum
        LinearModel.emit(observer, `brin-range-${index}`, `${candidate ? 'Read candidate' : 'Prune disjoint'} page-range ${index}.`, 'candidate = range.max >= min && range.min <= max')
        if (!candidate) continue
        candidates++
        for (let slot = index * 3; slot < Math.min(this.length, index * 3 + 3); slot += 1) {
          const record = this.records[slot]
          rechecks++
          const match = record.value >= minimum && record.value <= maximum
          LinearModel.emit(observer, `brin-record-${record.id}`, `Exact recheck of ${record.value}: ${match ? 'match' : 'false positive'}.`, 'recheck actual heap value against inclusive bounds', match ? 'FOUND' : undefined)
          if (match) matches.push(record.value)
        }
      }
      return { description: `Matches: ${matches.join(', ') || 'none'}. ${candidates} candidate page ranges, ${rechecks} exact rechecks.`, value: matches, status: matches.length ? 'FOUND' : 'ABSENT' }
    }
    if (action === 'clear') {
      while (this.records.length) {
        this.records.pop()
        const index = Math.floor(this.length / 3)
        const tail = this.records.slice(index * 3)
        if (!tail.length) this.summaries.pop()
        else this.summaries[index] = { minimum: Math.min(...tail.map((record) => record.value)), maximum: Math.max(...tail.map((record) => record.value)) }
        LinearModel.emit(observer, null, 'Release the last heap record and repair its summary.', 'remove tail record; shrink or remove range summary')
      }
      return { description: 'Released all heap records and range summaries.' }
    }
    throw new RangeError('Unsupported BRIN action')
  }
}
