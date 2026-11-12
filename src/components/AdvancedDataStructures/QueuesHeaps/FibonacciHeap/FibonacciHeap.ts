import { PriorityModel } from '../../../../visualization/PriorityModel.ts'
import type { PriorityDiagram, PriorityDiagramNode } from '../../../../visualization/PriorityModel.ts'
import { LinearModel } from '../../../../visualization/LinearModel.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'

export class FibonacciNode {
  public readonly id: string
  public readonly handle: number
  public key: number
  public parent: FibonacciNode | null = null
  public child: FibonacciNode | null = null
  public left: FibonacciNode
  public right: FibonacciNode
  public degree = 0
  public marked = false

  constructor(handle: number, key: number) {
    this.handle = handle
    this.id = `fib-${handle}`
    this.key = key
    this.left = this
    this.right = this
  }
}

export class FibonacciHeap extends PriorityModel {
  public readonly kind = 'fibonacci-heap'
  private minimum: FibonacciNode | null = null
  private handles = new Map<number, FibonacciNode>()
  private nextId = 1
  public get length(): number { return this.handles.size }
  public getMinimum(): FibonacciNode | null { return this.minimum }
  public getNodes(): readonly FibonacciNode[] { return Array.from(this.handles.values()) }

  public static createDefault(): FibonacciHeap {
    const model = new FibonacciHeap()
    for (const value of [40, 20, 70, 10, 50, 90, 30, 60, 80, 100, 110]) model.execute('insert', { value })
    model.execute('extract-min', {})
    return model
  }

  private ring(start: FibonacciNode | null): FibonacciNode[] {
    if (!start) return []
    const nodes: FibonacciNode[] = []
    let node = start
    do {
      nodes.push(node)
      node = node.right
    } while (node !== start)
    return nodes
  }

  public clone(): FibonacciHeap {
    const model = new FibonacciHeap()
    for (const node of this.handles.values()) model.handles.set(node.handle, new FibonacciNode(node.handle, node.key))
    for (const node of this.handles.values()) {
      const copy = model.handles.get(node.handle)!
      copy.parent = node.parent ? model.handles.get(node.parent.handle)! : null
      copy.child = node.child ? model.handles.get(node.child.handle)! : null
      copy.left = model.handles.get(node.left.handle)!
      copy.right = model.handles.get(node.right.handle)!
      copy.degree = node.degree
      copy.marked = node.marked
    }
    model.minimum = this.minimum ? model.handles.get(this.minimum.handle)! : null
    model.nextId = this.nextId
    return model
  }

  private detach(node: FibonacciNode): void {
    node.left.right = node.right
    node.right.left = node.left
    node.left = node
    node.right = node
  }

  private attach(after: FibonacciNode, node: FibonacciNode): void {
    node.left = after
    node.right = after.right
    after.right.left = node
    after.right = node
  }

  private addRoot(node: FibonacciNode): void {
    node.parent = null
    node.marked = false
    if (!this.minimum) this.minimum = node
    else {
      this.attach(this.minimum, node)
      if (node.key < this.minimum.key) this.minimum = node
    }
  }

  private link(child: FibonacciNode, parent: FibonacciNode, observer?: LinearObserver): void {
    this.detach(child)
    child.parent = parent
    child.marked = false
    if (parent.child) this.attach(parent.child, child)
    else parent.child = child
    parent.degree += 1
    if (this.minimum === child) this.minimum = parent
    this.trace(observer, parent.id, `Link equal-degree roots: ${child.key} becomes a child of ${parent.key}; degree is now ${parent.degree}.`, 'remove loser from root ring; attach loser to winner.child; winner.degree++')
  }

  private consolidate(observer?: LinearObserver): void {
    const roots = this.ring(this.minimum)
    for (const root of roots) if (!this.minimum || root.key < this.minimum.key) this.minimum = root
    const degrees: (FibonacciNode | undefined)[] = []
    for (const root of roots) {
      if (root.parent) continue
      let node = root
      while (degrees[node.degree]) {
        let other = degrees[node.degree]!
        degrees[node.degree] = undefined
        if (other.key < node.key) {
          const saved = node
          node = other
          other = saved
        }
        this.link(other, node, observer)
      }
      degrees[node.degree] = node
    }
    for (const root of this.ring(this.minimum)) if (root.key < this.minimum!.key) this.minimum = root
  }

  private cut(node: FibonacciNode, parent: FibonacciNode, observer?: LinearObserver): void {
    if (parent.child === node) parent.child = node.right === node ? null : node.right
    this.detach(node)
    parent.degree -= 1
    this.addRoot(node)
    this.trace(observer, node.id, `Cut handle ${node.handle} from parent ${parent.handle} and move it to the root ring.`, 'detach child; parent.degree--; addRoot(child); child.mark = false', 'CUT')
  }

  private cascade(node: FibonacciNode, observer?: LinearObserver): void {
    const parent = node.parent
    if (!parent) return
    if (!node.marked) {
      node.marked = true
      this.trace(observer, node.id, `Handle ${node.handle} lost its first child while non-root; mark it.`, 'if not node.mark: node.mark = true', 'MARKED')
    } else {
      this.cut(node, parent, observer)
      this.cascade(parent, observer)
    }
  }

