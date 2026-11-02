import { ExtendedTreeModel } from '../../Trees/ExtendedTreeModel.ts'
import type { TreeDiagramEntry, TreeInputValues, TreeOperationResult } from '../../../../visualization/AdditionalTreeModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'
import type { TreeTraceObserver } from '../../../../visualization/TreeTrace.ts'
class SuffixNode {
  public children = new Map<string, SuffixNode>()
  public suffix = -1
  public readonly id: string
  public start: number
  public end: number
  constructor(id: string, start: number, end: number) {
    this.id = id
    this.start = start
    this.end = end
  }
}
// Naive compressed suffix insertion with shared text slices, not Ukkonen's algorithm.
export class SuffixTree extends ExtendedTreeModel {
  public readonly kind = 'suffix-tree'
  private text = ''
  private root = new SuffixNode('suffix-root', 0, 0)
  public get length(): number { return Math.max(0, this.text.length - 1) }
  public static createDefault(): SuffixTree {
    const tree = new SuffixTree()
    tree.execute('build-text', { text: 'bananaband' })
    return tree
  }
  public clone(): SuffixTree {
    const copy = new SuffixTree()
    const visit = (node: SuffixNode): SuffixNode => {
      const result = new SuffixNode(node.id, node.start, node.end)
      result.suffix = node.suffix
      for (const [character, child] of node.children) result.children.set(character, visit(child))
      return result
    }
    copy.text = this.text
    copy.root = visit(this.root)
    copy.nextId = this.nextId
    return copy
  }
  public getDiagram(): TreeDiagramEntry[] {
    const entries: TreeDiagramEntry[] = []
    const visit = (node: SuffixNode): void => {
      const children: string[] = []
      for (const child of node.children.values()) children.push(child.id)
      const text = node === this.root ? 'root' : this.text.slice(node.start, node.end)
      entries.push({ id: node.id, text, label: node.suffix >= 0 ? `suffix index ${node.suffix}` : `edge [${node.start}, ${node.end})`, children, width: Math.max(110, text.length * 10 + 20) })
      for (const child of node.children.values()) visit(child)
    }
    visit(this.root)
    return entries
  }
  public execute(action: ActionKind, input: TreeInputValues, observer?: TreeTraceObserver): TreeOperationResult {
    if (action === 'clear') {
      this.root.children.clear()
      this.text = ''
      this.emit(observer, this.root.id, 'Release all suffix edges and source text.', 'clear root and text', 'remove')
      return { description: 'The suffix tree is empty.' }
    }
    if (action === 'build-text') {
      const text = this.word(input, 'text')
      this.text = text + '$'
      this.root.children.clear()
      for (let suffix = 0; suffix < this.text.length; suffix += 1) {
        let parent = this.root
        let position = suffix
        while (position < this.text.length) {
          const child = parent.children.get(this.text[position])
          if (!child) {
            const leaf = new SuffixNode(this.allocateId(), position, this.text.length)
            leaf.suffix = suffix
            parent.children.set(this.text[position], leaf)
            break
          }
          let common = 0
          while (child.start + common < child.end && this.text[child.start + common] === this.text[position + common]) common += 1
          if (child.start + common === child.end) {
            parent = child
            position += common
            continue
          }
          const split = new SuffixNode(this.allocateId(), child.start, child.start + common)
          parent.children.set(this.text[position], split)
          child.start += common
          split.children.set(this.text[child.start], child)
          position += common
          const leaf = new SuffixNode(this.allocateId(), position, this.text.length)
          leaf.suffix = suffix
          split.children.set(this.text[position], leaf)
          break
        }
        this.emit(observer, this.root.id, `Insert suffix starting at ${suffix}, splitting compressed edges as needed.`, 'insert text[suffix..] using source-text edge ranges', 'split')
      }
      return { description: `Built the compressed suffix tree for '${text}' with a unique $ terminator. Construction is quadratic, not linear-time Ukkonen construction.` }
    }
    if (action !== 'search-value') throw new RangeError('Unsupported suffix action')
    const word = this.word(input)
    let parent = this.root
    let position = 0
    while (position < word.length) {
      const child = parent.children.get(word[position])
      if (!child) return { description: `'${word}' does not occur in the text.`, returnValue: [] }
      this.emit(observer, child.id, 'Match the pattern along a compressed source-text edge.', 'compare pattern with text[edge.start..edge.end)', 'compare')
      let offset = child.start
      while (offset < child.end && position < word.length) {
        if (this.text[offset++] !== word[position++]) return { description: `'${word}' does not occur in the text.`, returnValue: [] }
      }
      parent = child
    }
    const positions: number[] = []
    const collect = (node: SuffixNode): void => {
      this.emit(observer, node.id, 'Collect suffix indices below the matched pattern.', 'collect descendant suffix indices')
      if (node.suffix >= 0) positions.push(node.suffix)
      for (const child of node.children.values()) collect(child)
    }
    collect(parent)
    return { description: `'${word}' occurs at zero-based indices [${positions.join(', ')}].`, returnValue: positions, activeId: parent.id, status: 'MATCH' }
  }
}
