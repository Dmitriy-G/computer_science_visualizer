import { TreeTrace } from '../../../../visualization/TreeTrace.ts'
import type { MultiwayTreeEntry, TreeTraceObserver } from '../../../../visualization/TreeTrace.ts'

export type BTreeEntry = MultiwayTreeEntry

class BTreePage {
  public readonly id: string
  public keys: number[] = []
  public children: BTreePage[] = []

  constructor(id: string) { this.id = id }
}

export class BTree {
  private root: BTreePage | null = null
  private count = 0
  private nextId = 0

  public get length(): number { return this.count }

  public static createDefault(): BTree {
    const tree = new BTree()
    for (const value of [50, 20, 80, 10, 30, 60, 90, 40, 70, 100]) tree.insert(value)
    return tree
  }

  public find(value: number, observer?: TreeTraceObserver): { id: string; value: number } | null {
    TreeTrace.validate(value)
    let page: BTreePage | null = this.root
    while (page) {
      const index = this.locate(page, value, observer)
      if (page.keys[index] === value) return { id: page.id, value }
      page = page.children[index] ?? null
    }
    return null
  }

  public insert(value: number, observer?: TreeTraceObserver): boolean {
    TreeTrace.validate(value)
    if (this.find(value)) {
      this.find(value, observer)
      return false
    }
    if (!this.root) this.root = this.allocate()
    if (this.root.keys.length === 3) {
      const parent = this.allocate()
      parent.children.push(this.root)
      this.root = parent
      this.split(parent, 0, observer)
    }
    let page: BTreePage = this.root
    while (page.children.length) {
      let index = this.locate(page, value, observer)
      if (page.children[index].keys.length === 3) {
        this.split(page, index, observer)
        if (value > page.keys[index]) index += 1
      }
      page = page.children[index]
    }
    const index = this.locate(page, value, observer)
    page.keys.splice(index, 0, value)
    this.count += 1
    TreeTrace.emit(observer, 'create', page.id, 'Insert the pending key into a leaf', `Place ${value} in sorted order. Top-down splits ensure this leaf has room. Internal keys are stored values too.`, 'leaf.keys.insert(index, value)')
    return true
  }

  public deleteValue(value: number, observer?: TreeTraceObserver): boolean {
    TreeTrace.validate(value)
    if (!this.find(value)) {
      this.find(value, observer)
      return false
    }
    this.removeFrom(this.root!, value, observer)
    if (this.root!.keys.length === 0) {
      this.root = this.root!.children[0] ?? null
      TreeTrace.emit(observer, 'connect', this.root?.id ?? null, 'Collapse the empty root', 'Promote the only child, or make the tree empty after removing its final key.', 'root = root.children[0] ?? null')
    }
    return true
  }

  public clear(observer?: TreeTraceObserver): void {
    const stack: { page: BTreePage; parent: BTreePage | null; expanded: boolean }[] = []
    if (this.root) stack.push({ page: this.root, parent: null, expanded: false })
    while (stack.length) {
      const { page, parent, expanded } = stack.pop()!
      if (!expanded) {
        stack.push({ page, parent, expanded: true })
        for (let index = page.children.length - 1; index >= 0; index -= 1) stack.push({ page: page.children[index], parent: page, expanded: false })
      } else {
        this.count -= page.keys.length
        page.keys.length = 0
        if (parent) parent.children.splice(parent.children.indexOf(page), 1)
        else this.root = null
        TreeTrace.emit(observer, 'remove', parent?.id ?? null, 'Release a page', 'Release a page after its children. Clear does not perform per-key deletion or restore occupancy on a tree being discarded.', 'release page')
      }
    }
  }

  public getEntries(): BTreeEntry[] {
    const entries: BTreeEntry[] = []
    const stack: BTreePage[] = []
    if (this.root) stack.push(this.root)
    while (stack.length) {
      const page = stack.pop()!
      const childIds: string[] = []
      for (const child of page.children) childIds.push(child.id)
      entries.push({ id: page.id, keys: [...page.keys], childIds, leaf: page.children.length === 0 })
      for (let index = page.children.length - 1; index >= 0; index -= 1) stack.push(page.children[index])
    }
    return entries
  }

  public clone(): BTree {
    const copy = new BTree()
    const pages = new Map<string, BTreePage>()
    const entries = this.getEntries()
    for (const entry of entries) {
      const page = new BTreePage(entry.id)
      page.keys = [...entry.keys]
      pages.set(entry.id, page)
    }
    for (const entry of entries) {
      for (const id of entry.childIds) pages.get(entry.id)!.children.push(pages.get(id)!)
    }
    copy.root = entries[0] ? pages.get(entries[0].id)! : null
    copy.count = this.count
    copy.nextId = this.nextId
    return copy
  }

  private allocate(): BTreePage {
    const page = new BTreePage(`btree-page-${this.nextId}`)
    this.nextId += 1
    return page
  }

