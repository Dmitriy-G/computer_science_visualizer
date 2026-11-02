import { ExtendedTreeModel } from '../ExtendedTreeModel.ts'
import type { TreeDiagramEntry, TreeInputValues, TreeOperationResult } from '../../../../visualization/AdditionalTreeModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'
import type { TreeTraceObserver } from '../../../../visualization/TreeTrace.ts'
class RadixNode {
  public terminal = false
  public children = new Map<string, RadixNode>()
  public readonly id: string
  public edge: string
  constructor(id: string, edge: string) {
    this.id = id
    this.edge = edge
  }
}
export class RadixTree extends ExtendedTreeModel {
  public readonly kind = 'radix-tree'
  private root = new RadixNode('radix-root', '')
  private count = 0
  public get length(): number { return this.count }
  public static createDefault(): RadixTree {
    const tree = new RadixTree()
    for (const word of ['car', 'card', 'care', 'cat', 'dog', 'dot', 'apple', 'app', 'bat', 'bar']) tree.execute('insert', { word })
    return tree
  }
  public clone(): RadixTree {
    const copy = new RadixTree()
    const visit = (node: RadixNode): RadixNode => {
      const target = new RadixNode(node.id, node.edge)
      target.terminal = node.terminal
      for (const [character, child] of node.children) target.children.set(character, visit(child))
      return target
    }
    copy.root = visit(this.root)
    copy.count = this.count
    copy.nextId = this.nextId
    return copy
  }
  public getDiagram(): TreeDiagramEntry[] {
    const entries: TreeDiagramEntry[] = []
    const visit = (node: RadixNode): void => {
      const children: string[] = []
      for (const child of node.children.values()) children.push(child.id)
      entries.push({ id: node.id, text: node.edge || 'root', label: node.terminal ? 'WORD END' : 'prefix', children, width: Math.max(110, node.edge.length * 10 + 20) })
      for (const child of node.children.values()) visit(child)
    }
    visit(this.root)
    return entries
  }
  public execute(action: ActionKind, input: TreeInputValues, observer?: TreeTraceObserver): TreeOperationResult {
    if (action === 'clear') {
      this.root.children.clear()
      this.count = 0
      this.emit(observer, this.root.id, 'Release compressed word paths.', 'root.children.clear()', 'remove')
      return { description: 'The radix tree is empty.' }
    }
    const word = this.word(input)
    let remaining = word
    let node = this.root
    const path: { parent: RadixNode
      node: RadixNode }[] = []
    while (remaining.length) {
      this.emit(observer, node.id, `Match the next compressed edge against '${remaining}'.`, 'compare common edge prefix', 'compare')
      const child = node.children.get(remaining[0])
      if (!child) break
      let common = 0
      while (common < child.edge.length && common < remaining.length && child.edge[common] === remaining[common]) common += 1
      if (common < child.edge.length) {
        if (action === 'starts-with' && common === remaining.length) return { description: `Prefix '${word}' ends inside edge '${child.edge}'.`, returnValue: true, activeId: child.id, status: 'PREFIX' }
        if (action !== 'insert') return { description: `'${word}' is absent.`, returnValue: false, activeId: child.id }
        this.capacity()
        const split = new RadixNode(this.allocateId(), child.edge.slice(0, common))
        child.edge = child.edge.slice(common)
        split.children.set(child.edge[0], child)
        node.children.set(split.edge[0], split)
        node = split
        remaining = remaining.slice(common)
        this.emit(observer, node.id, 'Split the compressed edge at the first differing character.', 'split edge at common prefix', 'split')
        break
      }
      path.push({ parent: node, node: child })
      node = child
      remaining = remaining.slice(common)
    }
    const exact = remaining.length === 0
    if (action === 'search-value' || action === 'starts-with') {
      const found = exact && (action === 'starts-with' || node.terminal)
      return { description: found ? `Found '${word}' at ${node.id}.` : `'${word}' is absent as ${action === 'starts-with' ? 'a prefix' : 'a complete word'}.`, returnValue: found, activeId: node.id, status: found ? 'FOUND' : 'ABSENT' }
    }
    if (action === 'insert') {
      if (exact && node.terminal) return { description: 'Duplicate word rejected.', activeId: node.id }
      this.capacity()
      if (remaining.length) {
        const child = new RadixNode(this.allocateId(), remaining)
        node.children.set(remaining[0], child)
        node = child
      }
      node.terminal = true
      this.count += 1
      this.emit(observer, node.id, 'Mark the end of the inserted word.', 'node.terminal = true', 'connect')
      return { description: `Inserted '${word}' in the compressed radix tree.`, activeId: node.id }
    }
    if (action !== 'delete-value') throw new RangeError('Unsupported radix action')
    if (!exact || !node.terminal) return { description: 'Word absent; paths unchanged.' }
    node.terminal = false
    this.count -= 1
    for (let index = path.length - 1; index >= 0; index -= 1) {
      const { node: child, parent } = path[index]
      if (!child.terminal && child.children.size === 0) parent.children.delete(child.edge[0])
      else if (!child.terminal && child.children.size === 1) {
        const only = child.children.values().next().value!
        child.edge += only.edge
        child.terminal = only.terminal
        child.children = only.children
      }
      this.emit(observer, parent.id, 'Prune empty paths and compress nonterminal unary paths.', 'prune empty; merge unary edge', 'merge')
    }
    return { description: `Deleted '${word}' and recompressed its path.` }
  }
}
