import { AdditionalTreeModel } from '../../../../visualization/AdditionalTreeModel.ts'
import type { TreeDiagramEntry, TreeInputValues, TreeOperationResult } from '../../../../visualization/AdditionalTreeModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'
import { TreeTrace } from '../../../../visualization/TreeTrace.ts'
import type { TreeTraceObserver } from '../../../../visualization/TreeTrace.ts'

export class Rectangle {
  public readonly minX: number
  public readonly minY: number
  public readonly maxX: number
  public readonly maxY: number
  constructor(minX: number, minY: number, maxX: number, maxY: number) {
    for (const value of [minX, minY, maxX, maxY]) TreeTrace.validate(value)
    if (minX > maxX || minY > maxY) throw new RangeError('Rectangle minima must not exceed maxima')
    this.minX = minX
    this.minY = minY
    this.maxX = maxX
    this.maxY = maxY
  }
  public area(): bigint { return (BigInt(this.maxX) - BigInt(this.minX)) * (BigInt(this.maxY) - BigInt(this.minY)) }
  public union(other: Rectangle): Rectangle { return new Rectangle(Math.min(this.minX, other.minX), Math.min(this.minY, other.minY), Math.max(this.maxX, other.maxX), Math.max(this.maxY, other.maxY)) }
  public intersects(other: Rectangle): boolean { return this.minX <= other.maxX && this.maxX >= other.minX && this.minY <= other.maxY && this.maxY >= other.minY }
  public text(): string { return `[${this.minX},${this.minY}]-[${this.maxX},${this.maxY}]` }
}

interface SpatialItem {
  readonly id: string
  bounds: Rectangle
  readonly child: RPage | null
}
class RPage {
  public readonly id: string
  public readonly leaf: boolean
  public items: SpatialItem[] = []
  public parent: RPage | null = null
  constructor(id: string, leaf: boolean) {
    this.id = id
    this.leaf = leaf
  }
  public bounds(): Rectangle {
    let bounds = this.items[0].bounds
    for (let index = 1; index < this.items.length; index += 1) bounds = bounds.union(this.items[index].bounds)
    return bounds
  }
}

export interface SpatialRecord {
  readonly id: number
  readonly bounds: Rectangle
}

export class RTree extends AdditionalTreeModel {
  public readonly kind = 'r-tree'
  private nextPageId = 1
  private nextRecordId = 1
  private root = new RPage('r-page-0', true)
  private count = 0
  public get length(): number { return this.count }

  public static createDefault(): RTree {
    const result = new RTree()
    for (const [x, y] of [[1, 1], [3, 2], [5, 1], [7, 3], [9, 1], [2, 7], [4, 8], [6, 6], [8, 9], [10, 7]]) result.insert(new Rectangle(x, y, x + 2, y + 2))
    return result
  }

  public clone(): RTree {
    const result = new RTree()
    const copy = (page: RPage, parent: RPage | null): RPage => {
      const cloned = new RPage(page.id, page.leaf)
      cloned.parent = parent
      for (const item of page.items) cloned.items.push({ id: item.id, bounds: item.bounds, child: item.child ? copy(item.child, cloned) : null })
      return cloned
    }
    result.root = copy(this.root, null)
    result.count = this.count
    result.nextPageId = this.nextPageId
    result.nextRecordId = this.nextRecordId
    return result
  }

  private enlargement(bounds: Rectangle, added: Rectangle): bigint { return bounds.union(added).area() - bounds.area() }