  private insert(value: number, observer?: LinearObserver): FibonacciNode {
    const node = new FibonacciNode(this.nextId++, value)
    this.handles.set(node.handle, node)
    this.addRoot(node)
    this.trace(observer, node.id, `Insert ${value} as a singleton root with handle ${node.handle}; no consolidation is performed.`, 'addRoot(new Node(key)); update minimum', 'NEW')
    return node
  }

  private diagram(node: FibonacciNode, nodes: PriorityDiagramNode[]): void {
    const children: string[] = []
    for (const child of this.ring(node.child)) {
      children.push(child.id)
      this.diagram(child, nodes)
    }
    nodes.push({ id: node.id, text: String(node.key), label: `id ${node.handle} · d ${node.degree}${node.marked ? ' · MARKED' : ''}${node === this.minimum ? ' · MIN' : ''}`, children })
  }

  public getDiagram(): PriorityDiagram {
    const nodes: PriorityDiagramNode[] = []
    const roots: string[] = []
    for (const root of this.ring(this.minimum)) {
      roots.push(root.id)
      this.diagram(root, nodes)
    }
    return { nodes, roots, circularRoots: true }
  }

  public execute(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    if (action === 'peek') return { description: this.minimum ? `Minimum ${this.minimum.key}, handle ${this.minimum.handle}.` : 'The Fibonacci heap is empty.', value: this.minimum?.key ?? null, activeId: this.minimum?.id, status: 'MINIMUM' }
    if (action === 'clear') {
      this.minimum = null
      this.handles = new Map()
      this.trace(observer, null, 'Drop the root ring and handle table; unreachable circular lists are reclaimed later.', 'minimum = null; handles = new Map()')
      return { description: 'The Fibonacci heap is empty; node IDs are not reused.' }
    }
    if (action === 'insert') {
      const value = LinearModel.integer(input, 'value')
      if (this.length >= PriorityModel.maximumElements) return { description: 'Insertion rejected: this example allows 64 nodes.' }
      const node = this.insert(value, observer)
      return { description: `Inserted ${value} with handle ${node.handle}.`, activeId: node.id }
    }
    if (action === 'decrease-key') {
      const handle = LinearModel.integer(input, 'id')
      const value = LinearModel.integer(input, 'value')
      const node = this.handles.get(handle)
      if (!node) return { description: `Handle ${handle} does not exist; nothing changed.`, status: 'NOT FOUND' }
      if (value > node.key) return { description: `Decrease rejected: ${value} is greater than current key ${node.key}.`, activeId: node.id, status: 'REJECTED' }
      node.key = value
      const parent = node.parent
      if (parent && node.key < parent.key) {
        this.cut(node, parent, observer)
        this.cascade(parent, observer)
      }
      if (!this.minimum || node.key < this.minimum.key) this.minimum = node
      this.trace(observer, node.id, `Handle ${handle} now has key ${value}; root minimum and loss marks are consistent.`, 'if node.key < minimum.key: minimum = node')
      return { description: `Decreased handle ${handle} to ${value}.`, activeId: node.id }
    }
    if (action === 'meld') {
      const values = PriorityModel.parseValues(String(input.values ?? ''))
      if (this.length + values.length > PriorityModel.maximumElements) return { description: 'Meld rejected: the result would exceed 64 nodes.' }
      const donor = new FibonacciHeap()
      donor.nextId = this.nextId
      for (const value of values) donor.insert(value)
      this.nextId = donor.nextId
      const incoming = donor.minimum!
      if (!this.minimum) this.minimum = incoming
      else {
        const aNext = this.minimum.right
        const bLast = incoming.left
        this.minimum.right = incoming
        incoming.left = this.minimum
        bLast.right = aNext
        aNext.left = bLast
        if (incoming.key < this.minimum.key) this.minimum = incoming
      }
      for (const [handle, node] of donor.handles) this.handles.set(handle, node)
      this.trace(observer, incoming.id, `Splice the donor root ring in constant pointer work and transfer ${values.length} handle-table entries.`, 'splice(rootRing, donor.rootRing)\nfor each donor handle: handles.set(handle, node)')
      return { description: `Melded ${values.length} donor values without consolidation; handle-table transfer is linear in donor size.`, activeId: this.minimum?.id }
    }
    if (action !== 'extract-min') throw new RangeError('Unsupported Fibonacci-heap action')
    const removed = this.minimum
    if (!removed) return { description: 'The Fibonacci heap is empty.', value: null }
    const children = this.ring(removed.child)
    for (const child of children) {
      this.detach(child)
      this.addRoot(child)
    }
    removed.child = null
    removed.degree = 0
    const next = removed.right === removed ? null : removed.right
    this.detach(removed)
    this.minimum = next
    this.handles.delete(removed.handle)
    for (const root of this.ring(this.minimum)) if (root.key < this.minimum!.key) this.minimum = root
    this.trace(observer, this.minimum?.id ?? null, `Remove minimum ${removed.key}; promote all its children to roots and clear their marks.`, 'promote children; remove minimum; consolidate equal degrees')
    if (this.minimum) this.consolidate(observer)
    return { description: `Extracted ${removed.key}; root degrees are consolidated.`, value: removed.key, activeId: this.minimum?.id }
  }
}
