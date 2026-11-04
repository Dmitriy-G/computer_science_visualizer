export interface CircularBufferEntry {
  readonly id: string
  readonly value: number
  readonly slot: number
}

// A bounded FIFO buffer. A full enqueue is rejected; values are never overwritten.
export class CircularBuffer {
  private readonly slots: (CircularBufferEntry | null)[]
  private head = 0
  private count = 0
  private nextId = 0

  constructor(capacity = 12) {
    if (!Number.isSafeInteger(capacity) || capacity < 1) throw new RangeError('Capacity must be a positive safe integer')
    this.slots = new Array<CircularBufferEntry | null>(capacity).fill(null)
  }

  public get length(): number { return this.count }
  public get capacity(): number { return this.slots.length }
  public get readIndex(): number { return this.head }
  public get writeIndex(): number { return (this.head + this.count) % this.capacity }

  public static createDefault(): CircularBuffer {
    const buffer = new CircularBuffer()
    // Start near the end to demonstrate physical wraparound in the initial preview.
    buffer.head = 8
    for (let value = 10; value <= 100; value += 10) buffer.enqueue(value)
    return buffer
  }

  public enqueue(value: number): CircularBufferEntry | null {
    CircularBuffer.validate(value)
    if (this.isFull()) return null
    const slot = this.writeIndex
    const entry = { id: `buffer-node-${this.nextId}`, value, slot }
    this.nextId += 1
    this.slots[slot] = entry
    this.count += 1
    return { ...entry }
  }

  public dequeue(): CircularBufferEntry | null {
    if (this.isEmpty()) return null
    const entry = this.slots[this.head]!
    this.slots[this.head] = null
    this.head = (this.head + 1) % this.capacity
    this.count -= 1
    return { ...entry }
  }

  public peek(): CircularBufferEntry | null {
    const entry = this.slots[this.head]
    return entry ? { ...entry } : null
  }

  public isEmpty(): boolean { return this.count === 0 }
  public isFull(): boolean { return this.count === this.capacity }

  public clear(): void {
    while (!this.isEmpty()) this.dequeue()
  }

  public find(value: number): CircularBufferEntry | null {
    CircularBuffer.validate(value)
    for (let offset = 0; offset < this.count; offset += 1) {
      const entry = this.slots[(this.head + offset) % this.capacity]!
      if (entry.value === value) return { ...entry }
    }
    return null
  }

  public getEntries(): CircularBufferEntry[] {
    const entries: CircularBufferEntry[] = []
    for (let offset = 0; offset < this.count; offset += 1)
      entries.push({ ...this.slots[(this.head + offset) % this.capacity]! })
    return entries
  }

  public clone(): CircularBuffer {
    const copy = new CircularBuffer(this.capacity)
    for (let index = 0; index < this.capacity; index += 1) {
      const entry = this.slots[index]
      copy.slots[index] = entry ? { ...entry } : null
    }
    copy.head = this.head
    copy.count = this.count
    copy.nextId = this.nextId
    return copy
  }

  private static validate(value: number): void {
    if (!Number.isSafeInteger(value)) throw new TypeError('Buffer values must be safe integers')
  }
}
