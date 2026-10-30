export interface DoublyLinkedListEntry {
  readonly id: string
  readonly value: number
  readonly prevId: string | null
  readonly nextId: string | null
}

class DoublyLinkedListNode {
  public readonly id: string
  public readonly value: number
  public prev: DoublyLinkedListNode | null = null
  public next: DoublyLinkedListNode | null = null

  constructor(id: string, value: number) {
    this.id = id
    this.value = value
  }

  public toEntry(): DoublyLinkedListEntry {
    return { id: this.id, value: this.value, prevId: this.prev?.id ?? null, nextId: this.next?.id ?? null }
  }
}

export class DoublyLinkedList {
  private head: DoublyLinkedListNode | null = null
  private tail: DoublyLinkedListNode | null = null
  private count = 0
  private nextId = 0
  private readonly idPrefix: string

  constructor(idPrefix = 'doubly-node') { this.idPrefix = idPrefix }

  public get length(): number { return this.count }

  public static createDefault(): DoublyLinkedList {
    const list = new DoublyLinkedList()
    for (let value = 10; value <= 100; value += 10) list.insertAt(list.length, value)
    return list
  }

  public insertAt(index: number, value: number): DoublyLinkedListEntry {
    this.validateIndex(index, true)
    DoublyLinkedList.validate(value)
    const successor = index === this.count ? null : this.nodeAt(index)
    const predecessor = successor ? successor.prev : this.tail
    const node = new DoublyLinkedListNode(`${this.idPrefix}-${this.nextId}`, value)
    this.nextId += 1
    node.prev = predecessor
    node.next = successor
    if (predecessor) predecessor.next = node
    else this.head = node
    if (successor) successor.prev = node
    else this.tail = node
    this.count += 1
    return node.toEntry()
  }

  public removeAt(index: number): DoublyLinkedListEntry {
    this.validateIndex(index)
    return this.unlink(this.nodeAt(index))
  }

  public deleteFirst(value: number): DoublyLinkedListEntry | null {
    DoublyLinkedList.validate(value)
    let current = this.head
    while (current) {
      if (current.value === value) return this.unlink(current)
      current = current.next
    }
    return null
  }

  public getAt(index: number): DoublyLinkedListEntry {
    this.validateIndex(index)
    return this.nodeAt(index).toEntry()
  }

  public peekFront(): DoublyLinkedListEntry | null { return this.head?.toEntry() ?? null }
  public peekBack(): DoublyLinkedListEntry | null { return this.tail?.toEntry() ?? null }
  public isEmpty(): boolean { return this.count === 0 }

  public find(value: number): DoublyLinkedListEntry | null {
    DoublyLinkedList.validate(value)
    let current = this.head
    while (current) {
      if (current.value === value) return current.toEntry()
      current = current.next
    }
    return null
  }

  public clear(): void {
    while (this.head) this.unlink(this.head)
  }

  public getEntries(): DoublyLinkedListEntry[] {
    const entries: DoublyLinkedListEntry[] = []
    let current = this.head
    while (current) {
      entries.push(current.toEntry())
      current = current.next
    }
    return entries
  }

  public clone(): DoublyLinkedList {
    const copy = new DoublyLinkedList(this.idPrefix)
    let current = this.head
    while (current) {
      const node = new DoublyLinkedListNode(current.id, current.value)
      node.prev = copy.tail
      if (copy.tail) copy.tail.next = node
      else copy.head = node
      copy.tail = node
      current = current.next
    }
    copy.count = this.count
    copy.nextId = this.nextId
    return copy
  }

  private nodeAt(index: number): DoublyLinkedListNode {
    if (index <= (this.count - 1) / 2) {
      let current = this.head!
      for (let position = 0; position < index; position += 1) current = current.next!
      return current
    }
    let current = this.tail!
    for (let position = this.count - 1; position > index; position -= 1) current = current.prev!
    return current
  }

  private unlink(node: DoublyLinkedListNode): DoublyLinkedListEntry {
    if (node.prev) node.prev.next = node.next
    else this.head = node.next
    if (node.next) node.next.prev = node.prev
    else this.tail = node.prev
    node.prev = null
    node.next = null
    this.count -= 1
    return node.toEntry()
  }

  private validateIndex(index: number, insertion = false): void {
    if (!Number.isInteger(index) || index < 0 || index >= this.count + (insertion ? 1 : 0))
      throw new RangeError('Index is outside the doubly linked list')
  }

  private static validate(value: number): void {
    if (!Number.isSafeInteger(value)) throw new TypeError('List values must be safe integers')
  }
}
