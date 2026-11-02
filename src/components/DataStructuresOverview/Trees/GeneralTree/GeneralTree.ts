import { ExtendedTreeModel } from '../ExtendedTreeModel.ts'
import { AdditionalTreeModel } from '../../../../visualization/AdditionalTreeModel.ts'
import type { TreeDiagramEntry, TreeInputValues, TreeOperationResult } from '../../../../visualization/AdditionalTreeModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'
import type { TreeTraceObserver } from '../../../../visualization/TreeTrace.ts'
class GeneralNode {
  public children: GeneralNode[] = []
  public readonly id: string
  public readonly key: number
  constructor(id: string, key: number) {
    this.id = id
    this.key = key
  }
}
export class GeneralTree extends ExtendedTreeModel {
  public readonly kind = 'general-tree'
  private root: GeneralNode | null = null
  private count = 0
  public get length(): number { return this.count }
  public static createDefault(): GeneralTree {
    const tree = new GeneralTree()
    tree.execute('insert', { key: 10, parent: 10 })
    for (let index = 2; index <= 10; index += 1) tree.execute('insert', { key: index * 10, parent: index <= 5 ? 10 : 20 })
    return tree
  }
  public clone(): GeneralTree {
    const copy = new GeneralTree()
    const visit = (node: GeneralNode): GeneralNode => {
      const result = new GeneralNode(node.id, node.key)
      for (const child of node.children) result.children.push(visit(child))
      return result
    }
    copy.root = this.root ? visit(this.root) : null
    copy.count = this.count
    copy.nextId = this.nextId
    return copy
  }
  public getDiagram(): TreeDiagramEntry[] {
    const result: TreeDiagramEntry[] = []
    const visit = (node: GeneralNode, role: string): void => {
      const children: string[] = []
      for (const child of node.children) children.push(child.id)
      result.push({ id: node.id, text: String(node.key), label: `${role}; ${children.length} children`, children, width: Math.max(110, String(node.key).length * 10 + 24) })
      for (const child of node.children) visit(child, 'child')
    }
    if (this.root) visit(this.root, 'root')
    return result
  }
  private find(key: number, observer?: TreeTraceObserver): { node: GeneralNode
    parent: GeneralNode | null } | null {
    const stack: { node: GeneralNode
      parent: GeneralNode | null }[] = []
    if (this.root) stack.push({ node: this.root, parent: null })
    while (stack.length) {
      const entry = stack.pop()!
      this.emit(observer, entry.node.id, `Visit key ${entry.node.key}.`, 'visit node; push children', 'compare')
      if (entry.node.key === key) return entry
      for (let index = entry.node.children.length - 1; index >= 0; index -= 1) stack.push({ node: entry.node.children[index], parent: entry.node })
    }
    return null
  }
  public execute(action: ActionKind, input: TreeInputValues, observer?: TreeTraceObserver): TreeOperationResult {
    if (action === 'clear') {
      const stack: { node: GeneralNode
        parent: GeneralNode | null
        expanded: boolean }[] = []
      if (this.root) stack.push({ node: this.root, parent: null, expanded: false })
      while (stack.length) {
        const { node, parent, expanded } = stack.pop()!
        if (!expanded) {
          stack.push({ node, parent, expanded: true })
          for (const child of node.children) stack.push({ node: child, parent: node, expanded: false })
          continue
        }
        if (parent) parent.children.pop()
        else this.root = null
        this.count -= 1
        this.emit(observer, parent?.id ?? null, 'Release a leaf after its children.', 'release leaf', 'remove')
      }
      return { description: 'Released every general-tree node.' }
    }
    const key = AdditionalTreeModel.integer(input, 'key')
    const found = this.find(key, observer)
    if (action === 'search-value') return { description: found ? `Found ${key} at ${found.node.id}.` : `Key ${key} is absent.`, returnValue: !!found, activeId: found?.node.id, status: found ? 'FOUND' : 'ABSENT' }
    if (action === 'insert') {
      if (found) return { description: 'Duplicate key rejected.', activeId: found.node.id }
      this.capacity()
      const parentKey = AdditionalTreeModel.integer(input, 'parent')
      const parent = this.root ? this.find(parentKey, observer)?.node : null
      if (this.root && !parent) throw new RangeError('Parent key does not exist')
      const node = new GeneralNode(this.allocateId(), key)
      if (parent) parent.children.push(node)
      else this.root = node
      this.count += 1
      this.emit(observer, node.id, `Attach ${key} as ${parent ? `a child of ${parent.key}` : 'the root'}.`, 'parent.children.push(newNode)', 'connect')
      return { description: `Inserted ${key}.`, activeId: node.id }
    }
    if (action !== 'delete-value') throw new RangeError('Unsupported general-tree action')
    if (!found) return { description: 'Key absent; no subtree removed.', returnValue: false }
    const stack = [found.node]
    let removed = 0
    while (stack.length) {
      const node = stack.pop()!
      stack.push(...node.children)
      removed += 1
    }
    if (found.parent) found.parent.children.splice(found.parent.children.indexOf(found.node), 1)
    else this.root = null
    this.count -= removed
    this.emit(observer, found.parent?.id ?? null, `Remove the subtree containing ${removed} nodes.`, 'detach subtree; release descendants', 'remove')
    return { description: `Removed ${key} and its descendants (${removed} nodes).`, returnValue: removed }
  }
}
