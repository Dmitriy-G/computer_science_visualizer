import { DoublyLinkedList } from '../DoublyLinkedList/DoublyLinkedList.ts'
import type { DoublyLinkedListEntry } from '../DoublyLinkedList/DoublyLinkedList.ts'

export type DequeEntry = DoublyLinkedListEntry

// Reuse the doubly linked representation, exposing only the deque operations.
export class Deque {
  private list = new DoublyLinkedList('deque-node')

  public get length(): number { return this.list.length }

  public static createDefault(): Deque {
    const deque = new Deque()
    for (let value = 10; value <= 100; value += 10) deque.pushBack(value)
    return deque
  }

  public pushFront(value: number): DequeEntry { return this.list.insertAt(0, value) }
  public pushBack(value: number): DequeEntry { return this.list.insertAt(this.length, value) }
  public popFront(): DequeEntry | null { return this.isEmpty() ? null : this.list.removeAt(0) }
  public popBack(): DequeEntry | null { return this.isEmpty() ? null : this.list.removeAt(this.length - 1) }
  public peekFront(): DequeEntry | null { return this.list.peekFront() }
  public peekBack(): DequeEntry | null { return this.list.peekBack() }
  public isEmpty(): boolean { return this.list.isEmpty() }
  public find(value: number): DequeEntry | null { return this.list.find(value) }
  public clear(): void { this.list.clear() }
  public getEntries(): DequeEntry[] { return this.list.getEntries() }

  public clone(): Deque {
    const copy = new Deque()
    copy.list = this.list.clone()
    return copy
  }
}
