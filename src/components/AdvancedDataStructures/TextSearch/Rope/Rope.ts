import { LinearModel } from '../../../../visualization/LinearModel.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'

export interface RopeNode {
  readonly id: string
  readonly text: string
  readonly left: RopeNode | null
  readonly right: RopeNode | null
  readonly length: number
  readonly height: number
  readonly weight: number
}

export class Rope extends LinearModel {
  public readonly kind = 'rope'
  public static readonly chunkSize = 4
  private root: RopeNode | null = null
  private nextId = 1
  public get length(): number { return this.root?.length ?? 0 }
  public getRoot(): RopeNode | null { return this.root }

  public static createDefault(): Rope {
    const model = new Rope()
    model.root = model.build('structures')
    return model
  }

  public clone(): Rope {
    const model = new Rope()
    model.root = this.root
    model.nextId = this.nextId
    return model
  }

  public getText(node: RopeNode | null = this.root): string {
    if (!node) return ''
    return node.left ? this.getText(node.left) + this.getText(node.right) : node.text
  }

  private leaf(text: string): RopeNode | null {
    return text ? { id: `rope-${this.nextId++}`, text, left: null, right: null, length: text.length, weight: text.length, height: 1 } : null
  }

  private branch(left: RopeNode, right: RopeNode): RopeNode {
    return { id: `rope-${this.nextId++}`, text: '', left, right, length: left.length + right.length, weight: left.length, height: 1 + Math.max(left.height, right.height) }
  }

  private balance(left: RopeNode, right: RopeNode): RopeNode {
    if (left.height > right.height + 1) {
      const a = left.left!
      const b = left.right!
      if (a.height >= b.height) return this.branch(a, this.branch(b, right))
      return this.branch(this.branch(a, b.left!), this.branch(b.right!, right))
    }
    if (right.height > left.height + 1) {
      const b = right.left!
      const c = right.right!
      if (c.height >= b.height) return this.branch(this.branch(left, b), c)
      return this.branch(this.branch(left, b.left!), this.branch(b.right!, c))
    }
    return this.branch(left, right)
  }

  private join(left: RopeNode | null, right: RopeNode | null): RopeNode | null {
    if (!left) return right
    if (!right) return left
    if (left.height > right.height + 1) return this.balance(left.left!, this.join(left.right, right)!)
    if (right.height > left.height + 1) return this.balance(this.join(left, right.left)!, right.right!)
    return this.branch(left, right)
  }

  private build(text: string, start = 0, end = text.length): RopeNode | null {
    if (end - start <= Rope.chunkSize) return this.leaf(text.slice(start, end))
    const middle = Math.floor((start + end) / 2)
    return this.join(this.build(text, start, middle), this.build(text, middle, end))
  }

  private split(node: RopeNode | null, index: number, observer?: LinearObserver): [RopeNode | null, RopeNode | null] {
    if (!node) return [null, null]
    LinearModel.emit(observer, node.id, `Split at local offset ${index}; this subtree contains ${node.length} characters.`, 'compare offset with node.weight')
    if (index === 0) return [null, node]
    if (index === node.length) return [node, null]
    if (!node.left) return [this.leaf(node.text.slice(0, index)), this.leaf(node.text.slice(index))]
    if (index < node.weight) {
      const [left, right] = this.split(node.left, index, observer)
      return [left, this.join(right, node.right)]
    }
    const [left, right] = this.split(node.right, index - node.weight, observer)
    return [this.join(node.left, left), right]
  }

  public execute(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    if (action === 'clear') {
      this.root = null
      LinearModel.emit(observer, null, 'Drop this rope root. Shared immutable nodes are reclaimed when no snapshot or rope references them.', 'root = null')
      return { description: 'The rope is empty. Unreachable nodes are reclaimed by JavaScript garbage collection.' }
    }
    const index = action === 'concatenate' ? this.length : LinearModel.integer(input, 'index')
    if (action === 'search-index') {
      LinearModel.index(index, this.length)
      let offset = index
      let node = this.root!
      while (node.left) {
        LinearModel.emit(observer, node.id, `Offset ${offset}, left weight ${node.weight}: descend ${offset < node.weight ? 'left' : 'right'}.`, 'if offset < weight: go left\nelse: offset -= weight; go right')
        if (offset < node.weight) node = node.left
        else { offset -= node.weight; node = node.right! }
      }
      return { description: `Character at index ${index} is ${JSON.stringify(node.text[offset])}, leaf offset ${offset}.`, activeId: node.id, status: 'FOUND', value: node.text[offset] }
    }
    if (action === 'insert' || action === 'concatenate') {
      LinearModel.index(index, this.length, true)
      const text = LinearModel.text(input)
      if (this.length + text.length > LinearModel.maximumTextLength) return { description: 'Insertion rejected: this teaching example allows 256 characters.' }
      const [left, right] = this.split(this.root, index, observer)
      this.root = this.join(this.join(left, this.build(text)), right)
      LinearModel.emit(observer, this.root?.id ?? null, 'Join the prefix, new text chunks, and suffix; AVL joins restore balance and update weights.', 'root = join(join(prefix, build(text)), suffix)', 'NEW')
      return { description: `${action === 'concatenate' ? 'Appended' : 'Inserted'} ${JSON.stringify(text)} at index ${index}.`, activeId: this.root?.id }
    }
    if (action !== 'delete-index') throw new RangeError('Unsupported rope action')
    const count = LinearModel.integer(input, 'count')
    LinearModel.index(index, this.length)
    if (count < 1 || count > this.length - index) throw new RangeError('Deletion extends past the text')
    const [left, suffix] = this.split(this.root, index, observer)
    const [, right] = this.split(suffix, count)
    this.root = this.join(left, right)
    LinearModel.emit(observer, this.root?.id ?? null, 'Discard the selected middle span and join the surviving sides with updated weights.', 'prefix, rest = split(root, index)\nremoved, suffix = split(rest, count)\nroot = join(prefix, suffix)')
    return { description: `Deleted ${count} characters at index ${index}.`, activeId: this.root?.id }
  }
}
