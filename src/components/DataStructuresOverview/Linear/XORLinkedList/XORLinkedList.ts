import { LinearModel } from '../../../../visualization/LinearModel.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'

export interface XORNode {
  readonly address: number
  readonly value: number
  link: bigint
}

export class XORLinkedList extends LinearModel {
  public readonly kind = 'xor-linked-list'
  private readonly nodes = new Map<number, XORNode>()
  private head = 0
  private tail = 0
  private nextAddress = 1
  public get length(): number { return this.nodes.size }

  public static createDefault(): XORLinkedList {
    const model = new XORLinkedList()
    for (let value = 10; value <= 100; value += 10) model.execute('insert-end', { value })
    return model
  }

  public getNodes(reverse = false): readonly XORNode[] {
    const entries: XORNode[] = []
    let previous = 0
    let address = reverse ? this.tail : this.head
    while (address) {
      const node = this.nodes.get(address)!
      entries.push({ ...node })
      const next = Number(BigInt(previous) ^ node.link)
      previous = address
      address = next
    }
    return entries
  }

  public clone(): XORLinkedList {
    const model = new XORLinkedList()
    for (const [address, node] of this.nodes) model.nodes.set(address, { ...node })
    model.head = this.head
    model.tail = this.tail
    model.nextAddress = this.nextAddress
    return model
  }

  private unlink(previous: number, node: XORNode): void {
    const next = Number(BigInt(previous) ^ node.link)
    if (previous) this.nodes.get(previous)!.link ^= BigInt(node.address) ^ BigInt(next)
    else this.head = next
    if (next) this.nodes.get(next)!.link ^= BigInt(node.address) ^ BigInt(previous)
    else this.tail = previous
    this.nodes.delete(node.address)
  }

  public execute(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    if (action === 'clear') {
      while (this.head) {
        const node = this.nodes.get(this.head)!
        this.unlink(0, node)
        LinearModel.emit(observer, this.head ? `xor-${this.head}` : null, `Release simulated address ${node.address} and repair the next head.`, 'next = 0 XOR head.link; next.link ^= head.address; release(head)')
      }
      return { description: 'The simulated address table and both endpoints are empty.' }
    }
    const value = LinearModel.integer(input, 'value')
    if (action === 'insert-end') {
      if (this.length >= LinearModel.maximumElements) return { description: 'Append rejected: this example allows 64 nodes.' }
      const address = this.nextAddress++
      const node = { address, value, link: BigInt(this.tail) }
      if (this.tail) this.nodes.get(this.tail)!.link ^= BigInt(address)
      else this.head = address
      this.nodes.set(address, node)
      this.tail = address
      LinearModel.emit(observer, `xor-${address}`, `Allocate simulated address ${address}; encode previous XOR next with next = 0.`, 'new.link = tail XOR 0\ntail.link ^= new.address; tail = new', 'NEW')
      return { description: `Appended ${value} at simulated address ${address}.`, activeId: `xor-${address}` }
    }
    if (action !== 'search-value' && action !== 'delete-value') throw new RangeError('Unsupported XOR-list action')
    let previous = 0
    let address = this.head
    let index = 0
    while (address) {
      const node = this.nodes.get(address)!
      const next = Number(BigInt(previous) ^ node.link)
      LinearModel.emit(observer, `xor-${address}`, `Index ${index}: next = ${previous} XOR ${node.link} = ${next}. Compare ${node.value} with ${value}.`, 'next = previous XOR current.link')
      if (node.value === value) {
        if (action === 'search-value') return { description: `Found ${value} at index ${index}, address ${address}.`, activeId: `xor-${address}`, status: 'FOUND', value: index }
        this.unlink(previous, node)
        LinearModel.emit(observer, next ? `xor-${next}` : previous ? `xor-${previous}` : null, 'Replace the removed address in both neighbors using XOR.', 'prev.link ^= current.address XOR next\nnext.link ^= current.address XOR prev')
        return { description: `Deleted the first ${value}; both traversal directions remain valid.` }
      }
      previous = address
      address = next
      index += 1
    }
    return { description: `${value} was not found.`, status: 'NOT FOUND', value: -1 }
  }
}