  private split(page: RPage): RPage {
    const pool = [...page.items]
    let first = 0
    let second = 1
    let waste: bigint | null = null
    for (let left = 0; left < pool.length; left += 1) {
      for (let right = left + 1; right < pool.length; right += 1) {
        const difference = pool[left].bounds.union(pool[right].bounds).area() - pool[left].bounds.area() - pool[right].bounds.area()
        if (waste === null || difference > waste) {
          waste = difference
          first = left
          second = right
        }
      }
    }
    const sibling = new RPage(`r-page-${this.nextPageId++}`, page.leaf)
    sibling.parent = page.parent
    page.items = [pool[first]]
    sibling.items = [pool[second]]
    const remaining: SpatialItem[] = []
    for (let index = 0; index < pool.length; index += 1) if (index !== first && index !== second) remaining.push(pool[index])
    while (remaining.length) {
      if (page.items.length + remaining.length === 2) {
        page.items.push(...remaining)
        remaining.length = 0
        break
      }
      if (sibling.items.length + remaining.length === 2) {
        sibling.items.push(...remaining)
        remaining.length = 0
        break
      }
      let chosen = 0
      let preference = -1n
      for (let index = 0; index < remaining.length; index += 1) {
        const difference = this.enlargement(page.bounds(), remaining[index].bounds) - this.enlargement(sibling.bounds(), remaining[index].bounds)
        const absolute = difference < 0n ? -difference : difference
        if (absolute > preference) {
          preference = absolute
          chosen = index
        }
      }
      const item = remaining.splice(chosen, 1)[0]
      const firstGrowth = this.enlargement(page.bounds(), item.bounds)
      const secondGrowth = this.enlargement(sibling.bounds(), item.bounds)
      const target = firstGrowth < secondGrowth || firstGrowth === secondGrowth && (page.bounds().area() < sibling.bounds().area() || page.bounds().area() === sibling.bounds().area() && page.items.length <= sibling.items.length) ? page : sibling
      target.items.push(item)
    }
    for (const item of page.items) if (item.child) item.child.parent = page
    for (const item of sibling.items) if (item.child) item.child.parent = sibling
    return sibling
  }

  private insertItem(item: SpatialItem, observer?: TreeTraceObserver): void {
    let page = this.root
    while (!page.leaf) {
      let selected = page.items[0]
      for (const candidate of page.items) {
        const growth = this.enlargement(candidate.bounds, item.bounds)
        const best = this.enlargement(selected.bounds, item.bounds)
        if (growth < best || growth === best && candidate.bounds.area() < selected.bounds.area()) selected = candidate
      }
      TreeTrace.emit(observer, 'compare', selected.id, 'Choose least enlargement', `Descend into ${selected.id}, requiring the least bounding-area growth.`, 'choose child with minimum area enlargement')
      page = selected.child!
    }
    page.items.push(item)
    TreeTrace.emit(observer, 'create', item.id, 'Insert a rectangle', `Store rectangle ${item.bounds.text()} in a leaf.`, 'leaf.entries.push(rectangle)', item.id)
    let current: RPage | null = page
    while (current) {
      if (current.items.length > 4) {
        const sibling = this.split(current)
        if (!current.parent) {
          const root = new RPage(`r-page-${this.nextPageId++}`, false)
          root.items = [{ id: current.id, bounds: current.bounds(), child: current }, { id: sibling.id, bounds: sibling.bounds(), child: sibling }]
          current.parent = root
          sibling.parent = root
          this.root = root
        } else {
          const parent: RPage = current.parent
          const link = parent.items.find((entry) => entry.child === current)!
          link.bounds = current.bounds()
          parent.items.push({ id: sibling.id, bounds: sibling.bounds(), child: sibling })
        }
        TreeTrace.emit(observer, 'split', current.id, 'Split an overflowing page', 'Quadratic seeds and least enlargement form two pages with at least two entries each.', 'split 5 entries into pages of 2 and 3; repair parent')
      }
      if (current.parent) current.parent.items.find((entry) => entry.child === current)!.bounds = current.bounds()
      TreeTrace.emit(observer, 'connect', current.id, 'Refresh a bounding rectangle', `Update the covering rectangle for ${current.id}.`, 'parent.bounds = union(child.bounds)')
      current = current.parent
    }
  }

  public insert(bounds: Rectangle, observer?: TreeTraceObserver): number {
    const id = this.nextRecordId++
    this.insertItem({ id: `r-record-${id}`, bounds, child: null }, observer)
    this.count += 1
    return id
  }

  public search(bounds: Rectangle, observer?: TreeTraceObserver): readonly SpatialRecord[] {
    const result: SpatialRecord[] = []
    const visit = (page: RPage): void => {
      for (const item of page.items) {
        const intersects = item.bounds.intersects(bounds)
        TreeTrace.emit(observer, 'compare', item.id, intersects ? 'Intersecting bounding rectangle' : 'Prune a disjoint rectangle', `${item.bounds.text()} ${intersects ? 'intersects' : 'does not intersect'} the query.`, 'if intersects(entry.bounds, query): visit entry')
        if (!intersects) continue
        if (item.child) visit(item.child)
        else result.push({ id: Number(item.id.slice('r-record-'.length)), bounds: item.bounds })
      }
    }
    visit(this.root)
    return result
  }

