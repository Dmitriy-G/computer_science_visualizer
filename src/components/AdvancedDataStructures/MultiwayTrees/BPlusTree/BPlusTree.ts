import { TreeTrace } from '../../../../visualization/TreeTrace.ts'
import type { MultiwayTreeEntry, TreeTraceObserver } from '../../../../visualization/TreeTrace.ts'

export type BPlusTreeEntry = MultiwayTreeEntry

class BPlusPage {
  public readonly id: string
  public readonly leaf: boolean
  public keys: number[] = []
  public children: BPlusPage[] = []
  public parent: BPlusPage | null = null
  public next: BPlusPage | null = null
  public minimum: number | null = null

  constructor(id: string, leaf: boolean) {
    this.id = id
    this.leaf = leaf
  }
}

export class BPlusTree {
  private root: BPlusPage | null = null
  private count = 0
  private nextId = 0

  public get length(): number { return this.count }

  public static createDefault(): BPlusTree {
    const tree = new BPlusTree()
    for (const value of [50, 20, 80, 10, 30, 60, 90, 40, 70, 100]) tree.insert(value)
    return tree
  }

  public find(value: number, observer?: TreeTraceObserver): { id: string; value: number } | null {
    const leaf = this.findLeaf(value, observer)
    if (!leaf || !leaf.keys.includes(value)) return null
    return { id: leaf.id, value }
  }

  public insert(value: number, observer?: TreeTraceObserver): boolean {
    TreeTrace.validate(value)
    if (!this.root) this.root = this.allocate(true)
    const leaf = this.findLeaf(value, observer)!
    let index = 0
    while (index < leaf.keys.length && leaf.keys[index] < value) index += 1
    if (leaf.keys[index] === value) return false
    leaf.keys.splice(index, 0, value)
    this.count += 1
    this.refreshUp(leaf)
    TreeTrace.emit(observer, 'create', leaf.id, 'Insert the pending leaf record', `Store ${value} in sorted order in the leaf. Internal separators are copies and do not count as extra records.`, 'leaf.records.insert(value)')
    let page: BPlusPage = leaf
    while (page.leaf ? page.keys.length > 3 : page.children.length > 4) {
      const right = this.allocate(page.leaf)
      if (page.leaf) {
        right.keys = page.keys.splice(2)
        right.next = page.next
        page.next = right
      } else {
        right.children = page.children.splice(3)
        for (const child of right.children) child.parent = right
      }
      this.refresh(page)
      this.refresh(right)
      let parent: BPlusPage | null = page.parent
      if (!parent) {
        parent = this.allocate(false)
        parent.children.push(page)
        page.parent = parent
        this.root = parent
      }
      const position = parent.children.indexOf(page)
      parent.children.splice(position + 1, 0, right)
      right.parent = parent
      this.refresh(parent)
      TreeTrace.emit(observer, 'split', parent.id, page.leaf ? 'Split a leaf and copy its separator up' : 'Split an internal page', page.leaf ? `Keep all records in the two leaves, repair their next links, and copy ${right.minimum} into the parent as a routing separator.` : 'Divide the child pointers between siblings and promote the boundary separator. All records remain in the leaves.', page.leaf ? 'split leaf\nright.next = left.next\nleft.next = right\nparent.separator = right.minimum' : 'split internal children\nrefresh parent separators')
      page = parent
    }
    return true
  }

