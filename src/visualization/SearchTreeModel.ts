import { ExtendedTreeModel } from './ExtendedTreeModel.ts'
import { AdditionalTreeModel } from './AdditionalTreeModel.ts'
import type { TreeDiagramEntry, TreeInputValues, TreeOperationResult } from './AdditionalTreeModel.ts'
import type { StructureKind } from './Scene.ts'
import type { ActionKind } from './ActionCatalog.ts'
import type { TreeTraceObserver } from './TreeTrace.ts'
export class SearchTreeNode {
  public left: SearchTreeNode | null = null
  public right: SearchTreeNode | null = null
  public parent: SearchTreeNode | null = null
  public size = 1
  public height = 1
  public level = 1
  public priority = 0
  public readonly id: string
  public key: number
  constructor(id: string, key: number) {
    this.id = id
    this.key = key
  }
}
// Actual common BST links, rotations, subtree metadata, and ordered comparisons.
// Balancing and access policies belong to each concrete model.
export abstract class SearchTreeModel extends ExtendedTreeModel {
  public abstract readonly kind: StructureKind
  protected root: SearchTreeNode | null = null
  protected count = 0
  public get length(): number { return this.count }
  protected abstract empty(): SearchTreeModel
  public clone(): SearchTreeModel {
    const copy = this.empty()
    const visit = (source: SearchTreeNode | null, parent: SearchTreeNode | null): SearchTreeNode | null => {
      if (!source) return null
      const node = new SearchTreeNode(source.id, source.key)
      node.parent = parent
      node.size = source.size
      node.height = source.height
      node.level = source.level
      node.priority = source.priority
      node.left = visit(source.left, node)
      node.right = visit(source.right, node)
      return node
    }
    copy.root = visit(this.root, null)
    copy.count = this.count
    copy.nextId = this.nextId
    this.copyPolicy(copy)
    return copy
  }
  protected copyPolicy(_copy: SearchTreeModel): void {}
  protected metadata(node: SearchTreeNode): string { return `size ${node.size}` }
  public getDiagram(): TreeDiagramEntry[] {
    const result: TreeDiagramEntry[] = []
    const visit = (node: SearchTreeNode | null, role: string): void => {
      if (!node) return
      const children: string[] = []
      if (node.left) children.push(node.left.id)
      if (node.right) children.push(node.right.id)
      result.push({ id: node.id, text: String(node.key), label: `${role}; ${this.metadata(node)}`, children, width: Math.max(110, String(node.key).length * 10 + 24) })
      visit(node.left, 'left')
      visit(node.right, 'right')
    }
    visit(this.root, 'root')
    return result
  }
  protected refresh(node: SearchTreeNode): void {
    node.size = 1 + (node.left?.size ?? 0) + (node.right?.size ?? 0)
    node.height = 1 + Math.max(node.left?.height ?? 0, node.right?.height ?? 0)
  }
  protected refreshUp(node: SearchTreeNode | null): void {
    while (node) {
      this.refresh(node)
      node = node.parent
    }
  }
  protected locate(key: number, observer?: TreeTraceObserver): SearchTreeNode | null {
    let node = this.root
    while (node) {
      this.emit(observer, node.id, `Compare ${key} with ${node.key}.`, 'key < node.key ? left : right', 'compare')
      if (key === node.key) return node
      node = key < node.key ? node.left : node.right
    }
    return null
  }
  protected attach(key: number, observer?: TreeTraceObserver): SearchTreeNode {
    this.capacity()
    const node = new SearchTreeNode(this.allocateId(), key)
    let parent: SearchTreeNode | null = null
    let current = this.root
    while (current) {
      parent = current
      current = key < current.key ? current.left : current.right
    }
    node.parent = parent
    if (!parent) this.root = node
    else if (key < parent.key) parent.left = node
    else parent.right = node
    this.count += 1
    this.refreshUp(node)
    this.emit(observer, node.id, `Connect the new key ${key}.`, 'parent.child = newNode', 'connect')
    return node
  }
  // Reconnect the ancestor before publishing a rotation, so every frame is a tree.
  protected rotate(node: SearchTreeNode, direction: 'left' | 'right', observer?: TreeTraceObserver): SearchTreeNode {
    const pivot = direction === 'left' ? node.right! : node.left!
    const parent = node.parent
    if (direction === 'left') {
      node.right = pivot.left
      if (node.right) node.right.parent = node
      pivot.left = node
    } else {
      node.left = pivot.right
      if (node.left) node.left.parent = node
      pivot.right = node
    }
    pivot.parent = parent
    node.parent = pivot
    if (!parent) this.root = pivot
    else if (parent.left === node) parent.left = pivot
    else parent.right = pivot
    this.refresh(node)
    this.refresh(pivot)
    this.emit(observer, pivot.id, `Rotate ${direction} around ${node.key}.`, `rotate${direction === 'left' ? 'Left' : 'Right'}(node)`, 'rotate')
    return pivot
  }
  protected detach(node: SearchTreeNode, observer?: TreeTraceObserver): SearchTreeNode | null {
    if (node.left && node.right) {
      let successor = node.right
      while (successor.left) successor = successor.left
      node.key = successor.key
      node = successor
    }
    const parent = node.parent
    const child = node.left ?? node.right
    if (child) child.parent = parent
    if (!parent) this.root = child
    else if (parent.left === node) parent.left = child
    else parent.right = child
    this.count -= 1
    this.refreshUp(parent)
    this.emit(observer, parent?.id ?? child?.id ?? null, 'Detach the key and reconnect its child.', 'parent.child = node.child', 'remove')
    return parent
  }
  protected insertKey(key: number, observer?: TreeTraceObserver): void { this.attach(key, observer) }
  protected deleteKey(node: SearchTreeNode, observer?: TreeTraceObserver): void { this.detach(node, observer) }
  protected accessKey(key: number, observer?: TreeTraceObserver): SearchTreeNode | null { return this.locate(key, observer) }
  protected cleared(): void {}
  public execute(action: ActionKind, input: TreeInputValues, observer?: TreeTraceObserver): TreeOperationResult {
    if (action === 'clear') {
      const stack: { node: SearchTreeNode
        expanded: boolean }[] = []
      if (this.root) stack.push({ node: this.root, expanded: false })
      while (stack.length) {
        const { node, expanded } = stack.pop()!
        if (!expanded) {
          stack.push({ node, expanded: true })
          if (node.right) stack.push({ node: node.right, expanded: false })
          if (node.left) stack.push({ node: node.left, expanded: false })
          continue
        }
        const parent = node.parent
        if (!parent) this.root = null
        else if (parent.left === node) parent.left = null
        else parent.right = null
        this.count -= 1
        this.emit(observer, parent?.id ?? null, 'Release a node after both child subtrees.', 'release node in postorder', 'remove')
      }
      this.cleared()
      return { description: 'Released every node; the tree is empty.' }
    }
    if (action !== 'insert' && action !== 'search-value' && action !== 'delete-value') throw new RangeError('Unsupported tree action')
    const key = AdditionalTreeModel.integer(input, 'key')
    const found = action === 'search-value' ? this.accessKey(key, observer) : this.locate(key, observer)
    if (action === 'search-value') return { description: found ? `Found key ${key} at node ${found.id}.` : `Key ${key} is absent.`, returnValue: !!found, activeId: found?.id, status: found ? 'FOUND' : 'ABSENT' }
    if (action === 'insert') {
      if (found) return { description: `Duplicate key ${key} rejected.`, activeId: found.id, status: 'DUPLICATE' }
      this.insertKey(key, observer)
      return { description: `Inserted key ${key}.`, returnValue: true }
    }
    if (!found) return { description: `Key ${key} is absent; nothing to delete.`, returnValue: false }
    this.deleteKey(found, observer)
    return { description: `Deleted key ${key}.`, returnValue: true }
  }
}
