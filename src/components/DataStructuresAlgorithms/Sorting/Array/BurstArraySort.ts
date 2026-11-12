import { ArraySortOperations } from './ArraySortOperations.ts'
import type { ArrayEntry } from '../../../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import type { ArraySortEvent, ArraySortFrame, ArraySortRun, ArraySortTrieNode } from './ArraySortTrace.ts'

class BurstContainer {
  public readonly id: string
  public readonly digit: string
  public readonly depth: number
  public readonly parent: BurstContainer | null
  public entries: ArrayEntry[] = []
  public children: Map<string, BurstContainer> | null = null
  public count = 0

  constructor(id: string, digit: string, parent: BurstContainer | null) {
    this.id = id
    this.digit = digit
    this.depth = parent ? parent.depth + 1 : 0
    this.parent = parent
  }

  public get prefix(): string {
    let prefix = ''
    let node: BurstContainer | null = this
    while (node?.parent) {
      prefix = node.digit + prefix
      node = node.parent
    }
    return prefix
  }
}

export class BurstArraySort extends ArraySortOperations {
  private readonly root = new BurstContainer('burst-0', '', null)
  private nextNodeId = 1
  private readonly keys = new Map<string, string>()
  private readonly digits = '0123456789abcdef'
  private width = 1
  private minimum = 0n
  private output: (ArrayEntry | null)[] | undefined

  public sort(): void {
    if (this.entries.length < 2) return
    this.minimum = BigInt(this.entries[0].value)
    let maximum = this.minimum
    for (const entry of this.entries) {
      const value = BigInt(entry.value)
      if (value < this.minimum) this.minimum = value
      if (value > maximum) maximum = value
    }
    this.width = (maximum - this.minimum).toString(16).length
    for (const entry of this.entries) this.keys.set(entry.id, (BigInt(entry.value) - this.minimum).toString(16).padStart(this.width, '0'))
    this.step('bounds', 'Encode order-preserving integer keys', `Subtract minimum ${this.minimum} and encode each offset as ${this.width} hexadecimal digits with leading zeroes. Lexicographic order now matches integer order. This is an integer adaptation of string Burstsort.`, 'key = hex(value - min).padStart(width, 0)')
    for (let index = 0; index < this.entries.length; index += 1) {
      const entry = this.entries[index]
      const key = this.keys.get(entry.id)!
      let node = this.root
      while (node.children) {
        node.count += 1
        node = this.child(node, key[node.depth])
      }
      node.entries.push(entry)
      node.count += 1
      this.step('distribute', 'Insert a record into its prefix container', `Key ${entry.value} encodes as ${key}. Follow existing prefix nodes and append its entry to the container at depth ${node.depth}.`, 'follow key prefix; container.push(entry)', { activeIndices: [index] }, node)
      if (node.entries.length > 3 && node.depth < this.width) this.burst(node)
    }
    const leaves: BurstContainer[] = []
    this.collect(this.root, leaves)
    for (const leaf of leaves) {
      if (leaf.depth === this.width) continue
      this.step('bucket-sort', 'Sort a bounded leaf container by its remaining suffix', 'A nonterminal container holds at most three records. Stable adjacent insertion exchanges compare only their unexamined key suffixes.', 'insertionSort(container, remaining suffix)', {}, leaf)
      for (let index = 1; index < leaf.entries.length; index += 1) {
        for (let position = index; position > 0; position -= 1) {
          const first = leaf.entries[position - 1]
          const second = leaf.entries[position]
          this.step('compare', 'Compare suffixes within a container', `Compare ${this.keys.get(first.id)!.slice(leaf.depth)} and ${this.keys.get(second.id)!.slice(leaf.depth)}. Equal suffixes retain their arrival order.`, 'compare remaining suffixes', {}, leaf, [position - 1, position])
          if (this.keys.get(first.id)!.slice(leaf.depth) <= this.keys.get(second.id)!.slice(leaf.depth)) break
          leaf.entries[position - 1] = second
          leaf.entries[position] = first
          this.step('swap', 'Exchange inverted suffix records', 'Exchange the two entry references inside this bounded container. Their original IDs are retained.', 'swap neighboring container entries', {}, leaf, [position - 1, position])
        }
      }
    }
    this.output = new Array<ArrayEntry | null>(this.entries.length).fill(null)
    let destination = 0
    for (const leaf of leaves) {
      for (let index = 0; index < leaf.entries.length; index += 1) {
        this.output[destination++] = leaf.entries[index]
        this.step('write', 'Gather containers in trie order', `Append key ${leaf.entries[index].value} from a container at depth ${leaf.depth}. Ordered trie traversal plus sorted suffixes gives ascending numeric order.`, 'output.push(next container entry)', {}, leaf, [index])
      }
    }
    for (let index = 0; index < this.entries.length; index += 1) this.entries[index] = this.output[index]!
    this.emit('gather', 'Copy the Burstsort output back', 'All original integer entries are sorted with stable ties. Encoded keys and prefix containers are auxiliary to the fixed numeric array.', 'array[:] = output[:]', { sortedPrefix: this.entries.length })
  }

  private child(node: BurstContainer, digit: string): BurstContainer {
    let child = node.children!.get(digit)
    if (!child) {
      child = new BurstContainer(`burst-${this.nextNodeId++}`, digit, node)
      node.children!.set(digit, child)
    }
    return child
  }

  private burst(node: BurstContainer): void {
    const entries = node.entries
    node.entries = []
    node.children = new Map()
    for (const entry of entries) {
      const child = this.child(node, this.keys.get(entry.id)![node.depth])
      child.entries.push(entry)
      child.count += 1
    }
    this.step('split', 'Burst an overflowing container into a trie node', `A container at depth ${node.depth} exceeded three records. Redistribute its pointers by the next hexadecimal digit, retaining arrival order. Terminal equal-key containers never burst past the key length.`, 'replace container with next-digit child containers', {}, node)
    for (const child of node.children.values()) {
      if (child.entries.length > 3 && child.depth < this.width) this.burst(child)
    }
  }

  private collect(node: BurstContainer, leaves: BurstContainer[]): void {
    if (!node.children) {
      leaves.push(node)
      return
    }
    for (const digit of this.digits) {
      const child = node.children.get(digit)
      if (child) this.collect(child, leaves)
    }
  }

  private step(kind: ArraySortEvent['kind'], label: string, detail: string, code: string, extra: ArraySortFrame = {}, selected?: BurstContainer, activeIndices: readonly number[] = []): void {
    if (!this.observer) return
    const trie: ArraySortTrieNode[] = []
    const runs: ArraySortRun[] = []
    const pending = [this.root]
    while (pending.length) {
      const node = pending.pop()!
      trie.push({ id: node.id, parent: node.parent?.id ?? null, prefix: node.prefix, count: node.count, leaf: node.children === null, terminal: node.prefix.length === this.width, active: node === selected })
      if (node.children) {
        for (let digit = this.digits.length - 1; digit >= 0; digit -= 1) {
          const child = node.children.get(this.digits[digit])
          if (child) pending.push(child)
        }
      } else runs.push({ id: node.id, label: node.prefix.length > 8 ? `…${node.prefix.slice(-8)}` : node.prefix || 'root', entries: [...node.entries], status: node.prefix.length === this.width ? 'TERMINAL' : 'CONTAINER', activeIndices: node === selected ? [...activeIndices] : [] })
    }
    this.emit(kind, label, detail, code, { trie, trieDepth: this.width, storage: [{ id: 'burst-containers', label: 'LEAVES', status: 'PREFIX CONTAINERS', runs }], output: this.output ? [...this.output] : undefined, ...extra })
  }
}