  public deleteValue(value: number, observer?: TreeTraceObserver): boolean {
    const leaf = this.findLeaf(value, observer)
    const index = leaf?.keys.indexOf(value) ?? -1
    if (!leaf || index < 0) return false
    leaf.keys.splice(index, 1)
    this.count -= 1
    this.refreshUp(leaf)
    TreeTrace.emit(observer, 'remove', leaf.id, 'Remove the leaf record', `Remove ${value} from the leaf and refresh copied separator minima. Internal separators are not independent records.`, 'leaf.records.remove(value)\nrefresh ancestor separators')
    let page: BPlusPage = leaf
    while (page !== this.root && (page.leaf ? page.keys.length < 2 : page.children.length < 2)) {
      const parent: BPlusPage = page.parent!
      const position = parent.children.indexOf(page)
      const left = parent.children[position - 1]
      const right = parent.children[position + 1]
      if (left && (left.leaf ? left.keys.length > 2 : left.children.length > 2)) {
        if (page.leaf) page.keys.unshift(left.keys.pop()!)
        else {
          const child = left.children.pop()!
          page.children.unshift(child)
          child.parent = page
        }
        this.refresh(left)
        this.refresh(page)
        this.refresh(parent)
        TreeTrace.emit(observer, 'borrow', page.id, 'Borrow from the left sibling', 'Move the nearest record or child pointer from a sibling with spare occupancy, then update the copied parent separators.', 'borrow last record or child from left\nrefresh separators')
        break
      }
      if (right && (right.leaf ? right.keys.length > 2 : right.children.length > 2)) {
        if (page.leaf) page.keys.push(right.keys.shift()!)
        else {
          const child = right.children.shift()!
          page.children.push(child)
          child.parent = page
        }
        this.refresh(right)
        this.refresh(page)
        this.refresh(parent)
        TreeTrace.emit(observer, 'borrow', page.id, 'Borrow from the right sibling', 'Move the nearest record or child pointer from a sibling with spare occupancy, then update copied parent separators.', 'borrow first record or child from right\nrefresh separators')
        break
      }
      const survivor = left ?? page
      const removed = left ? page : right!
      if (survivor.leaf) {
        survivor.keys.push(...removed.keys)
        survivor.next = removed.next
        removed.next = null
      } else {
        survivor.children.push(...removed.children)
        for (const child of removed.children) child.parent = survivor
      }
      parent.children.splice(parent.children.indexOf(removed), 1)
      removed.parent = null
      this.refresh(survivor)
      this.refresh(parent)
      TreeTrace.emit(observer, 'merge', survivor.id, survivor.leaf ? 'Merge leaves and repair the next link' : 'Merge internal pages', survivor.leaf ? 'Concatenate the leaf records and bypass the removed leaf in the next chain. Remove its copied separator from the parent; do not insert that separator as a new record.' : 'Combine child pointers and recompute routing separators. Continue upward if the parent has too few children.', survivor.leaf ? 'left.records += right.records\nleft.next = right.next\nremove right from parent' : 'merge child pointers\nrefresh separators')
      page = parent
    }
    if (this.root && !this.root.leaf && this.root.children.length === 1) {
      this.root = this.root.children[0]
      this.root.parent = null
      TreeTrace.emit(observer, 'connect', this.root.id, 'Collapse the empty root', 'The only child becomes the root. All leaves remain at the same depth.', 'root = root.onlyChild')
    }
    if (this.root?.leaf && this.root.keys.length === 0) this.root = null
    return true
  }

  public range(lower: number, upper: number, observer?: TreeTraceObserver): number[] {
    TreeTrace.validate(lower)
    TreeTrace.validate(upper)
    if (upper < lower) throw new RangeError('Upper bound must be at least the lower bound')
    const result: number[] = []
    let leaf = this.findLeaf(lower, observer)
    while (leaf) {
      for (const value of leaf.keys) {
        if (value > upper) return result
        if (value >= lower) {
          result.push(value)
          TreeTrace.emit(observer, 'visit', leaf.id, `Report key ${value}`, `Key ${value} is inside the inclusive range. Report records from leaves only.`, 'if lower <= key <= upper: output key')
        }
      }
      leaf = leaf.next
      if (leaf) TreeTrace.emit(observer, 'connect', leaf.id, 'Follow the next leaf link', 'Continue the range scan without descending from the root again.', 'leaf = leaf.next')
    }
    return result
  }

