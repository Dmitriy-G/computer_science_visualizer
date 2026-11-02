import { ExtendedTreeModel } from '../ExtendedTreeModel.ts'
import { AdditionalTreeModel } from '../../../../visualization/AdditionalTreeModel.ts'
import type { TreeDiagramEntry, TreeInputValues, TreeOperationResult } from '../../../../visualization/AdditionalTreeModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'
import type { TreeTraceObserver } from '../../../../visualization/TreeTrace.ts'
// Nodes are immutable, so versions and playback clones safely share unchanged branches.
class PersistentNode {
  public readonly id: string
  public readonly low: number
  public readonly high: number
  public readonly sum: bigint
  public readonly left: PersistentNode | null
  public readonly right: PersistentNode | null
  constructor(id: string, low: number, high: number, sum: bigint, left: PersistentNode | null = null, right: PersistentNode | null = null) {
    this.id = id
    this.low = low
    this.high = high
    this.sum = sum
    this.left = left
    this.right = right
  }
}
export class PersistentSegmentTree extends ExtendedTreeModel {
  public readonly kind = 'persistent-segment-tree'
  private roots: PersistentNode[] = []
  private size = 10
  public get length(): number { return this.size }
  public get versionCount(): number { return this.roots.length }
  constructor() {
    super()
    const build = (low: number, high: number): PersistentNode => {
      if (low === high) return new PersistentNode(this.allocateId(), low, high, BigInt(low + 1))
      const mid = Math.floor((low + high) / 2)
      const left = build(low, mid)
      const right = build(mid + 1, high)
      return new PersistentNode(this.allocateId(), low, high, left.sum + right.sum, left, right)
    }
    this.roots.push(build(0, this.size - 1))
  }
  public static createDefault(): PersistentSegmentTree { return new PersistentSegmentTree() }
  public clone(): PersistentSegmentTree {
    const copy = new PersistentSegmentTree()
    copy.roots = [...this.roots]
    copy.size = this.size
    copy.nextId = this.nextId
    return copy
  }
  public getDiagram(): TreeDiagramEntry[] {
    const entries: TreeDiagramEntry[] = []
    const seen = new Set<string>()
    const visit = (node: PersistentNode): void => {
      if (seen.has(node.id)) return
      seen.add(node.id)
      const children: string[] = []
      if (node.left) children.push(node.left.id)
      if (node.right) children.push(node.right.id)
      entries.push({ id: node.id, text: String(node.sum), label: `[${node.low}, ${node.high}]; immutable`, children })
      if (node.left) visit(node.left)
      if (node.right) visit(node.right)
    }
    for (let version = 0; version < this.roots.length; version += 1) {
      entries.push({ id: `persistent-version-${version}`, text: `v${version}`, label: 'version root', children: [this.roots[version].id] })
      visit(this.roots[version])
    }
    return entries
  }
  public execute(action: ActionKind, input: TreeInputValues, observer?: TreeTraceObserver): TreeOperationResult {
    if (action === 'clear') {
      const zero = (node: PersistentNode): PersistentNode => new PersistentNode(this.allocateId(), node.low, node.high, 0n, node.left ? zero(node.left) : null, node.right ? zero(node.right) : null)
      this.roots = [zero(this.roots[0])]
      this.emit(observer, this.roots[0].id, 'Discard versions and initialize one zero-valued version.', 'versions = [zeroTree]', 'remove')
      return { description: 'Reset the ten indexed values to zero and discarded all old versions.' }
    }
    const version = this.index(input, 'version', this.roots.length)
    if (action === 'update-index') {
      const index = this.index(input)
      const value = AdditionalTreeModel.integer(input, 'value')
      if (this.roots.length >= 8) throw new RangeError('This demonstration supports eight versions; clear or reset first')
      const update = (node: PersistentNode): PersistentNode => {
        this.emit(observer, node.id, 'Follow the selected version toward the updated leaf.', 'copy path; share the untouched child', 'compare')
        if (node.low === node.high) return new PersistentNode(this.allocateId(), node.low, node.high, BigInt(value))
        let left = node.left!
        let right = node.right!
        if (index <= left.high) left = update(left)
        else right = update(right)
        return new PersistentNode(this.allocateId(), node.low, node.high, left.sum + right.sum, left, right)
      }
      const root = update(this.roots[version])
      this.roots.push(root)
      this.emit(observer, root.id, `Publish version ${this.roots.length - 1}; earlier versions retain their nodes.`, 'versions.push(newRoot)', 'connect')
      return { description: `Created v${this.roots.length - 1} from v${version}: index ${index} = ${value}. Only the root-to-leaf path was allocated.` }
    }
    if (action !== 'range-sum') throw new RangeError('Unsupported persistent-tree action')
    const minimum = this.index(input, 'minimum')
    const maximum = this.index(input, 'maximum')
    if (minimum > maximum) throw new RangeError('Minimum index exceeds maximum')
    const query = (node: PersistentNode): bigint => {
      if (node.high < minimum || maximum < node.low) return 0n
      this.emit(observer, node.id, `Inspect v${version} segment [${node.low}, ${node.high}].`, 'covered ? node.sum : query children', 'compare')
      if (minimum <= node.low && node.high <= maximum) return node.sum
      return query(node.left!) + query(node.right!)
    }
    const sum = query(this.roots[version])
    return { description: `v${version} sum on [${minimum}, ${maximum}] is ${sum}.`, returnValue: sum }
  }
}
