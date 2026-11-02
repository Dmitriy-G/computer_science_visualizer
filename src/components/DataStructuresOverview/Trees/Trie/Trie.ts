import { AdditionalTreeModel } from '../../../../visualization/AdditionalTreeModel.ts'
import type { TreeDiagramEntry, TreeInputValues, TreeOperationResult } from '../../../../visualization/AdditionalTreeModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'
import { TreeTrace } from '../../../../visualization/TreeTrace.ts'
import type { TreeTraceObserver } from '../../../../visualization/TreeTrace.ts'

class TrieNode {
  public readonly id: string
  public readonly character: string
  public readonly parent: TrieNode | null
  public readonly children = new Map<string, TrieNode>()
  public terminal = false
  constructor(id: string, character: string, parent: TrieNode | null) {
    this.id = id
    this.character = character
    this.parent = parent
  }
}

export class Trie extends AdditionalTreeModel {
  public readonly kind = 'trie'
  private root = new TrieNode('trie-root', '', null)
  private count = 0
  private nextId = 1

  public get length(): number { return this.count }

  public static createDefault(): Trie {
    const trie = new Trie()
    for (const word of ['car', 'card', 'care', 'cat', 'dog', 'dot', 'apple', 'app', 'bat', 'bar']) trie.insert(word)
    return trie
  }

  public clone(): Trie {
    const result = new Trie()
    result.count = this.count
    result.nextId = this.nextId
    const copy = (source: TrieNode, target: TrieNode): void => {
      target.terminal = source.terminal
      for (const [character, child] of source.children) {
        const node = new TrieNode(child.id, character, target)
        target.children.set(character, node)
        copy(child, node)
      }
    }
    copy(this.root, result.root)
    return result
  }

  private validate(word: string): void {
    if (!/^[a-z]{1,32}$/.test(word)) throw new TypeError('Use 1 to 32 lowercase letters a-z')
  }

  private find(word: string, observer?: TreeTraceObserver): TrieNode | null {
    let node = this.root
    let depth = 0
    for (const character of word) {
      TreeTrace.emit(observer, 'compare', node.id, 'Follow a character', `At depth ${depth}, follow '${character}'.`, 'node = node.children[character]')
      const child = node.children.get(character)
      if (!child) return null
      node = child
      depth += 1
    }
    return node
  }

  public insert(word: string, observer?: TreeTraceObserver): boolean {
    this.validate(word)
    let node = this.root
    for (const character of word) {
      TreeTrace.emit(observer, 'compare', node.id, 'Check a character', `Check the '${character}' child.`, 'child = node.children[character]')
      let child = node.children.get(character)
      if (!child) {
        child = new TrieNode(`trie-${this.nextId++}`, character, node)
        node.children.set(character, child)
        TreeTrace.emit(observer, 'create', child.id, 'Create a prefix node', `Create '${character}' below its shared prefix.`, 'node.children[character] = new Node(character)', child.id)
      }
      node = child
    }
    if (node.terminal) return false
    node.terminal = true
    this.count += 1
    TreeTrace.emit(observer, 'connect', node.id, 'Mark the word end', `Mark '${word}' as a complete word. Prefix nodes are shared.`, 'node.terminal = true; wordCount++')
    return true
  }

  public contains(word: string): boolean {
    this.validate(word)
    return this.find(word)?.terminal ?? false
  }

  public startsWith(prefix: string): boolean {
    this.validate(prefix)
    return this.find(prefix) !== null
  }

  public delete(word: string, observer?: TreeTraceObserver): boolean {
    this.validate(word)
    let node = this.find(word, observer)
    if (!node?.terminal) return false
    node.terminal = false
    this.count -= 1
    TreeTrace.emit(observer, 'remove', node.id, 'Unmark the word end', `Remove the word marker for '${word}'.`, 'node.terminal = false; wordCount--')
    while (node.parent && !node.terminal && node.children.size === 0) {
      const parent: TrieNode = node.parent
      parent.children.delete(node.character)
      TreeTrace.emit(observer, 'remove', parent.id, 'Prune an unused suffix', `Release '${node.character}'; preserve prefixes used by other words.`, 'parent.children.delete(node.character)')
      node = parent
    }
    return true
  }

  public clear(observer?: TreeTraceObserver): void {
    const stack: TrieNode[] = [this.root]
    while (stack.length) {
      const node = stack[stack.length - 1]
      const child = node.children.values().next().value as TrieNode | undefined
      if (child) stack.push(child)
      else {
        stack.pop()
        if (node.terminal) this.count -= 1
        if (node.parent) node.parent.children.delete(node.character)
        TreeTrace.emit(observer, 'remove', node.parent?.id ?? this.root.id, 'Release a prefix node', 'Release children before parents; keep the empty root.', 'release child; continue postorder')
      }
    }
    this.root.terminal = false
  }

  public getDiagram(): readonly TreeDiagramEntry[] {
    const entries: TreeDiagramEntry[] = []
    const visit = (node: TrieNode): void => {
      const children: string[] = []
      for (const child of node.children.values()) children.push(child.id)
      entries.push({ id: node.id, text: node.character || 'root', label: node.terminal ? 'WORD END' : node === this.root ? 'root' : 'prefix', children, width: 74 })
      for (const child of node.children.values()) visit(child)
    }
    visit(this.root)
    return entries
  }

  public execute(action: ActionKind, input: TreeInputValues, observer?: TreeTraceObserver): TreeOperationResult {
    if (action === 'clear') {
      this.clear(observer)
      return { description: 'All words removed; the empty root is ready for reuse.' }
    }
    const word = String(input.word ?? '')
    this.validate(word)
    if (action === 'insert') return { description: this.insert(word, observer) ? `Inserted '${word}'; ${this.length} words stored.` : `'${word}' already exists; unchanged.` }
    if (action === 'delete-value') return { description: this.delete(word, observer) ? `Deleted '${word}'; shared prefixes remain.` : `'${word}' is not a stored word; unchanged.` }
    const node = this.find(word, observer)
    const found = action === 'starts-with' ? node !== null : Boolean(node?.terminal)
    return { description: action === 'starts-with' ? `Prefix '${word}' ${found ? `exists at depth ${word.length}` : 'does not exist'}.` : `Word '${word}' ${found ? `found at depth ${word.length}` : 'not found (a prefix alone is not a word)'}.`, returnValue: found, activeId: node?.id ?? null, status: found ? 'FOUND' : 'NOT FOUND' }
  }
}
