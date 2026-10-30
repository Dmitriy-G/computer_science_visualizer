export interface QueueEntry {
  readonly id: string
  readonly value: number
  readonly nextId: string | null
}

class QueueNode {
  public readonly id: string
  public readonly value: number
  public next: QueueNode | null = null

  constructor(id: string, value: number) {
    this.id = id
    this.value = value
  }

  public toEntry(): QueueEntry {
    return { id: this.id, value: this.value, nextId: this.next?.id ?? null }
  }
}

export class Queue {
  private front: QueueNode | null = null
  private rear: QueueNode | null = null
  private count = 0
  private nextId = 0

  public get length(): number { return this.count }

  public static createDefault(): Queue {
    const queue = new Queue()
    for (let value = 10; value <= 100; value += 10) queue.enqueue(value)
    return queue
  }

  public enqueue(value: number): QueueEntry {
    Queue.validate(value)
    const node = new QueueNode(`queue-node-${this.nextId}`, value)
    this.nextId += 1
    if (this.rear) this.rear.next = node
    else this.front = node
    this.rear = node
    this.count += 1
    return node.toEntry()
  }

  public dequeue(): QueueEntry | null {
    if (!this.front) return null
    const removed = this.front
    this.front = removed.next
    removed.next = null
    this.count -= 1
    if (!this.front) this.rear = null
    return removed.toEntry()
  }

  public peek(): QueueEntry | null { return this.front?.toEntry() ?? null }
  public isEmpty(): boolean { return this.count === 0 }

  public clear(): void {
    while (!this.isEmpty()) this.dequeue()
  }

  public find(value: number): QueueEntry | null {
    Queue.validate(value)
    let current = this.front
    while (current) {
      if (current.value === value) return current.toEntry()
      current = current.next
    }
    return null
  }

  public getEntries(): QueueEntry[] {
    const entries: QueueEntry[] = []
    let current = this.front
    while (current) {
      entries.push(current.toEntry())
      current = current.next
    }
    return entries
  }

  public clone(): Queue {
    const copy = new Queue()
    let current = this.front
    while (current) {
      const node = new QueueNode(current.id, current.value)
      if (copy.rear) copy.rear.next = node
      else copy.front = node
      copy.rear = node
      current = current.next
    }
    copy.count = this.count
    copy.nextId = this.nextId
    return copy
  }

  private static validate(value: number): void {
    if (!Number.isSafeInteger(value)) throw new TypeError('Queue values must be safe integers')
  }
}
