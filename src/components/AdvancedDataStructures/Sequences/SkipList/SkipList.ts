import { LinearModel } from '../../../../visualization/LinearModel.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'

export interface SkipNode {
  readonly id: string
  readonly value: number
  readonly next: (SkipNode | null)[]
}

export class SkipList extends LinearModel {
  public readonly kind = 'skip-list'
  public static readonly maximumLevel = 6
  private readonly head: SkipNode = { id: 'skip-head', value: 0, next: new Array<SkipNode | null>(SkipList.maximumLevel).fill(null) }
  private count = 0
  private nextId = 1
  private seed = 123456789
  public get length(): number { return this.count }

  public static createDefault(): SkipList {
    const model = new SkipList()
    for (let value = 10; value <= 100; value += 10) model.execute('insert', { value })
    return model
  }

  public getNodes(): readonly SkipNode[] {
    const nodes: SkipNode[] = [this.head]
    for (let node = this.head.next[0]; node; node = node.next[0]) nodes.push(node)
    return nodes
  }

  public clone(): SkipList {
    const model = new SkipList()
    const copies = new Map<SkipNode, SkipNode>([[this.head, model.head]])
    for (const node of this.getNodes()) {
      if (node !== this.head) copies.set(node, { id: node.id, value: node.value, next: new Array<SkipNode | null>(node.next.length).fill(null) })
    }
    for (const [node, copy] of copies) {
      for (let level = 0; level < node.next.length; level += 1) copy.next[level] = node.next[level] ? copies.get(node.next[level]!)! : null
    }
    model.count = this.count
    model.nextId = this.nextId
    model.seed = this.seed
    return model
  }

  private predecessors(value: number, observer?: LinearObserver): SkipNode[] {
    const update: SkipNode[] = []
    let current = this.head
    for (let level = SkipList.maximumLevel - 1; level >= 0; level -= 1) {
      LinearModel.emit(observer, `${current.id}-level-${level}`, `Search level ${level}; advance while the next key is smaller than ${value}.`, 'while next[level].key < key: current = next[level]')
      while (current.next[level] && current.next[level]!.value < value) {
        current = current.next[level]!
        LinearModel.emit(observer, `${current.id}-level-${level}`, `Visit ${current.value} on level ${level}.`, 'current = current.next[level]')
      }
      update[level] = current
    }
    return update
  }

  private randomLevel(): number {
    let level = 1
    while (level < SkipList.maximumLevel) {
      this.seed = (Math.imul(this.seed, 1664525) + 1013904223) >>> 0
      if ((this.seed & 0x80000000) !== 0) break
      level += 1
    }
    return level
  }

  public execute(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    if (action === 'clear') {
      while (this.head.next[0]) {
        const node = this.head.next[0]
        for (let level = 0; level < node.next.length; level += 1) this.head.next[level] = node.next[level]
        this.count -= 1
        LinearModel.emit(observer, null, `Release key ${node.value} and its tower.`, 'head.next[level] = first.next[level]')
      }
      return { description: 'All keys and towers have been released.' }
    }
    if (action !== 'insert' && action !== 'search-value' && action !== 'delete-value') throw new RangeError('Unsupported skip-list action')
    const value = LinearModel.integer(input, 'value')
    const update = this.predecessors(value, observer)
    const match = update[0].next[0]
    const found = match?.value === value
    if (action === 'search-value') return { description: found ? `Found key ${value} at level 0; the list is unchanged.` : `Key ${value} is absent.`, activeId: found ? `${match.id}-level-0` : `${update[0].id}-level-0`, value: found, status: found ? 'FOUND' : 'NOT FOUND' }
    if (action === 'insert') {
      if (found) return { description: `Duplicate key ${value} rejected.`, activeId: `${match.id}-level-0`, status: 'DUPLICATE' }
      if (this.count >= LinearModel.maximumElements) return { description: 'The teaching example is limited to 64 keys; insertion rejected.' }
      const node: SkipNode = { id: `skip-${this.nextId++}`, value, next: new Array<SkipNode | null>(this.randomLevel()).fill(null) }
      for (let level = 0; level < node.next.length; level += 1) {
        node.next[level] = update[level].next[level]
        update[level].next[level] = node
      }
      this.count += 1
      LinearModel.emit(observer, `${node.id}-level-0`, `Splice key ${value} into ${node.next.length} levels using the saved predecessors.`, 'new.next[level] = update[level].next[level]\nupdate[level].next[level] = new', 'NEW')
      return { description: `Inserted ${value}; level 0 remains sorted.`, activeId: `${node.id}-level-0` }
    }
    if (!found) return { description: `Key ${value} is absent; nothing removed.` }
    for (let level = 0; level < match.next.length; level += 1) update[level].next[level] = match.next[level]
    this.count -= 1
    LinearModel.emit(observer, `${update[0].id}-level-0`, `Bypass key ${value} on every level of its tower.`, 'update[level].next[level] = target.next[level]')
    return { description: `Deleted key ${value}.` }
  }
}
