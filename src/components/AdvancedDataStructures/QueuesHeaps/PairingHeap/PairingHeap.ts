import { PriorityModel } from '../../../../visualization/PriorityModel.ts'
import type { PriorityDiagram, PriorityDiagramNode } from '../../../../visualization/PriorityModel.ts'
import { LinearModel } from '../../../../visualization/LinearModel.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'

export interface PairingNode {
  readonly id: string
  readonly value: number
  child: PairingNode | null
  next: PairingNode | null
}

export class PairingHeap extends PriorityModel {
  public readonly kind = 'pairing-heap'
  private root: PairingNode | null = null
  private work: (PairingNode | null)[] = []
  private count = 0
  private nextId = 1
  public get length(): number { return this.count }
  public getRoot(): PairingNode | null { return this.root }
  public get hint(): string { return 'A min-heap with child/sibling links. Meld attaches the larger root as the smaller root’s first child. Extract-min pairs adjacent children left-to-right, then combines the resulting heaps right-to-left. Up to 64 nodes.' }

  public static createDefault(): PairingHeap {
    const model = new PairingHeap()
    for (const value of [40, 20, 70, 10, 50, 90, 30, 60, 80, 100]) model.execute('insert', { value })
    return model
  }

  private link(first: PairingNode | null, second: PairingNode | null): PairingNode | null {
    if (!first) return second
    if (!second) return first
    if (second.value < first.value) {
      const saved = first
      first = second
      second = saved
    }
    second.next = first.child
    first.child = second
    return first
  }

  private copy(node: PairingNode | null): PairingNode | null {
    return node ? { ...node, child: this.copy(node.child), next: this.copy(node.next) } : null
  }

  public clone(): PairingHeap {
    const model = new PairingHeap()
    model.root = this.copy(this.root)
    model.count = this.count
    model.nextId = this.nextId
    return model
  }

  private diagram(node: PairingNode, entries: PriorityDiagramNode[]): void {
    const children: string[] = []
    for (let child = node.child; child; child = child.next) {
      children.push(child.id)
      this.diagram(child, entries)
    }
    entries.push({ id: node.id, text: String(node.value), label: node === this.root ? 'MIN · pairing root' : 'child / sibling', children })
  }

  public getDiagram(): PriorityDiagram {
    const nodes: PriorityDiagramNode[] = []
    const roots: string[] = []
    if (this.root) {
      roots.push(this.root.id)
      this.diagram(this.root, nodes)
    }
    for (const node of this.work) if (node) {
      roots.push(node.id)
      this.diagram(node, nodes)
    }
    return { nodes, roots }
  }

  public execute(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    if (action === 'peek') return { description: this.root ? `Minimum ${this.root.value} is at the root.` : 'The pairing heap is empty.', value: this.root?.value ?? null, activeId: this.root?.id, status: 'MINIMUM' }
    if (action === 'clear') {
      this.root = null
      this.count = 0
      this.trace(observer, null, 'Drop the root; unreachable child/sibling nodes are reclaimed later.', 'root = null; size = 0')
      return { description: 'The pairing heap is empty.' }
    }
    if (action === 'extract-min') {
      if (!this.root) return { description: 'The pairing heap is empty.', value: null }
      const removed = this.root
      this.work = []
      let child = removed.child
      while (child) {
        const next = child.next
        child.next = null
        this.work.push(child)
        child = next
      }
      this.root = null
      this.count -= 1
      this.trace(observer, null, `Remove ${removed.value} and detach its child heaps.`, 'children = detachChildren(root); release(root)')
      const paired: PairingNode[] = []
      const original = [...this.work]
      for (let index = 0; index < original.length; index += 2) {
        const joined = this.link(original[index], original[index + 1] ?? null)!
        paired.push(joined)
        this.work[index] = joined
        if (index + 1 < this.work.length) this.work[index + 1] = null
        this.trace(observer, joined.id, 'First pass: meld the next adjacent pair from left to right.', 'pairs.push(meld(children[i], children[i + 1]))')
      }
      this.work = [...paired]
      let result: PairingNode | null = null
      for (let index = paired.length - 1; index >= 0; index -= 1) {
        result = this.link(paired[index], result)
        this.work[index] = result
        if (index + 1 < this.work.length) this.work[index + 1] = null
        this.trace(observer, result!.id, 'Second pass: combine paired heaps from right to left.', 'result = meld(pairs[i], result)')
      }
      this.root = result
      this.work = []
      return { description: `Extracted minimum ${removed.value} using two-pass pairing.`, value: removed.value, activeId: this.root?.id }
    }
    if (action !== 'insert' && action !== 'meld') throw new RangeError('Unsupported pairing-heap action')
    const values = action === 'insert' ? [LinearModel.integer(input, 'value')] : PriorityModel.parseValues(String(input.values ?? ''))
    if (this.count + values.length > PriorityModel.maximumElements) return { description: 'Operation rejected: the result would exceed 64 nodes.' }
    let donor: PairingNode | null = null
    for (const value of values) donor = this.link(donor, { id: `pairing-${this.nextId++}`, value, child: null, next: null })
    this.work = donor ? [donor] : []
    this.count += values.length
    this.trace(observer, donor?.id ?? null, `Create a donor containing ${values.length} value${values.length === 1 ? '' : 's'}.`, 'donor = pairingHeap(values)', 'NEW')
    this.root = this.link(this.root, donor)
    this.work = []
    this.trace(observer, this.root?.id ?? null, 'Attach the larger root as the smaller root’s first child.', 'loser.next = winner.child; winner.child = loser')
    return { description: action === 'insert' ? `Inserted ${values[0]}.` : `Melded ${values.length} donor values.`, activeId: this.root?.id }
  }
}
