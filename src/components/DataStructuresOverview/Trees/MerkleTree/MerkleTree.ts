import { ExtendedTreeModel } from '../ExtendedTreeModel.ts'
import { AdditionalTreeModel } from '../../../../visualization/AdditionalTreeModel.ts'
import type { TreeDiagramEntry, TreeInputValues, TreeOperationResult } from '../../../../visualization/AdditionalTreeModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'
import type { TreeTraceObserver } from '../../../../visualization/TreeTrace.ts'
import { SHA256 } from './SHA256.ts'
export class MerkleTree extends ExtendedTreeModel {
  public readonly kind = 'merkle-tree'
  private values: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  private hashes: string[] = new Array<string>(32).fill('')
  public get length(): number { return this.values.length }
  constructor() { super()
    this.rebuild()
  }
  public static createDefault(): MerkleTree { return new MerkleTree() }
  public get rootHash(): string { return this.hashes[1] }
  private rebuild(): void {
    for (let index = 0; index < 16; index += 1) this.hashes[16 + index] = SHA256.leaf(index < this.length ? String(this.values[index]) : '')
    for (let index = 15; index >= 1; index -= 1) this.hashes[index] = SHA256.parent(this.hashes[2 * index], this.hashes[2 * index + 1])
  }
  public clone(): MerkleTree {
    const copy = new MerkleTree()
    copy.values = [...this.values]
    copy.hashes = [...this.hashes]
    return copy
  }
  public getDiagram(): TreeDiagramEntry[] {
    const entries: TreeDiagramEntry[] = []
    for (let index = 1; index < 32; index += 1) entries.push({ id: `merkle-${index}`, text: this.hashes[index].slice(0, 12), label: index === 1 ? 'SHA-256 root' : index < 16 ? 'internal hash' : index - 16 < this.length ? `leaf ${index - 16}: ${this.values[index - 16]}` : 'padding: empty bytes', children: index < 16 ? [`merkle-${2 * index}`, `merkle-${2 * index + 1}`] : [], width: 150 })
    return entries
  }
  public execute(action: ActionKind, input: TreeInputValues, observer?: TreeTraceObserver): TreeOperationResult {
    if (action === 'clear') {
      this.values.fill(0)
      this.rebuild()
      this.emit(observer, 'merkle-1', 'Reset data values to zero and recompute hashes.', 'rebuild zero-valued leaves', 'connect')
      return { description: `Reset ten values to zero. Root: ${this.rootHash}.` }
    }
    const index = this.index(input)
    const value = AdditionalTreeModel.integer(input, 'value')
    let position = 16 + index
    if (action === 'update-index') {
      this.values[index] = value
      this.hashes[position] = SHA256.leaf(String(value))
      this.emit(observer, `merkle-${position}`, 'Hash the leaf with the 0x00 domain prefix.', 'leaf = SHA256(0x00 || UTF8(value))', 'connect')
      while (position > 1) {
        position = Math.floor(position / 2)
        this.hashes[position] = SHA256.parent(this.hashes[2 * position], this.hashes[2 * position + 1])
        this.emit(observer, `merkle-${position}`, 'Rehash this ancestor from its ordered children.', 'parent = SHA256(0x01 || leftHash || rightHash)', 'connect')
      }
      return { description: `Updated leaf ${index}. Root: ${this.rootHash}. Only the ancestor path was rehashed.` }
    }
    if (action !== 'verify-proof') throw new RangeError('Unsupported Merkle action')
    let hash = SHA256.leaf(String(value))
    while (position > 1) {
      const sibling = position % 2 === 0 ? position + 1 : position - 1
      this.emit(observer, `merkle-${sibling}`, 'Read the sibling hash in the inclusion proof.', 'hash = hash ordered pair(current, sibling)')
      hash = position % 2 === 0 ? SHA256.parent(hash, this.hashes[sibling]) : SHA256.parent(this.hashes[sibling], hash)
      position = Math.floor(position / 2)
    }
    const valid = hash === this.rootHash
    return { description: `Proof for value ${value} at leaf ${index}: ${valid ? 'valid' : 'invalid'}. Reconstructed root ${hash}.`, returnValue: valid, activeId: 'merkle-1', status: valid ? 'VALID PROOF' : 'INVALID PROOF' }
  }
}