  public delete(id: number, observer?: TreeTraceObserver): boolean {
    TreeTrace.validate(id)
    const find = (page: RPage): RPage | null => {
      for (const item of page.items) {
        TreeTrace.emit(observer, 'visit', item.id, 'Locate the rectangle ID', `Inspect ${item.id} for rectangle ID ${id}.`, 'scan entries for the requested record ID')
        if (item.child) {
          const found = find(item.child)
          if (found) return found
        } else if (item.id === `r-record-${id}`) return page
      }
      return null
    }
    const leaf = find(this.root)
    if (!leaf) return false
    let page: RPage = leaf
    page.items = page.items.filter((item) => item.id !== `r-record-${id}`)
    this.count -= 1
    TreeTrace.emit(observer, 'remove', page.id, 'Remove the record', `Remove rectangle ID ${id}.`, 'leaf.remove(record)')
    const orphans: SpatialItem[] = []
    const collect = (node: RPage): void => {
      for (const item of node.items) {
        if (item.child) collect(item.child)
        else orphans.push(item)
      }
    }
    while (page.parent) {
      const parent: RPage = page.parent
      if (page.items.length < 2) {
        parent.items = parent.items.filter((item) => item.child !== page)
        collect(page)
        TreeTrace.emit(observer, 'merge', parent.id, 'Condense an underfull page', 'Detach the underfull page and save its records for reinsertion.', 'detach page; collect orphan records')
      } else parent.items.find((item) => item.child === page)!.bounds = page.bounds()
      page = parent
    }
    while (!this.root.leaf && this.root.items.length === 1) {
      this.root = this.root.items[0].child!
      this.root.parent = null
    }
    if (!this.root.items.length) this.root = new RPage(`r-page-${this.nextPageId++}`, true)
    for (const item of orphans) this.insertItem(item, observer)
    return true
  }

  public clear(observer?: TreeTraceObserver): void {
    const release = (page: RPage): void => {
      while (page.items.length) {
        const item = page.items[page.items.length - 1]
        if (item.child) release(item.child)
        page.items.pop()
        TreeTrace.emit(observer, 'remove', page.id, 'Release a spatial entry', `Release ${item.id} after its children.`, 'release entry in postorder')
      }
    }
    release(this.root)
    this.root = new RPage(`r-page-${this.nextPageId++}`, true)
    this.count = 0
  }

  public getDiagram(): readonly TreeDiagramEntry[] {
    if (!this.root.items.length) return []
    const entries: TreeDiagramEntry[] = []
    const visit = (page: RPage): void => {
      const children: string[] = []
      for (const item of page.items) children.push(item.id)
      entries.push({ id: page.id, text: page.items.length ? page.bounds().text() : 'empty', label: `${page === this.root ? 'root / ' : ''}${page.leaf ? 'leaf page' : 'internal page'}`, children, width: 210 })
      for (const item of page.items) {
        if (item.child) visit(item.child)
        else entries.push({ id: item.id, text: item.bounds.text(), label: `rectangle ID ${item.id.slice('r-record-'.length)}`, children: [], width: 210 })
      }
    }
    visit(this.root)
    return entries
  }

  public execute(action: ActionKind, input: TreeInputValues, observer?: TreeTraceObserver): TreeOperationResult {
    if (action === 'clear') {
      this.clear(observer)
      return { description: 'All spatial records and pages released.' }
    }
    if (action === 'delete-value') {
      const id = AdditionalTreeModel.integer(input, 'id')
      return { description: this.delete(id, observer) ? `Deleted rectangle ID ${id}; condensed pages and reinserted orphan records.` : `Rectangle ID ${id} not found; unchanged.` }
    }
    const bounds = new Rectangle(AdditionalTreeModel.integer(input, 'minX'), AdditionalTreeModel.integer(input, 'minY'), AdditionalTreeModel.integer(input, 'maxX'), AdditionalTreeModel.integer(input, 'maxY'))
    if (action === 'insert') {
      const id = this.insert(bounds, observer)
      return { description: `Inserted rectangle ID ${id}: ${bounds.text()}.`, activeId: `r-record-${id}` }
    }
    const records = this.search(bounds, observer)
    const ids: number[] = []
    for (const record of records) ids.push(record.id)
    return { description: `Overlap query ${bounds.text()}: ${records.length ? `rectangle IDs ${ids.join(', ')}` : 'no matching rectangles'}. Touching boundaries count as overlap.`, returnValue: ids, activeId: records.length ? `r-record-${records[0].id}` : null, status: records.length ? 'MATCH' : 'NOT FOUND' }
  }
}
