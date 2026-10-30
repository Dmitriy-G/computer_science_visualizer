export interface LinkedListEntry {
  readonly id: string
  readonly value: number
}

class LinkedListNode {
  public readonly id: string
  public readonly value: number
  public next: LinkedListNode | null = null

  constructor(id: string, value: number) {
    this.id = id
    this.value = value
  }
}

export class LinkedList {
  private head: LinkedListNode | null = null
  private size = 0
  private nextId = 0

  public get length(): number {
    return this.size
  }

  public static createDefault(): LinkedList {
    const list = new LinkedList()
    for (let index = 1; index <= 10; index += 1) {
      list.insertAt(list.length, index * 10)
    }
    return list
  }

  public insertAt(index: number, value: number): LinkedListEntry {
    if (!Number.isInteger(index) || index < 0 || index > this.size) {
      throw new RangeError('Insertion index is outside the list')
    }
    if (!Number.isSafeInteger(value)) {
      throw new TypeError('Node values must be safe integers')
    }

    const node = new LinkedListNode(`linked-node-${this.nextId}`, value)
    this.nextId += 1

    if (index === 0) {
      node.next = this.head
      this.head = node
    } else {
      let predecessor = this.head!
      for (let position = 1; position < index; position += 1) {
        predecessor = predecessor.next!
      }
      const successor = predecessor.next
      node.next = successor
      predecessor.next = node
    }

    this.size += 1
    return { id: node.id, value: node.value }
  }

  public getAt(index: number): LinkedListEntry {
    if (!Number.isInteger(index) || index < 0 || index >= this.size)
      throw new RangeError('Index is outside the list')
    let current = this.head!
    for (let position = 0; position < index; position += 1) current = current.next!
    return { id: current.id, value: current.value }
  }

  public findIndex(value: number): number {
    if (!Number.isSafeInteger(value)) throw new TypeError('Values must be safe integers')
    let current = this.head
    let index = 0
    while (current !== null) {
      if (current.value === value) return index
      current = current.next
      index += 1
    }
    return -1
  }

  public deleteAt(index: number): LinkedListEntry {
    const removed = this.getAt(index)
    if (index === 0) this.head = this.head!.next
    else {
      let previous = this.head!
      for (let position = 1; position < index; position += 1) previous = previous.next!
      previous.next = previous.next!.next
    }
    this.size -= 1
    return removed
  }

  public clear(): void {
    while (this.head !== null) {
      const removed = this.head
      this.head = removed.next
      removed.next = null
      this.size -= 1
    }
  }

  public getEntries(): LinkedListEntry[] {
    const entries: LinkedListEntry[] = []
    let current = this.head
    while (current !== null) {
      entries.push({ id: current.id, value: current.value })
      current = current.next
    }
    return entries
  }

  public clone(): LinkedList {
    const copy = new LinkedList()
    let tail: LinkedListNode | null = null
    let current = this.head

    while (current !== null) {
      const node = new LinkedListNode(current.id, current.value)
      if (tail === null) {
        copy.head = node
      } else {
        tail.next = node
      }
      tail = node
      current = current.next
    }

    copy.size = this.size
    copy.nextId = this.nextId
    return copy
  }
}
