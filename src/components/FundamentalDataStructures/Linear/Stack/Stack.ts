export interface StackEntry {
  readonly id: string
  readonly value: number
}

class StackNode {
  public readonly id: string
  public readonly value: number
  public next: StackNode | null

  constructor(id: string, value: number, next: StackNode | null) {
    this.id = id
    this.value = value
    this.next = next
  }

  public toEntry(): StackEntry {
    return { id: this.id, value: this.value }
  }
}

export class Stack {
  private top: StackNode | null = null
  private count = 0
  private nextId = 0

  public get length(): number { return this.count }

  public static createDefault(): Stack {
    const stack = new Stack()
    for (let value = 10; value <= 100; value += 10) stack.push(value)
    return stack
  }

  public push(value: number): StackEntry {
    Stack.validateValue(value)
    this.top = new StackNode(`stack-node-${this.nextId}`, value, this.top)
    this.nextId += 1
    this.count += 1
    return this.top.toEntry()
  }

  public pop(): StackEntry | null {
    if (this.top === null) return null
    const removed = this.top
    this.top = removed.next
    this.count -= 1
    return removed.toEntry()
  }

  public peek(): StackEntry | null {
    return this.top?.toEntry() ?? null
  }

  public isEmpty(): boolean { return this.top === null }

  public clear(): void {
    while (!this.isEmpty()) this.pop()
  }

  public find(value: number): StackEntry | null {
    Stack.validateValue(value)
    let current = this.top
    while (current !== null) {
      if (current.value === value) return current.toEntry()
      current = current.next
    }
    return null
  }

  public getEntries(): StackEntry[] {
    const entries: StackEntry[] = []
    let current = this.top
    while (current !== null) {
      entries.push(current.toEntry())
      current = current.next
    }
    return entries
  }

  public clone(): Stack {
    const copy = new Stack()
    let tail: StackNode | null = null
    let current = this.top
    while (current !== null) {
      const node = new StackNode(current.id, current.value, null)
      if (tail === null) copy.top = node
      else tail.next = node
      tail = node
      current = current.next
    }
    copy.count = this.count
    copy.nextId = this.nextId
    return copy
  }

  private static validateValue(value: number): void {
    if (!Number.isSafeInteger(value)) throw new TypeError('Stack values must be safe integers')
  }
}