  public clear(observer?: TreeTraceObserver): void {
    const stack: { page: BPlusPage; expanded: boolean }[] = []
    if (this.root) stack.push({ page: this.root, expanded: false })
    while (stack.length) {
      const { page, expanded } = stack.pop()!
      if (!expanded) {
        stack.push({ page, expanded: true })
        for (let index = page.children.length - 1; index >= 0; index -= 1) stack.push({ page: page.children[index], expanded: false })
      } else {
        if (page.leaf) this.count -= page.keys.length
        page.keys.length = 0
        page.next = null
        page.minimum = null
        const parent = page.parent
        if (parent) parent.children.splice(parent.children.indexOf(page), 1)
        else this.root = null
        page.parent = null
        TreeTrace.emit(observer, 'remove', parent?.id ?? null, 'Release a page and its leaf link', 'Discard each page after its children. Clear releases all records and routing pages without repeated per-key repairs.', 'release page and next link')
      }
    }
  }

  public getEntries(): BPlusTreeEntry[] {
    const entries: BPlusTreeEntry[] = []
    const stack: BPlusPage[] = []
    if (this.root) stack.push(this.root)
    while (stack.length) {
      const page = stack.pop()!
      const childIds: string[] = []
      for (const child of page.children) childIds.push(child.id)
      entries.push({ id: page.id, keys: [...page.keys], childIds, leaf: page.leaf, nextId: page.leaf ? page.next?.id ?? null : undefined })
      for (let index = page.children.length - 1; index >= 0; index -= 1) stack.push(page.children[index])
    }
    return entries
  }

  public clone(): BPlusTree {
    const copy = new BPlusTree()
    const pages = new Map<string, BPlusPage>()
    const entries = this.getEntries()
    for (const entry of entries) {
      const page = new BPlusPage(entry.id, entry.leaf)
      page.keys = [...entry.keys]
      pages.set(entry.id, page)
    }
    for (const entry of entries) {
      const page = pages.get(entry.id)!
      for (const id of entry.childIds) {
        const child = pages.get(id)!
        page.children.push(child)
        child.parent = page
      }
      page.next = entry.nextId ? pages.get(entry.nextId)! : null
    }
    for (let index = entries.length - 1; index >= 0; index -= 1) copy.refresh(pages.get(entries[index].id)!)
    copy.root = entries[0] ? pages.get(entries[0].id)! : null
    copy.count = this.count
    copy.nextId = this.nextId
    return copy
  }

  private allocate(leaf: boolean): BPlusPage {
    const page = new BPlusPage(`bplus-page-${this.nextId}`, leaf)
    this.nextId += 1
    return page
  }

  private findLeaf(value: number, observer?: TreeTraceObserver): BPlusPage | null {
    TreeTrace.validate(value)
    let page: BPlusPage | null = this.root
    while (page) {
      TreeTrace.emit(observer, 'compare', page.id, `Inspect ${page.leaf ? 'leaf' : 'separators'} [${page.keys.join(', ')}]`, page.leaf ? 'Records are stored only in leaves. Equal keys are not inserted twice.' : 'Separators copy the minimum of the right child. Equality follows the child to the right of that separator.', page.leaf ? 'search leaf records' : 'choose child after last separator <= key')
      if (page.leaf) return page
      let index = 0
      while (index < page.keys.length && value >= page.keys[index]) index += 1
      page = page.children[index]
    }
    return null
  }

  private refresh(page: BPlusPage): void {
    if (page.leaf) page.minimum = page.keys[0] ?? null
    else {
      page.minimum = page.children[0]?.minimum ?? null
      page.keys = []
      for (let index = 1; index < page.children.length; index += 1) page.keys.push(page.children[index].minimum!)
    }
  }

  private refreshUp(start: BPlusPage): void {
    let page: BPlusPage | null = start
    while (page) {
      this.refresh(page)
      page = page.parent
    }
  }
}
