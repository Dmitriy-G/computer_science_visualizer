import { ExtendedTreeModel } from '../ExtendedTreeModel.ts'
import type { TreeDiagramEntry, TreeInputValues, TreeOperationResult } from '../../../../visualization/AdditionalTreeModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'
import type { TreeTraceObserver } from '../../../../visualization/TreeTrace.ts'
class TernaryNode {
  public low: TernaryNode | null = null
  public equal: TernaryNode | null = null
  public high: TernaryNode | null = null
  public terminal = false
  public readonly id: string
  public readonly character: string
  constructor(id: string, character: string) {
    this.id = id
    this.character = character
  }
}
export class TernarySearchTree extends ExtendedTreeModel {
  public readonly kind = 'ternary-search-tree'
  private root: TernaryNode | null = null
  private count = 0
  public get length(): number { return this.count }
  public static createDefault(): TernarySearchTree {
    const tree = new TernarySearchTree()
    for (const word of ['car', 'card', 'care', 'cat', 'dog', 'dot', 'apple', 'app', 'bat', 'bar']) tree.execute('insert', { word })
    return tree
  }
  public clone(): TernarySearchTree {
    const copy = new TernarySearchTree()
    const visit = (node: TernaryNode | null): TernaryNode | null => {
      if (!node) return null
      const result = new TernaryNode(node.id, node.character)
      result.terminal = node.terminal
      result.low = visit(node.low)
      result.equal = visit(node.equal)
      result.high = visit(node.high)
      return result
    }
    copy.root = visit(this.root)
    copy.count = this.count
    copy.nextId = this.nextId
    return copy
  }
  public getDiagram(): TreeDiagramEntry[] {
    const entries: TreeDiagramEntry[] = []
    const visit = (node: TernaryNode | null, role: string): void => {
      if (!node) return
      const children: string[] = []
      for (const child of [node.low, node.equal, node.high]) if (child) children.push(child.id)
      entries.push({ id: node.id, text: node.character, label: `${role}${node.terminal ? '; WORD END' : ''}`, children })
      visit(node.low, '< same character index')
      visit(node.equal, '= next character')
      visit(node.high, '> same character index')
    }
    visit(this.root, 'root')
    return entries
  }
  public execute(action: ActionKind, input: TreeInputValues, observer?: TreeTraceObserver): TreeOperationResult {
    if (action === 'clear') {
      this.root = null
      this.count = 0
      this.emit(observer, null, 'Release all ternary character nodes.', 'root = null', 'remove')
      return { description: 'The ternary search tree is empty.' }
    }
    const word = this.word(input)
    let node = this.root
    let index = 0
    while (node) {
      this.emit(observer, node.id, `Compare '${word[index]}' with '${node.character}' at character index ${index}.`, 'less: low; greater: high; equal: advance into equal', 'compare')
      if (word[index] < node.character) node = node.low
      else if (word[index] > node.character) node = node.high
      else if (index === word.length - 1) break
      else {
        index += 1
        node = node.equal
      }
    }
    const found = !!node && node.terminal
    if (action === 'search-value') return { description: found ? `Found '${word}' ending at ${node!.id}.` : `'${word}' is not a stored word.`, returnValue: found, activeId: node?.id, status: found ? 'FOUND' : 'ABSENT' }
    if (action === 'delete-value') {
      if (!found) return { description: 'Word absent; tree unchanged.' }
      node!.terminal = false
      this.count -= 1
      const prune = (current: TernaryNode | null, depth: number): TernaryNode | null => {
        if (!current) return null
        if (word[depth] < current.character) current.low = prune(current.low, depth)
        else if (word[depth] > current.character) current.high = prune(current.high, depth)
        else if (depth + 1 < word.length) current.equal = prune(current.equal, depth + 1)
        return !current.terminal && !current.low && !current.equal && !current.high ? null : current
      }
      this.root = prune(this.root, 0)
      this.emit(observer, this.root?.id ?? null, 'Remove the word end and prune empty character leaves; retain routing pivots with live branches.', 'node.terminal = false; prune empty leaf paths', 'remove')
      return { description: `Deleted '${word}'; unused character leaves were pruned.` }
    }
    if (action !== 'insert') throw new RangeError('Unsupported ternary action')
    if (found) return { description: 'Duplicate word rejected.', activeId: node?.id }
    this.capacity()
    const insert = (current: TernaryNode | null, depth: number): TernaryNode => {
      current ??= new TernaryNode(this.allocateId(), word[depth])
      if (word[depth] < current.character) current.low = insert(current.low, depth)
      else if (word[depth] > current.character) current.high = insert(current.high, depth)
      else if (depth + 1 < word.length) current.equal = insert(current.equal, depth + 1)
      else current.terminal = true
      return current
    }
    this.root = insert(this.root, 0)
    this.count += 1
    this.emit(observer, this.root.id, 'Create missing ternary branches and mark the final character.', 'insert character through low/equal/high links', 'connect')
    return { description: `Inserted '${word}'. Only equal links advance the word index.` }
  }
}
