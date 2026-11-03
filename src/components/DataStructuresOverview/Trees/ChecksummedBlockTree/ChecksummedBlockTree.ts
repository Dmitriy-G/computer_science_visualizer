import { AppliedModel } from '../../../../visualization/AppliedModel.ts'
import type { AppliedDiagram, DiagramItem } from '../../../../visualization/AppliedModel.ts'
import { LinearModel } from '../../../../visualization/LinearModel.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'
import { SHA256 } from '../MerkleTree/SHA256.ts'

interface BlockPointer {
  readonly block: DataBlock
  readonly checksum: string
  readonly size: number
}

interface DataBlock {
  readonly id: number
  value: number | null
  readonly children: readonly BlockPointer[]
}

export class ChecksummedBlockTree extends AppliedModel {
  public readonly kind = 'checksummed-block-tree'
  public readonly representation = 'Ten data blocks under fanout-four indirect blocks. Every parent pointer stores the child block ID, serialized byte length, and SHA-256 checksum. Updates copy the ancestor path; corruption changes bytes without repairing pointers. This is not the ZFS disk format, allocator, RAID repair, or deduplication.'
  public readonly countLabel = 'data blocks'
  private nextId = 1
  private root: BlockPointer
  constructor() {
    super()
    this.root = this.build(Array.from({ length: 10 }, (_, index) => index + 1))
  }
  public get length(): number { return 10 }
  public get rootChecksum(): string { return this.root.checksum }
  public static createDefault(): ChecksummedBlockTree { return new ChecksummedBlockTree() }
  private bytes(block: DataBlock): Uint8Array {
    const content = block.children.length
      ? { children: block.children.map((pointer) => ({ id: pointer.block.id, size: pointer.size, checksum: pointer.checksum })) }
      : { value: block.value }
    return new TextEncoder().encode(JSON.stringify(content))
  }
  private pointer(block: DataBlock): BlockPointer {
    const bytes = this.bytes(block)
    return { block, size: bytes.length, checksum: SHA256.digest(bytes) }
  }
  private build(values: readonly number[]): BlockPointer {
    let level = values.map((value) => this.pointer({ id: this.nextId++, value, children: [] }))
    while (level.length > 1) {
      const parents: BlockPointer[] = []
      for (let index = 0; index < level.length; index += 4) parents.push(this.pointer({ id: this.nextId++, value: null, children: level.slice(index, index + 4) }))
      level = parents
    }
    return level[0]
  }
  public clone(): ChecksummedBlockTree {
    const copy = new ChecksummedBlockTree()
    const clonePointer = (pointer: BlockPointer): BlockPointer => ({ ...pointer, block: { id: pointer.block.id, value: pointer.block.value, children: pointer.block.children.map(clonePointer) } })
    copy.root = clonePointer(this.root)
    copy.nextId = this.nextId
    return copy
  }
  public getDiagram(): AppliedDiagram {
    const rows: DiagramItem[][] = []
    let leaf = 0
    const visit = (pointer: BlockPointer, depth: number): void => {
      rows[depth] ??= []
      const block = pointer.block
      rows[depth].push({ id: `block-${block.id}`, text: block.children.length ? pointer.checksum.slice(0, 12) : String(block.value), label: block.children.length ? `indirect ${block.id} / ${pointer.size} bytes` : `data index ${leaf++} / block ${block.id}`, children: block.children.map((child) => `block-${child.block.id}`) })
      for (const child of block.children) visit(child, depth + 1)
    }
    visit(this.root, 0)
    return { rows }
  }
  public execute(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    if (action === 'inspect-storage') return this.inspect(observer)
    if (action === 'clear') {
      this.root = this.build(new Array<number>(10).fill(0))
      return { description: `Reset ten data blocks to zero and rebuilt valid pointers. Root checksum ${this.rootChecksum}.` }
    }
    if (action === 'verify-proof') {
      let valid = true
      let firstMismatch: string | null = null
      const visit = (pointer: BlockPointer): void => {
        const bytes = this.bytes(pointer.block)
        const match = pointer.size === bytes.length && pointer.checksum === SHA256.digest(bytes)
        LinearModel.emit(observer, `block-${pointer.block.id}`, match ? `Block ${pointer.block.id} matches its parent pointer.` : `Checksum mismatch in block ${pointer.block.id}.`, 'compare stored size and checksum with actual block bytes', match ? 'VERIFIED' : 'CORRUPT')
        valid = valid && match
        if (!match && firstMismatch === null) firstMismatch = `block-${pointer.block.id}`
        for (const child of pointer.block.children) visit(child)
      }
      visit(this.root)
      return { description: valid ? 'Every block matches its expected pointer checksum and size.' : 'Corruption detected; no block was repaired.', value: valid, activeId: firstMismatch ?? `block-${this.root.block.id}`, status: valid ? 'VERIFIED' : 'CORRUPT' }
    }
    if (action !== 'update-index' && action !== 'corrupt-block') throw new RangeError('Unsupported checksum-tree action')
    const index = AppliedModel.bounded(input, 'index', 0, 9)
    const value = LinearModel.integer(input, 'value')
    if (action === 'corrupt-block') {
      let position = 0
      const corrupt = (pointer: BlockPointer): void => {
        if (!pointer.block.children.length) {
          if (position++ === index) {
            pointer.block.value = value
            LinearModel.emit(observer, `block-${pointer.block.id}`, `Change data index ${index} without updating its expected checksum.`, 'simulate changed bytes without pointer update', 'CORRUPT')
          }
        } else for (const child of pointer.block.children) corrupt(child)
      }
      corrupt(this.root)
      return { description: `Changed data index ${index} to ${value}; verification will detect any actual byte change.` }
    }
    let position = 0
    const update = (pointer: BlockPointer): BlockPointer => {
      if (!pointer.block.children.length) {
        return position++ === index ? this.pointer({ id: this.nextId++, value, children: [] }) : pointer
      }
      const children = pointer.block.children.map(update)
      if (children.every((child, offset) => child === pointer.block.children[offset])) return pointer
      return this.pointer({ id: this.nextId++, value: null, children })
    }
    this.root = update(this.root)
    LinearModel.emit(observer, `block-${this.root.block.id}`, 'Publish the copied path and updated root checksum; unchanged subtrees are shared.', 'copy modified leaf and ancestors; recompute pointers')
    return { description: `Updated data index ${index}. Root checksum ${this.rootChecksum}.` }
  }
}
