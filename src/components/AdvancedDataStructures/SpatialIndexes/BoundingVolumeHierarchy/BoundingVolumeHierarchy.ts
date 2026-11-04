import { ExtendedTreeModel } from '../../../../visualization/ExtendedTreeModel.ts'
import { AdditionalTreeModel } from '../../../../visualization/AdditionalTreeModel.ts'
import type { TreeDiagramEntry, TreeInputValues, TreeOperationResult } from '../../../../visualization/AdditionalTreeModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'
import type { TreeTraceObserver } from '../../../../visualization/TreeTrace.ts'
class BVHNode {
  public left: BVHNode | null = null
  public right: BVHNode | null = null
  public readonly id: string
  public box: readonly number[]
  public readonly record: number | null
  constructor(id: string, box: readonly number[], record: number | null) {
    this.id = id
    this.box = box
    this.record = record
  }
}
export class BoundingVolumeHierarchy extends ExtendedTreeModel {
  public readonly kind = 'bvh'
  private root: BVHNode | null = null
  private count = 0
  private nextRecord = 1
  public get length(): number { return this.count }
  public static createDefault(): BoundingVolumeHierarchy {
    const tree = new BoundingVolumeHierarchy()
    for (let index = 0; index < 10; index += 1) tree.execute('insert', { minX: index * 3, minY: (index % 3) * 5, maxX: index * 3 + 2, maxY: (index % 3) * 5 + 3 })
    return tree
  }
  public clone(): BoundingVolumeHierarchy {
    const copy = new BoundingVolumeHierarchy()
    const visit = (node: BVHNode | null): BVHNode | null => {
      if (!node) return null
      const target = new BVHNode(node.id, [...node.box], node.record)
      target.left = visit(node.left)
      target.right = visit(node.right)
      return target
    }
    copy.root = visit(this.root)
    copy.count = this.count
    copy.nextId = this.nextId
    copy.nextRecord = this.nextRecord
    return copy
  }
  private union(a: readonly number[], b: readonly number[]): number[] { return [Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[2], b[2]), Math.max(a[3], b[3])] }
  private area(box: readonly number[]): bigint { return (BigInt(box[2]) - BigInt(box[0])) * (BigInt(box[3]) - BigInt(box[1])) }
  public getDiagram(): TreeDiagramEntry[] {
    const entries: TreeDiagramEntry[] = []
    const visit = (node: BVHNode | null): void => {
      if (!node) return
      const children: string[] = []
      if (node.left) children.push(node.left.id)
      if (node.right) children.push(node.right.id)
      const text = `${node.box[0]},${node.box[1]} : ${node.box[2]},${node.box[3]}`
      entries.push({ id: node.id, text, label: node.record === null ? 'bounding AABB' : `rectangle ${node.record}`, children, width: Math.max(170, text.length * 10 + 24) })
      visit(node.left)
      visit(node.right)
    }
    visit(this.root)
    return entries
  }
  public execute(action: ActionKind, input: TreeInputValues, observer?: TreeTraceObserver): TreeOperationResult {
    if (action === 'clear') {
      this.root = null
      this.count = 0
      this.emit(observer, null, 'Release bounding boxes and primitive leaves.', 'root = null', 'remove')
      return { description: 'The BVH is empty.' }
    }
    const box: number[] = []
    for (const name of ['minX', 'minY', 'maxX', 'maxY']) box.push(AdditionalTreeModel.integer(input, name))
    if (box[0] > box[2] || box[1] > box[3]) throw new RangeError('Minimum exceeds maximum')
    if (action === 'insert') {
      this.capacity()
      const leaf = new BVHNode(this.allocateId(), box, this.nextRecord++)
      const insert = (node: BVHNode): BVHNode => {
        this.emit(observer, node.id, 'Choose the child requiring less bounding-area enlargement.', 'descend by minimum AABB enlargement', 'compare')
        if (node.record !== null) {
          const parent = new BVHNode(this.allocateId(), this.union(node.box, box), null)
          parent.left = node
          parent.right = leaf
          return parent
        }
        const leftCost = this.area(this.union(node.left!.box, box)) - this.area(node.left!.box)
        const rightCost = this.area(this.union(node.right!.box, box)) - this.area(node.right!.box)
        if (leftCost <= rightCost) node.left = insert(node.left!)
        else node.right = insert(node.right!)
        node.box = this.union(node.left!.box, node.right!.box)
        return node
      }
      this.root = this.root ? insert(this.root) : leaf
      this.count += 1
      this.emit(observer, leaf.id, 'Pair the primitive with a sibling and refit ancestor bounds.', 'newParent = union(sibling, newLeaf)', 'connect')
      return { description: `Inserted rectangle ${leaf.record}; this 2D AABB hierarchy uses incremental insertion without balancing.` }
    }
    if (action !== 'search-overlap') throw new RangeError('Unsupported BVH action')
    const matches: number[] = []
    let activeId: string | null = null
    const visit = (node: BVHNode | null): void => {
      if (!node) return
      this.emit(observer, node.id, 'Test bounding-box overlap before visiting children.', 'disjoint ? prune : visit children', 'compare')
      if (node.box[0] > box[2] || node.box[2] < box[0] || node.box[1] > box[3] || node.box[3] < box[1]) return
      if (node.record !== null) {
        matches.push(node.record)
        activeId = node.id
      }
      else {
        visit(node.left)
        visit(node.right)
      }
    }
    visit(this.root)
    return { description: `Overlapping rectangle IDs: [${matches.join(', ')}].`, returnValue: matches, activeId, status: matches.length ? 'MATCH' : 'NO MATCH' }
  }
}