  private locate(page: BTreePage, value: number, observer?: TreeTraceObserver): number {
    let index = 0
    while (index < page.keys.length && value > page.keys[index]) index += 1
    TreeTrace.emit(observer, 'compare', page.id, `Compare within [${page.keys.join(', ')}]`, page.keys[index] === value ? 'The key is stored in this page. Duplicate insertion leaves the tree unchanged.' : `Choose child ${index}, or insert here if this is a leaf. Each page has at most three keys.`, 'index = first key >= value')
    return index
  }

  private split(parent: BTreePage, index: number, observer?: TreeTraceObserver): void {
    const left = parent.children[index]
    const right = this.allocate()
    right.keys = left.keys.splice(2)
    const median = left.keys.pop()!
    if (left.children.length) right.children = left.children.splice(2)
    parent.keys.splice(index, 0, median)
    parent.children.splice(index + 1, 0, right)
    TreeTrace.emit(observer, 'split', parent.id, 'Split a full page and promote the median', `Move ${median} to the parent. Keep smaller keys in the original page and larger keys in the new sibling. The median is removed from the child.`, 'split full child\nparent.keys.insert(median)')
  }

  private removeFrom(page: BTreePage, value: number, observer?: TreeTraceObserver): void {
    let index = this.locate(page, value, observer)
    if (page.keys[index] === value) {
      if (!page.children.length) {
        page.keys.splice(index, 1)
        this.count -= 1
        TreeTrace.emit(observer, 'remove', page.id, 'Remove the key from a leaf', `Remove ${value}. The descent ensured this non-root leaf had more than its minimum before deletion.`, 'leaf.keys.remove(value)')
      } else if (page.children[index].keys.length >= 2) {
        let predecessor = page.children[index]
        while (predecessor.children.length) predecessor = predecessor.children[predecessor.children.length - 1]
        const replacement = predecessor.keys[predecessor.keys.length - 1]
        page.keys[index] = replacement
        TreeTrace.emit(observer, 'connect', page.id, 'Replace with the predecessor', 'Copy the greatest key from the left subtree into this position, then delete its old leaf occurrence.', 'page.key = predecessor.key')
        this.removeFrom(page.children[index], replacement, observer)
      } else if (page.children[index + 1].keys.length >= 2) {
        let successor = page.children[index + 1]
        while (successor.children.length) successor = successor.children[0]
        const replacement = successor.keys[0]
        page.keys[index] = replacement
        TreeTrace.emit(observer, 'connect', page.id, 'Replace with the successor', 'Copy the least key from the right subtree into this position, then delete its old leaf occurrence.', 'page.key = successor.key')
        this.removeFrom(page.children[index + 1], replacement, observer)
      } else {
        this.merge(page, index, observer)
        this.removeFrom(page.children[index], value, observer)
      }
      return
    }
    if (!page.children.length) return
    if (page.children[index].keys.length === 1) {
      if (index > 0 && page.children[index - 1].keys.length >= 2) this.borrowLeft(page, index, observer)
      else if (index < page.children.length - 1 && page.children[index + 1].keys.length >= 2) this.borrowRight(page, index, observer)
      else if (index < page.children.length - 1) this.merge(page, index, observer)
      else {
        this.merge(page, index - 1, observer)
        index -= 1
      }
    }
    this.removeFrom(page.children[index], value, observer)
  }

  private borrowLeft(parent: BTreePage, index: number, observer?: TreeTraceObserver): void {
    const page = parent.children[index]
    const sibling = parent.children[index - 1]
    page.keys.unshift(parent.keys[index - 1])
    parent.keys[index - 1] = sibling.keys.pop()!
    if (sibling.children.length) page.children.unshift(sibling.children.pop()!)
    TreeTrace.emit(observer, 'borrow', page.id, 'Borrow from the left sibling', 'Move the parent separator down and the sibling maximum up. Move its last child pointer as well for internal pages.', 'rotate left sibling key through parent')
  }

  private borrowRight(parent: BTreePage, index: number, observer?: TreeTraceObserver): void {
    const page = parent.children[index]
    const sibling = parent.children[index + 1]
    page.keys.push(parent.keys[index])
    parent.keys[index] = sibling.keys.shift()!
    if (sibling.children.length) page.children.push(sibling.children.shift()!)
    TreeTrace.emit(observer, 'borrow', page.id, 'Borrow from the right sibling', 'Move the parent separator down and the sibling minimum up. Move its first child pointer as well for internal pages.', 'rotate right sibling key through parent')
  }

  private merge(parent: BTreePage, index: number, observer?: TreeTraceObserver): void {
    const left = parent.children[index]
    const right = parent.children[index + 1]
    left.keys.push(parent.keys.splice(index, 1)[0], ...right.keys)
    left.children.push(...right.children)
    parent.children.splice(index + 1, 1)
    TreeTrace.emit(observer, 'merge', left.id, 'Merge siblings through the parent separator', 'Combine two minimum-size pages and their separating parent key into one three-key page. Continue deletion inside the merged page.', 'left = left + parent.separator + right\nrelease right')
  }
}
