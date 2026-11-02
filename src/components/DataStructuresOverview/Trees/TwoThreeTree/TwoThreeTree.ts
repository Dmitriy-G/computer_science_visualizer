import { ExtendedTreeModel } from '../ExtendedTreeModel.ts'
import { AdditionalTreeModel } from '../../../../visualization/AdditionalTreeModel.ts'
import type { TreeDiagramEntry, TreeInputValues, TreeOperationResult } from '../../../../visualization/AdditionalTreeModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'
import type { TreeTraceObserver } from '../../../../visualization/TreeTrace.ts'
class TwoThreePage {
  public keys: number[] = []
  public children: TwoThreePage[] = []
  public readonly id: string
  constructor(id: string) {
    this.id = id
  }
}
export class TwoThreeTree extends ExtendedTreeModel {
  public readonly kind = 'two-three-tree'
  private root: TwoThreePage | null = null
  private count = 0
  public get length(): number { return this.count }
  public static createDefault(): TwoThreeTree {
    const tree = new TwoThreeTree()
    for (const key of [50, 20, 80, 10, 30, 60, 90, 40, 70, 100]) tree.execute('insert', { key })
    return tree
  }
  public clone(): TwoThreeTree {
    const copy = new TwoThreeTree()
    const visit = (page: TwoThreePage): TwoThreePage => {
      const target = new TwoThreePage(page.id)
      target.keys = [...page.keys]
      for (const child of page.children) target.children.push(visit(child))
      return target
    }
    copy.root = this.root ? visit(this.root) : null
    copy.count = this.count
    copy.nextId = this.nextId
    return copy
  }
  public getDiagram(): TreeDiagramEntry[] {
    const entries: TreeDiagramEntry[] = []
    const visit = (page: TwoThreePage): void => {
      const children: string[] = []
      for (const child of page.children) children.push(child.id)
      entries.push({ id: page.id, text: page.keys.join(' | '), label: `${page.keys.length + 1}-node; ${children.length ? 'internal' : 'leaf'}`, children, width: Math.max(110, page.keys.join(' | ').length * 10 + 24) })
      for (const child of page.children) visit(child)
    }
    if (this.root) visit(this.root)
    return entries
  }
  private insert(page: TwoThreePage, key: number): { median: number
    right: TwoThreePage } | null {
    let index = 0
    while (index < page.keys.length && page.keys[index] < key) index += 1
    if (!page.children.length) page.keys.splice(index, 0, key)
    else {
      const split = this.insert(page.children[index], key)
      if (split) {
        page.keys.splice(index, 0, split.median)
        page.children.splice(index + 1, 0, split.right)
      }
    }
    if (page.keys.length <= 2) return null
    const right = new TwoThreePage(this.allocateId())
    right.keys = [page.keys[2]]
    const median = page.keys[1]
    page.keys = [page.keys[0]]
    if (page.children.length) right.children = page.children.splice(2)
    return { median, right }
  }
  public execute(action: ActionKind, input: TreeInputValues, observer?: TreeTraceObserver): TreeOperationResult {
    if (action === 'clear') {
      this.root = null
      this.count = 0
      this.emit(observer, null, 'Release all 2-3 pages.', 'root = null', 'remove')
      return { description: 'The 2-3 tree is empty.' }
    }
    if (action !== 'insert' && action !== 'search-value') throw new RangeError('Unsupported 2-3 tree action')
    const key = AdditionalTreeModel.integer(input, 'key')
    let page = this.root
    while (page) {
      this.emit(observer, page.id, `Compare ${key} within [${page.keys.join(', ')}].`, 'choose first separator >= key', 'compare')
      let index = 0
      while (index < page.keys.length && page.keys[index] < key) index += 1
      if (page.keys[index] === key) return { description: action === 'insert' ? 'Duplicate key rejected.' : `Found ${key} in ${page.id}, slot ${index}.`, returnValue: true, activeId: page.id, status: 'FOUND' }
      page = page.children[index] ?? null
    }
    if (action === 'search-value') return { description: `Key ${key} is absent.`, returnValue: false }
    this.capacity()
    if (!this.root) this.root = new TwoThreePage(this.allocateId())
    const split = this.insert(this.root, key)
    if (split) {
      const root = new TwoThreePage(this.allocateId())
      root.keys = [split.median]
      root.children = [this.root, split.right]
      this.root = root
    }
    this.count += 1
    this.emit(observer, this.root.id, 'Split overflowing three-key pages upward, promoting their middle key.', 'insert leaf; propagate splits; split root if needed', 'split')
    return { description: `Inserted ${key}; every page has one or two keys and leaves have equal depth.` }
  }
}
