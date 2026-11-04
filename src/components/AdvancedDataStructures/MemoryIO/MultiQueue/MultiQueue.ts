import { AppliedModel } from '../../../../visualization/AppliedModel.ts'
import type { AppliedDiagram, DiagramItem, DiagramLink } from '../../../../visualization/AppliedModel.ts'
import { LinearModel } from '../../../../visualization/LinearModel.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'

class RequestNode {
  public next: RequestNode | null = null
  public readonly id: number
  public readonly value: number
  constructor(id: number, value: number) {
    this.id = id
    this.value = value
  }
}

export class MultiQueue extends AppliedModel {
  public readonly kind = 'multi-queue'
  public readonly representation = 'Three independent singly linked FIFO staging queues and a round-robin dispatch cursor. Each queue has cached head/tail pointers. This deterministic sequential dispatch lesson does not simulate kernel scheduling policies, request merging, or parallel hardware.'
  private heads: (RequestNode | null)[] = [null, null, null]
  private tails: (RequestNode | null)[] = [null, null, null]
  private count = 0
  private nextId = 1
  private cursor = 0
  public get length(): number { return this.count }
  public static createDefault(): MultiQueue {
    const model = new MultiQueue()
    for (let index = 0; index < 10; index += 1) model.execute('enqueue', { queue: index % 3, value: (index + 1) * 10 })
    return model
  }
  public clone(): MultiQueue {
    const copy = new MultiQueue()
    copy.nextId = this.nextId
    copy.cursor = this.cursor
    copy.count = this.count
    for (let queue = 0; queue < 3; queue += 1) {
      for (let node = this.heads[queue]; node; node = node.next) {
        const entry = new RequestNode(node.id, node.value)
        if (copy.tails[queue]) copy.tails[queue]!.next = entry
        else copy.heads[queue] = entry
        copy.tails[queue] = entry
      }
    }
    return copy
  }
  public getDiagram(): AppliedDiagram {
    const rows: DiagramItem[][] = [[{ id: 'mq-cursor', text: String(this.cursor), label: 'next dispatch queue' }]]
    const links: DiagramLink[] = []
    for (let queue = 0; queue < 3; queue += 1) {
      const row: DiagramItem[] = [{ id: `mq-head-${queue}`, text: `queue ${queue}`, label: 'head / tail' }]
      let previous = row[0].id
      for (let node = this.heads[queue]; node; node = node.next) {
        const id = `mq-${node.id}`
        row.push({ id, text: String(node.value), label: `q${queue} / request ${node.id}${node === this.tails[queue] ? ' / TAIL' : ''}` })
        links.push({ from: previous, to: id, label: 'next' })
        previous = id
      }
      rows.push(row)
    }
    return { rows, links }
  }
  public execute(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    if (action === 'inspect-storage') return this.inspect(observer)
    if (action === 'clear') {
      for (let queue = 0; queue < 3; queue += 1) {
        while (this.heads[queue]) {
          const node = this.heads[queue]!
          LinearModel.emit(observer, `mq-${node.id}`, `Release request ${node.id} from queue ${queue}.`, 'head = head.next; release old head')
          this.heads[queue] = node.next
          this.count -= 1
        }
        this.tails[queue] = null
      }
      this.cursor = 0
      return { description: 'Released all three queues; dispatch restarts at queue 0.' }
    }
    if (action === 'enqueue') {
      const queue = AppliedModel.bounded(input, 'queue', 0, 2)
      const value = LinearModel.integer(input, 'value')
      if (this.count === 64) return this.reject('At most 64 requests can be staged.')
      const node = new RequestNode(this.nextId++, value)
      if (this.tails[queue]) this.tails[queue]!.next = node
      else this.heads[queue] = node
      this.tails[queue] = node
      this.count += 1
      LinearModel.emit(observer, `mq-${node.id}`, `Append request ${node.id} to queue ${queue}.`, 'tail.next = request; tail = request', 'NEW')
      return { description: `Enqueued ${value} in queue ${queue}.`, activeId: `mq-${node.id}` }
    }
    if (action !== 'dequeue') throw new RangeError('Unsupported multiqueue action')
    for (let offset = 0; offset < 3; offset += 1) {
      const queue = (this.cursor + offset) % 3
      LinearModel.emit(observer, `mq-head-${queue}`, `Check queue ${queue} in round-robin order.`, 'queue = (cursor + offset) % 3')
      const node = this.heads[queue]
      if (!node) continue
      LinearModel.emit(observer, `mq-${node.id}`, `Dispatch request ${node.id}, value ${node.value}.`, 'remove head; advance cursor')
      this.heads[queue] = node.next
      if (!node.next) this.tails[queue] = null
      this.count -= 1
      this.cursor = (queue + 1) % 3
      return { description: `Dispatched ${node.value} from queue ${queue}; next cursor ${this.cursor}.`, value: node.value }
    }
    return { description: 'All staging queues are empty.', value: null, status: 'EMPTY' }
  }
}
