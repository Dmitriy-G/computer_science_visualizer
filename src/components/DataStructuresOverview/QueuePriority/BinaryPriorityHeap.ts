import { PriorityModel } from './PriorityModel.ts'
import type { PriorityDiagram } from './PriorityModel.ts'
import type { LinearObserver, LinearResult } from '../../../visualization/LinearModel.ts'

export interface PriorityEntry {
  readonly id: string
  readonly serial: number
  readonly value: number
  priority: number
  readonly key?: number
}

export abstract class BinaryPriorityHeap extends PriorityModel {
  protected entries: PriorityEntry[] = []
  protected nextId = 1
  protected readonly maximum: boolean = false
  public get length(): number { return this.entries.length }
  public getEntries(): readonly PriorityEntry[] {
    const result: PriorityEntry[] = []
    for (const entry of this.entries) result.push({ ...entry })
    return result
  }

  protected before(first: PriorityEntry, second: PriorityEntry): boolean {
    if (first.priority === second.priority) return first.serial < second.serial
    return this.maximum ? first.priority > second.priority : first.priority < second.priority
  }

  protected moved(_entry: PriorityEntry, _index: number): void {}

  protected swap(first: number, second: number, observer?: LinearObserver): void {
    const saved = this.entries[first]
    this.entries[first] = this.entries[second]
    this.entries[second] = saved
    this.moved(this.entries[first], first)
    this.moved(this.entries[second], second)
    this.trace(observer, saved.id, `Exchange heap indices ${first} and ${second}.`, 'swap(heap[a], heap[b]); update inverse positions')
  }

  protected up(index: number, observer?: LinearObserver): void {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2)
      this.trace(observer, this.entries[index].id, `Compare priority ${this.entries[index].priority} with parent ${this.entries[parent].priority}.`, 'parent = floor((index - 1) / 2)')
      if (!this.before(this.entries[index], this.entries[parent])) break
      this.swap(index, parent, observer)
      index = parent
    }
  }

  protected down(index: number, observer?: LinearObserver): void {
    while (index * 2 + 1 < this.length) {
      let child = index * 2 + 1
      if (child + 1 < this.length && this.before(this.entries[child + 1], this.entries[child])) child += 1
      this.trace(observer, this.entries[index].id, `Choose child priority ${this.entries[child].priority} and compare it with the parent.`, 'child = higherPriority(left, right)')
      if (!this.before(this.entries[child], this.entries[index])) break
      this.swap(index, child, observer)
      index = child
    }
  }

  protected append(value: number, priority: number, observer?: LinearObserver, key?: number): PriorityEntry | null {
    if (this.length >= PriorityModel.maximumElements) return null
    const serial = this.nextId++
    const entry: PriorityEntry = { id: `${this.kind}-${serial}`, serial, value, priority, key }
    this.entries.push(entry)
    this.moved(entry, this.length - 1)
    this.trace(observer, entry.id, `Append value ${value} with priority ${priority} at index ${this.length - 1}.`, 'heap.push(entry)', 'NEW')
    this.up(this.length - 1, observer)
    return entry
  }

  protected removeAt(index: number, observer?: LinearObserver): PriorityEntry {
    const removed = this.entries[index]
    const last = this.entries.pop()!
    if (index < this.length) {
      this.entries[index] = last
      this.moved(last, index)
      this.trace(observer, last.id, `Replace the removed entry with the last leaf at index ${index}.`, 'heap[index] = heap.pop()')
      if (index > 0 && this.before(last, this.entries[Math.floor((index - 1) / 2)])) this.up(index, observer)
      else this.down(index, observer)
    }
    return removed
  }

  protected peekResult(): LinearResult {
    const entry = this.entries[0]
    return entry ? { description: `Next value: ${entry.value}; priority ${entry.priority}${entry.key === undefined ? '' : `; key ${entry.key}`}.`, activeId: entry.id, status: this.maximum ? 'MAXIMUM' : 'MINIMUM', value: entry.value }
      : { description: 'The priority structure is empty.', value: null }
  }

  public getDiagram(): PriorityDiagram {
    const nodes = []
    for (let index = 0; index < this.length; index += 1) {
      const entry = this.entries[index]
      const children: string[] = []
      for (const child of [index * 2 + 1, index * 2 + 2]) if (child < this.length) children.push(this.entries[child].id)
      nodes.push({ id: entry.id, text: this.kind === 'binary-max-heap' ? String(entry.value) : `${entry.value} | p ${entry.priority}`,
        label: `${index === 0 ? this.maximum ? 'MAX · ' : 'MIN · ' : ''}index ${index}${entry.key === undefined ? ` · order ${entry.serial}` : ` · key ${entry.key}`}`, children })
    }
    return { nodes, roots: this.length ? [this.entries[0].id] : [] }
  }

  protected copyTo(model: BinaryPriorityHeap): void {
    for (const entry of this.entries) {
      model.entries.push({ ...entry })
      model.moved(entry, model.length - 1)
    }
    model.nextId = this.nextId
  }
}
