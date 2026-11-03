import { SetUnionModel } from '../SetUnionModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'

export interface DisjointSetEntry {
  readonly id: string
  readonly value: number
  readonly parent: number
  readonly rank: number
}

class DisjointNode {
  public readonly id: string
  public readonly value: number
  public parent: number
  public rank = 0

  constructor(id: string, value: number) {
    this.id = id
    this.value = value
    this.parent = value
  }
}

export class DisjointSet extends SetUnionModel {
  public readonly kind = 'disjoint-set'
  private nodes = new Map<number, DisjointNode>()
  private nextId = 0
  public get length(): number { return this.nodes.size }

  public static createDefault(): DisjointSet {
    const model = new DisjointSet()
    for (let value = 10; value <= 100; value += 10) model.execute('insert', { value })
    for (const [first, second] of [[10, 20], [30, 40], [10, 30], [50, 60], [70, 80], [50, 70], [10, 50]]) {
      model.execute('union', { first, second })
    }
    return model
  }

  public getEntries(): DisjointSetEntry[] {
    const entries: DisjointSetEntry[] = []
    for (const node of this.nodes.values()) entries.push({ id: node.id, value: node.value, parent: node.parent, rank: node.rank })
    return entries
  }

  public clone(): DisjointSet {
    const copy = new DisjointSet()
    for (const entry of this.nodes.values()) {
      const node = new DisjointNode(entry.id, entry.value)
      node.parent = entry.parent
      node.rank = entry.rank
      copy.nodes.set(node.value, node)
    }
    copy.nextId = this.nextId
    return copy
  }

  public execute(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    if (action === 'clear') {
      // Remove children before their parent so every intermediate forest is valid.
      const children = new Map<number, number[]>()
      const pending: { value: number; expanded: boolean }[] = []
      for (const node of this.nodes.values()) {
        if (node.parent === node.value) pending.push({ value: node.value, expanded: false })
        else {
          let row = children.get(node.parent)
          if (!row) { row = []; children.set(node.parent, row) }
          row.push(node.value)
        }
      }
      while (pending.length) {
        const step = pending.pop()!
        const node = this.nodes.get(step.value)!
        if (!step.expanded) {
          pending.push({ value: step.value, expanded: true })
          for (const child of children.get(step.value) ?? []) pending.push({ value: child, expanded: false })
          SetUnionModel.emit(observer, node.id, `Visit ${node.value} before releasing its descendants.`, 'visit children before parent')
        } else {
          this.nodes.delete(node.value)
          SetUnionModel.emit(observer, null, `Release ${node.value}; no surviving node points to it.`, 'delete leaf from forest')
        }
      }
      return { description: 'All members and components have been released.', value: 0 }
    }
    if (action === 'insert') {
      const value = SetUnionModel.integer(input, 'value')
      if (this.nodes.has(value)) return this.reject(`${value} already belongs to the forest; its component is preserved.`)
      if (this.length >= SetUnionModel.maximumElements) return this.reject('The forest allows at most 64 members.')
      const node = new DisjointNode(`dsu-${this.nextId++}`, value)
      this.nodes.set(value, node)
      SetUnionModel.emit(observer, node.id, `Create singleton ${value} with itself as parent and rank zero.`, 'parent[x] = x; rank[x] = 0', 'NEW')
      return { description: `${value} forms a new singleton component.`, activeId: node.id, value }
    }
    if (action === 'find-set') {
      const value = SetUnionModel.integer(input, 'value')
      if (!this.nodes.has(value)) return this.reject(`${value} is not a member. Add it with Make set first.`)
      const root = this.find(value, observer)
      return { description: `Representative of ${value}: ${root.value}. The visited path is compressed.`, activeId: root.id, status: 'ROOT', value: root.value }
    }
    if (action !== 'union' && action !== 'connected') throw new RangeError('Unsupported disjoint-set action')
    const first = SetUnionModel.integer(input, 'first')
    const second = SetUnionModel.integer(input, 'second')
    // Validate both endpoints before either find can compress a path.
    if (!this.nodes.has(first) || !this.nodes.has(second)) return this.reject('Both values must already be members. No parents were changed.')
    let left = this.find(first, observer)
    let right = this.find(second, observer)
    if (action === 'connected') {
      const connected = left === right
      return { description: `${first} and ${second} ${connected ? 'share a component' : 'are in different components'}. Find paths are compressed.`, activeId: left.id, status: connected ? 'CONNECTED' : 'SEPARATE', value: connected }
    }
    if (left === right) return { description: `${first} and ${second} already share representative ${left.value}; no link is added.`, activeId: left.id, status: 'ROOT', value: left.value }
    if (left.rank < right.rank) { const swap = left; left = right; right = swap }
    right.parent = left.value
    if (left.rank === right.rank) left.rank += 1
    SetUnionModel.emit(observer, right.id, `Link root ${right.value} under ${left.value}; only an equal-rank merge increases the winning rank.`, 'parent[lowerRankRoot] = higherRankRoot; update rank on tie', 'LINKED')
    return { description: `Merged the components of ${first} and ${second}; representative ${left.value}.`, activeId: left.id, status: 'ROOT', value: left.value }
  }

  private find(value: number, observer?: LinearObserver): DisjointNode {
    let root = this.nodes.get(value)!
    while (root.parent !== root.value) {
      SetUnionModel.emit(observer, root.id, `Follow parent of ${root.value} to ${root.parent}.`, 'root = parent[root]')
      root = this.nodes.get(root.parent)!
    }
    SetUnionModel.emit(observer, root.id, `Reach representative ${root.value}. Rank is a height upper bound, not the current height.`, 'parent[root] == root', 'ROOT')
    let current = this.nodes.get(value)!
    while (current.parent !== current.value) {
      const next = this.nodes.get(current.parent)!
      if (current.parent !== root.value) {
        current.parent = root.value
        SetUnionModel.emit(observer, current.id, `Compress ${current.value} directly to representative ${root.value}.`, 'parent[current] = root', 'COMPRESSED')
      }
      current = next
    }
    return root
  }
}
