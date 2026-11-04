import { ExtendedTreeModel } from '../../../../visualization/ExtendedTreeModel.ts'
import { AdditionalTreeModel } from '../../../../visualization/AdditionalTreeModel.ts'
import type { TreeDiagramEntry, TreeInputValues, TreeOperationResult } from '../../../../visualization/AdditionalTreeModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'
import type { TreeTraceObserver } from '../../../../visualization/TreeTrace.ts'
class VEBNode {
  public min: number | null = null
  public max: number | null = null
  public summary: VEBNode | null = null
  public clusters = new Map<number, VEBNode>()
  public readonly lower: number
  public readonly id: string
  public readonly universe: number
  constructor(id: string, universe: number) {
    this.id = id
    this.universe = universe
   this.lower = 2 ** Math.floor(Math.log2(universe) / 2)
 }
}
export class VanEmdeBoasTree extends ExtendedTreeModel {
  public readonly kind = 'van-emde-boas-tree'
  private root = new VEBNode('veb-root', 256)
  private count = 0
  public get length(): number { return this.count }
  public static createDefault(): VanEmdeBoasTree {
    const tree = new VanEmdeBoasTree()
    for (const key of [3, 8, 17, 29, 44, 65, 99, 128, 190, 240]) tree.execute('insert', { key })
    return tree
  }
  public clone(): VanEmdeBoasTree {
    const copy = new VanEmdeBoasTree()
    const visit = (node: VEBNode): VEBNode => {
      const target = new VEBNode(node.id, node.universe)
      target.min = node.min
      target.max = node.max
      target.summary = node.summary ? visit(node.summary) : null
      for (const [index, child] of node.clusters) target.clusters.set(index, visit(child))
      return target
    }
    copy.root = visit(this.root)
    copy.count = this.count
    return copy
  }
  public getDiagram(): TreeDiagramEntry[] {
    const result: TreeDiagramEntry[] = []
    const visit = (node: VEBNode, role: string): void => {
      const children: string[] = []
      if (node.summary) children.push(node.summary.id)
      for (const child of node.clusters.values()) children.push(child.id)
      result.push({ id: node.id, text: `${node.min ?? 'empty'} : ${node.max ?? 'empty'}`, label: `${role}; U=${node.universe}`, children })
      if (node.summary) visit(node.summary, 'summary: occupied clusters')
      for (const [index, child] of node.clusters) visit(child, `cluster ${index}: local keys`)
    }
    visit(this.root, 'root min : max')
    return result
  }
  private member(node: VEBNode, key: number, observer?: TreeTraceObserver): boolean {
    this.emit(observer, node.id, `Test local key ${key} against min/max in U=${node.universe}.`, 'min/max match ? true : member(cluster[high], low)', 'compare')
    if (key === node.min || key === node.max) return true
    if (node.universe <= 2) return false
    const child = node.clusters.get(Math.floor(key / node.lower))
    return child ? this.member(child, key % node.lower, observer) : false
  }
  private insert(node: VEBNode, key: number): void {
    if (node.min === null) {
      node.min = key
      node.max = key
      return
    }
    if (key < node.min) {
      const old = node.min
      node.min = key
      key = old
    }
    if (node.universe > 2) {
      const high = Math.floor(key / node.lower)
      const low = key % node.lower
      let child = node.clusters.get(high)
      if (!child) {
        child = new VEBNode(`${node.id}-c${high}`, node.lower)
        node.clusters.set(high, child)
      }
      if (child.min === null) {
        node.summary ??= new VEBNode(`${node.id}-s`, node.universe / node.lower)
        this.insert(node.summary, high)
        child.min = low
        child.max = low
      } else this.insert(child, low)
    }
    if (key > node.max!) node.max = key
  }
  private successor(node: VEBNode, key: number, observer?: TreeTraceObserver): number | null {
    this.emit(observer, node.id, `Find the next local key strictly greater than ${key}.`, 'same cluster if possible; otherwise successor cluster in summary', 'compare')
    if (node.min === null || key >= node.max!) return null
    if (key < node.min) return node.min
    if (node.universe === 2) return key < 1 && node.max === 1 ? 1 : null
    const high = Math.floor(key / node.lower)
    const low = key % node.lower
    const child = node.clusters.get(high)
    if (child && child.max !== null && low < child.max) return high * node.lower + this.successor(child, low, observer)!
    const next = node.summary ? this.successor(node.summary, high, observer) : null
    return next === null ? null : next * node.lower + node.clusters.get(next)!.min!
  }
  private remove(node: VEBNode, key: number): void {
    if (node.min === node.max) {
      node.min = null
      node.max = null
      return
    }
    if (node.universe === 2) {
      node.min = key === 0 ? 1 : 0
      node.max = node.min
      return
    }
    if (key === node.min) {
      const first = node.summary!.min!
      key = first * node.lower + node.clusters.get(first)!.min!
      node.min = key
    }
    const high = Math.floor(key / node.lower)
    const child = node.clusters.get(high)!
    this.remove(child, key % node.lower)
    if (child.min === null) {
      this.remove(node.summary!, high)
      node.clusters.delete(high)
      if (key === node.max) {
        const last = node.summary!.max
        node.max = last === null ? node.min : last * node.lower + node.clusters.get(last)!.max!
      }
      if (node.summary!.min === null) node.summary = null
    } else if (key === node.max) node.max = high * node.lower + child.max!
  }
  public execute(action: ActionKind, input: TreeInputValues, observer?: TreeTraceObserver): TreeOperationResult {
    if (action === 'clear') {
      this.root = new VEBNode('veb-root', 256)
      this.count = 0
      this.emit(observer, this.root.id, 'Release clusters and summary; retain the universe.', 'clear root and clusters', 'remove')
      return { description: 'The universe remains 0..255; the set is empty.' }
    }
    const key = AdditionalTreeModel.integer(input, 'key')
    if (key < 0 || key >= 256) throw new RangeError('Keys must be integers from 0 to 255')
    if (action === 'successor') {
      const next = this.successor(this.root, key, observer)
      return { description: next === null ? `No stored key is greater than ${key}.` : `The strict successor of ${key} is ${next}.`, returnValue: next, activeId: this.root.id }
    }
    const found = this.member(this.root, key, observer)
    if (action === 'search-value') return { description: found ? `Key ${key} is present in the recursive universe.` : `Key ${key} is absent.`, returnValue: found, status: found ? 'FOUND' : 'ABSENT' }
    if (action === 'insert') {
      if (found) return { description: 'Duplicate key rejected.' }
      this.capacity()
      this.insert(this.root, key)
      this.count += 1
      this.emit(observer, this.root.id, 'Insert into recursive clusters and update the occupied-cluster summary.', 'insert(high, low); update min/max', 'connect')
      return { description: `Inserted ${key} in the sparse recursive universe.` }
    }
    if (action !== 'delete-value') throw new RangeError('Unsupported vEB action')
    if (!found) return { description: 'Key absent; universe unchanged.' }
    this.remove(this.root, key)
    this.count -= 1
    this.emit(observer, this.root.id, 'Remove the local key and prune empty cluster summaries.', 'delete cluster low; update summary and min/max', 'remove')
    return { description: `Deleted ${key}.` }
  }
}
