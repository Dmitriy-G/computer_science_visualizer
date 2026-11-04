import { PriorityModel } from '../../../../visualization/PriorityModel.ts'
import type { PriorityDiagram, PriorityDiagramNode } from '../../../../visualization/PriorityModel.ts'
import { LinearModel } from '../../../../visualization/LinearModel.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'

export interface BinomialNode {
  readonly id: string
  readonly value: number
  child: BinomialNode | null
  sibling: BinomialNode | null
  parent: BinomialNode | null
  degree: number
}

export class BinomialHeap extends PriorityModel {
  public readonly kind = 'binomial-heap'
  private roots: BinomialNode[] = []
  private minimum: BinomialNode | null = null
  private count = 0
  private nextId = 1
  public get length(): number { return this.count }
  public getRoots(): readonly BinomialNode[] {
    const roots: BinomialNode[] = []
    for (const root of this.roots) if (!root.parent) roots.push(root)
    return roots
  }
  public get hint(): string { return 'A forest of binomial min-trees with at most one root of each degree after consolidation. Linking equal degrees makes the larger root a child. Degree d represents exactly 2^d nodes. The minimum root is cached; up to 64 values.' }

  public static createDefault(): BinomialHeap {
    const model = new BinomialHeap()
    for (const value of [40, 20, 70, 10, 50, 90, 30, 60, 80, 100]) model.execute('insert', { value })
    return model
  }

  private copy(node: BinomialNode, parent: BinomialNode | null = null): BinomialNode {
    const copy: BinomialNode = { ...node, parent, child: null, sibling: null }
    if (node.child) copy.child = this.copy(node.child, copy)
    if (node.sibling) copy.sibling = this.copy(node.sibling, parent)
    return copy
  }

  public clone(): BinomialHeap {
    const model = new BinomialHeap()
    for (const root of this.roots) {
      const copy = this.copy(root)
      model.roots.push(copy)
      if (root === this.minimum) model.minimum = copy
    }
    model.count = this.count
    model.nextId = this.nextId
    return model
  }

  private unite(incoming: readonly BinomialNode[], observer?: LinearObserver): void {
    const merged: BinomialNode[] = []
    let first = 0
    let second = 0
    while (first < this.roots.length || second < incoming.length) {
      if (second >= incoming.length || first < this.roots.length && this.roots[first].degree <= incoming[second].degree) merged.push(this.roots[first++])
      else merged.push(incoming[second++])
    }
    this.roots = merged
    this.minimum = null
    for (const root of this.roots) if (!this.minimum || root.value < this.minimum.value) this.minimum = root
    this.trace(observer, this.minimum?.id ?? null, 'Merge root lists in increasing degree before carrying equal-degree trees.', 'roots = mergeByDegree(roots, donor.roots)')
    const degrees: (BinomialNode | undefined)[] = []
    for (const root of merged) {
      let node = root
      while (degrees[node.degree]) {
        let other = degrees[node.degree]!
        const degree = node.degree
        degrees[degree] = undefined
        if (other.value < node.value) {
          const saved = node
          node = other
          other = saved
        }
        other.parent = node
        other.sibling = node.child
        node.child = other
        node.degree += 1
        if (this.minimum === other) this.minimum = node
        this.trace(observer, node.id, `Link degree-${degree} roots; ${node.value} becomes the degree-${degree + 1} root.`, 'largerRoot becomes first child of smallerRoot\ndegree += 1')
      }
      degrees[node.degree] = node
    }
    this.roots = []
    for (const root of degrees) if (root) this.roots.push(root)
  }

  private diagram(node: BinomialNode, entries: PriorityDiagramNode[]): void {
    const children: string[] = []
    for (let child = node.child; child; child = child.sibling) {
      children.push(child.id)
      this.diagram(child, entries)
    }
    entries.push({ id: node.id, text: String(node.value), label: `degree ${node.degree}${node === this.minimum ? ' · MIN' : ''}`, children })
  }

  public getDiagram(): PriorityDiagram {
    const nodes: PriorityDiagramNode[] = []
    const roots: string[] = []
    for (const root of this.getRoots()) {
      roots.push(root.id)
      this.diagram(root, nodes)
    }
    return { nodes, roots }
  }

  public execute(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    if (action === 'peek') return { description: this.minimum ? `Minimum ${this.minimum.value} is cached at a root.` : 'The binomial heap is empty.', value: this.minimum?.value ?? null, activeId: this.minimum?.id, status: 'MINIMUM' }
    if (action === 'clear') {
      this.roots = []
      this.minimum = null
      this.count = 0
      this.trace(observer, null, 'Drop the forest roots and cached minimum; collection is deferred.', 'roots = []; minimum = null; size = 0')
      return { description: 'The binomial forest is empty; unreachable nodes are reclaimed later.' }
    }
    if (action === 'extract-min') {
      if (!this.minimum) return { description: 'The binomial heap is empty.', value: null }
      const removed = this.minimum
      this.roots.splice(this.roots.indexOf(removed), 1)
      this.count -= 1
      const children: BinomialNode[] = []
      let child = removed.child
      while (child) {
        const next = child.sibling
        child.sibling = null
        child.parent = null
        children.push(child)
        child = next
      }
      this.unite(children.reverse(), observer)
      return { description: `Extracted ${removed.value}; reversed its child list and consolidated equal degrees.`, value: removed.value, activeId: this.minimum?.id }
    }
    if (action !== 'insert' && action !== 'meld') throw new RangeError('Unsupported binomial-heap action')
    const values = action === 'insert' ? [LinearModel.integer(input, 'value')] : PriorityModel.parseValues(String(input.values ?? ''))
    if (this.count + values.length > PriorityModel.maximumElements) return { description: 'Operation rejected: the result would exceed 64 nodes.' }
    const donor = new BinomialHeap()
    donor.nextId = this.nextId
    for (const value of values) {
      const node: BinomialNode = { id: `binomial-${donor.nextId++}`, value, child: null, sibling: null, parent: null, degree: 0 }
      donor.count += 1
      donor.unite([node])
    }
    this.nextId = donor.nextId
    this.count += donor.count
    this.unite(donor.roots, observer)
    return { description: action === 'insert' ? `Inserted ${values[0]} through binomial-tree linking.` : `Melded ${values.length} donor values into the binomial forest.`, activeId: this.minimum?.id }
  }
}
