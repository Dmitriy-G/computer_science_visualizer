import { PriorityModel } from './PriorityModel.ts'
import type { PriorityDiagram, PriorityDiagramNode } from './PriorityModel.ts'
import { LinearModel } from '../../../visualization/LinearModel.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from '../../../visualization/LinearModel.ts'
import type { ActionKind } from '../../../visualization/ActionCatalog.ts'

export interface MeldNode {
  readonly id: string
  readonly value: number
  left: MeldNode | null
  right: MeldNode | null
  rank: number
}

export abstract class MeldableBinaryHeap extends PriorityModel {
  protected root: MeldNode | null = null
  protected count = 0
  protected nextId = 1
  private pending: MeldNode[] = []
  protected abstract readonly leftist: boolean
  protected abstract empty(): MeldableBinaryHeap
  protected abstract merge(first: MeldNode | null, second: MeldNode | null, observer?: LinearObserver): MeldNode | null
  public get length(): number { return this.count }
  public getRoot(): MeldNode | null { return this.root }

  protected compare(first: MeldNode, second: MeldNode, observer?: LinearObserver): void {
    this.trace(observer, first.id, `Compare roots ${first.value} and ${second.value}; recurse through the smaller root's right subtree.`, 'if b.key < a.key: swap(a, b)\na.right = meld(a.right, b)')
  }

  private copyNode(node: MeldNode | null): MeldNode | null {
    return node ? { ...node, left: this.copyNode(node.left), right: this.copyNode(node.right) } : null
  }

  public clone(): MeldableBinaryHeap {
    const model = this.empty()
    model.root = this.copyNode(this.root)
    model.count = this.count
    model.nextId = this.nextId
    return model
  }

  private diagram(node: MeldNode, nodes: PriorityDiagramNode[]): void {
    const children: string[] = []
    for (const child of [node.left, node.right]) if (child) {
      children.push(child.id)
      this.diagram(child, nodes)
    }
    nodes.push({ id: node.id, text: String(node.value), label: `${this.leftist ? `rank ${node.rank}` : 'skew node'}${node === this.root ? ' · MIN' : ''}`, children })
  }

  public getDiagram(): PriorityDiagram {
    const nodes: PriorityDiagramNode[] = []
    const roots: string[] = []
    if (this.root) {
      roots.push(this.root.id)
      this.diagram(this.root, nodes)
    }
    for (const node of this.pending) {
      roots.push(node.id)
      this.diagram(node, nodes)
    }
    return { nodes, roots }
  }

  public execute(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    if (action === 'peek') return { description: this.root ? `Minimum ${this.root.value} is at the root.` : 'The heap is empty.', value: this.root?.value ?? null, activeId: this.root?.id, status: 'MINIMUM' }
    if (action === 'clear') {
      this.root = null
      this.count = 0
      this.trace(observer, null, 'Drop the root; JavaScript later reclaims unreachable nodes.', 'root = null; size = 0')
      return { description: 'The heap root is empty; unreachable node collection is deferred.' }
    }
    if (action === 'extract-min') {
      if (!this.root) return { description: 'The heap is empty.', value: null }
      const removed = this.root
      const left = removed.left
      const right = removed.right
      this.root = null
      this.pending = []
      if (left) this.pending.push(left)
      if (right) this.pending.push(right)
      this.count -= 1
      this.trace(observer, null, `Remove minimum ${removed.value}; meld its two child heaps.`, 'left = root.left; right = root.right; release(root)')
      this.root = this.merge(left, right, observer)
      this.pending = []
      this.trace(observer, this.root?.id ?? null, this.leftist ? 'Repair null-path ranks and swap children where the leftist inequality requires it.' : 'Swap left and right children at every node on the merge return path.', this.leftist ? 'if rank(left) < rank(right): swap children\nrank = rank(right) + 1' : 'swap(left, right)')
      return { description: `Extracted minimum ${removed.value}.`, value: removed.value, activeId: this.root?.id }
    }
    if (action !== 'insert' && action !== 'meld') throw new RangeError('Unsupported meldable-heap action')
    const values = action === 'insert' ? [LinearModel.integer(input, 'value')] : PriorityModel.parseValues(String(input.values ?? ''))
    if (this.count + values.length > PriorityModel.maximumElements) return { description: 'Operation rejected: the result would exceed 64 nodes.' }
    const donor = this.empty()
    donor.nextId = this.nextId
    for (const value of values) {
      const node: MeldNode = { id: `${this.kind}-${donor.nextId++}`, value, left: null, right: null, rank: 1 }
      donor.root = donor.merge(donor.root, node)
      donor.count += 1
    }
    this.nextId = donor.nextId
    if (donor.root) this.pending = [donor.root]
    this.count += donor.count
    this.trace(observer, donor.root?.id ?? null, action === 'insert' ? `Create a singleton heap for ${values[0]}.` : `Build a donor heap containing ${values.length} supplied values.`, 'donor = heap(values)', 'NEW')
    this.root = this.merge(this.root, donor.root, observer)
    this.pending = []
    this.trace(observer, this.root?.id ?? null, this.leftist ? 'Restore rank(left) >= rank(right) while unwinding the right-spine merge.' : 'Unconditionally exchange children while unwinding the merge.', this.leftist ? 'swap children if needed; rank = 1 + rank(right)' : 'swap(left, right)')
    return { description: action === 'insert' ? `Inserted ${values[0]}.` : `Melded a donor of ${values.length} nodes; total ${this.count}.`, activeId: this.root?.id }
  }
}
