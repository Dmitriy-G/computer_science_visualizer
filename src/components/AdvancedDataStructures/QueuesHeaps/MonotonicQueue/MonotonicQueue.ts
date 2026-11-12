import { PriorityModel } from '../../../../visualization/PriorityModel.ts'
import type { PriorityDiagram } from '../../../../visualization/PriorityModel.ts'
import { LinearModel } from '../../../../visualization/LinearModel.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'

export interface WindowEntry {
  readonly id: string
  readonly value: number
  readonly index: number
}

interface Candidate {
  readonly entry: WindowEntry
  previous: Candidate | null
  next: Candidate | null
}

export class MonotonicQueue extends PriorityModel {
  public readonly kind = 'monotonic-queue'
  public static readonly windowSize = 10
  private head: Candidate | null = null
  private tail: Candidate | null = null
  private history: (WindowEntry | null)[] = new Array<null>(MonotonicQueue.windowSize).fill(null)
  private arrivals = 0
  private count = 0
  public get length(): number { return this.count }

  public static createDefault(): MonotonicQueue {
    const model = new MonotonicQueue()
    for (const value of [100, 90, 80, 70, 60, 50, 40, 30, 20, 10]) model.execute('enqueue', { value })
    return model
  }

  public getCandidates(): readonly WindowEntry[] {
    const result: WindowEntry[] = []
    for (let node = this.head; node; node = node.next) result.push({ ...node.entry })
    return result
  }

  public getWindow(): readonly WindowEntry[] {
    const entries: WindowEntry[] = []
    for (let index = this.arrivals - this.count; index < this.arrivals; index += 1) {
      const entry = this.history[index % MonotonicQueue.windowSize]
      if (entry) entries.push({ ...entry })
    }
    return entries
  }

  public clone(): MonotonicQueue {
    const model = new MonotonicQueue()
    model.arrivals = this.arrivals
    model.count = this.count
    model.history = []
    for (const entry of this.history) model.history.push(entry ? { ...entry } : null)
    for (const entry of this.getCandidates()) {
      const node: Candidate = { entry, previous: model.tail, next: null }
      if (model.tail) model.tail.next = node
      else model.head = node
      model.tail = node
    }
    return model
  }

  public getDiagram(): PriorityDiagram {
    const nodes = []
    const roots: string[] = []
    for (const entry of this.getCandidates()) {
      nodes.push({ id: entry.id, text: String(entry.value), label: `arrival ${entry.index}`, children: [] })
      roots.push(entry.id)
    }
    return { nodes, roots }
  }

  public execute(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    if (action === 'peek') return { description: this.head ? `Window maximum ${this.head.entry.value}, arrival ${this.head.entry.index}.` : 'The window is empty.', value: this.head?.entry.value ?? null, activeId: this.head?.entry.id, status: 'MAXIMUM' }
    if (action === 'clear') {
      this.head = null
      this.tail = null
      this.history = new Array<null>(MonotonicQueue.windowSize).fill(null)
      this.count = 0
      this.trace(observer, null, 'Release the candidate deque and clear the fixed-size window history.', 'head = tail = null; history.fill(empty); count = 0')
      return { description: 'The window and candidate deque are empty; arrival IDs remain monotone.' }
    }
    if (action !== 'enqueue') throw new RangeError('Unsupported monotonic-queue action')
    const value = LinearModel.integer(input, 'value')
    const index = this.arrivals
    while (this.head && this.head.entry.index <= index - MonotonicQueue.windowSize) {
      const expired = this.head.entry
      this.head = this.head.next
      if (this.head) this.head.previous = null
      else this.tail = null
      this.trace(observer, this.head?.entry.id ?? null, `Expire candidate ${expired.value} at arrival ${expired.index}; it falls outside the next ten-value window.`, 'while front.index <= newIndex - windowSize: popFront()')
    }
    while (this.tail && this.tail.entry.value <= value) {
      const dominated = this.tail.entry
      this.tail = this.tail.previous
      if (this.tail) this.tail.next = null
      else this.head = null
      this.trace(observer, this.tail?.entry.id ?? null, `Discard candidate ${dominated.value}: new value ${value} is at least as large and expires later.`, 'while back.value <= newValue: popBack()')
    }
    const entry = { id: `monotonic-${index}`, value, index }
    const node: Candidate = { entry, previous: this.tail, next: null }
    if (this.tail) this.tail.next = node
    else this.head = node
    this.tail = node
    this.history[index % MonotonicQueue.windowSize] = entry
    this.arrivals += 1
    this.count = Math.min(MonotonicQueue.windowSize, this.count + 1)
    this.trace(observer, entry.id, `Append arrival ${index}; candidates decrease from front to back.`, 'pushBack(newEntry); history[index % windowSize] = newEntry', 'NEW')
    const maximum = this.head!.entry
    return { description: `Pushed ${value}; the latest ${this.count}-value window has maximum ${maximum.value}.`, activeId: maximum.id, value: maximum.value }
  }
}
