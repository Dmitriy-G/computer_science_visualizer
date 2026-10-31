import { AVLTree } from '../components/DataStructures/Trees/AVLTree/AVLTree.ts'
import { AVLTreeLayout } from '../components/DataStructures/Trees/AVLTree/AVLTreeLayout.ts'
import { RedBlackTree } from '../components/DataStructures/Trees/RedBlackTree/RedBlackTree.ts'
import { RedBlackTreeLayout } from '../components/DataStructures/Trees/RedBlackTree/RedBlackTreeLayout.ts'
import { BTree } from '../components/DataStructures/Trees/BTree/BTree.ts'
import { BTreeLayout } from '../components/DataStructures/Trees/BTree/BTreeLayout.ts'
import { BPlusTree } from '../components/DataStructures/Trees/BPlusTree/BPlusTree.ts'
import { BPlusTreeLayout } from '../components/DataStructures/Trees/BPlusTree/BPlusTreeLayout.ts'
import { Queue } from '../components/DataStructures/Linear/Queue/Queue.ts'
import { QueueLayout } from '../components/DataStructures/Linear/Queue/QueueLayout.ts'
import { Deque } from '../components/DataStructures/Linear/Deque/Deque.ts'
import { DequeLayout } from '../components/DataStructures/Linear/Deque/DequeLayout.ts'
import { DoublyLinkedList } from '../components/DataStructures/Linear/DoublyLinkedList/DoublyLinkedList.ts'
import { DoublyLinkedListLayout } from '../components/DataStructures/Linear/DoublyLinkedList/DoublyLinkedListLayout.ts'
import { CircularBuffer } from '../components/DataStructures/Linear/CircularBuffer/CircularBuffer.ts'
import { CircularBufferLayout } from '../components/DataStructures/Linear/CircularBuffer/CircularBufferLayout.ts'
import { LinkedList } from '../components/DataStructures/Linear/LinkedList/LinkedList.ts'
import { LinkedListLayout } from '../components/DataStructures/Linear/LinkedList/LinkedListLayout.ts'
import { FixedArray } from '../components/DataStructures/Linear/Array/FixedArray.ts'
import { ArrayLayout } from '../components/DataStructures/Linear/Array/ArrayLayout.ts'
import { BinaryTree } from '../components/DataStructures/Trees/BinaryTree/BinaryTree.ts'
import { BinaryTreeLayout } from '../components/DataStructures/Trees/BinaryTree/BinaryTreeLayout.ts'
import { Graph } from '../components/DataStructures/Graphs/SimpleGraph/Graph.ts'
import { GraphLayout } from '../components/DataStructures/Graphs/SimpleGraph/GraphLayout.ts'
import { Stack } from '../components/DataStructures/Linear/Stack/Stack.ts'
import { StackLayout } from '../components/DataStructures/Linear/Stack/StackLayout.ts'
import type { Scene, StructureKind } from './Scene.ts'
import { AdditionalTreeCatalog } from './AdditionalTreeCatalog.ts'
import type { AdditionalTreeModel } from './AdditionalTreeModel.ts'
import { HashMap } from '../components/DataStructures/HashBased/HashMap/HashMap.ts'
import { HashMapLayout } from '../components/DataStructures/HashBased/HashMap/HashMapLayout.ts'
import { HashSet } from '../components/DataStructures/HashBased/HashSet/HashSet.ts'
import { HashSetLayout } from '../components/DataStructures/HashBased/HashSet/HashSetLayout.ts'
import { BloomFilter } from '../components/DataStructures/HashBased/BloomFilter/BloomFilter.ts'
import { BloomFilterLayout } from '../components/DataStructures/HashBased/BloomFilter/BloomFilterLayout.ts'

export type StructureGroupKind = 'linear' | 'trees' | 'graphs' | 'hash-based'

export interface StructureGroupDefinition {
  readonly kind: StructureGroupKind
  readonly name: string
  readonly description: string
  readonly symbol: string
}

export interface StructureDefinition {
  readonly kind: StructureKind
  readonly group: StructureGroupKind
  readonly name: string
  readonly description: string
  readonly symbol: string
}

export class StructureCatalog {
  public static readonly groups: readonly StructureGroupDefinition[] = [
    { kind: 'linear', name: 'Linear', description: 'Arrays, lists, stacks, queues, deques, and circular buffers', symbol: '[]' },
    { kind: 'trees', name: 'Trees', description: 'Search trees, tries, heaps, range indexes, spatial indexes, and LSM storage', symbol: '⋔' },
    { kind: 'graphs', name: 'Graphs', description: 'Vertices and edges', symbol: '◇' },
    { kind: 'hash-based', name: 'Hash-based', description: 'Hash maps, hash sets, and Bloom filters', symbol: '#' },
  ]

  public static readonly structures: readonly StructureDefinition[] = [
    { kind: 'hash-map', group: 'hash-based', name: 'Hash Table / Hash Map', description: 'Key-value buckets with collision chains and automatic rehashing', symbol: '#' },
    { kind: 'hash-set', group: 'hash-based', name: 'Hash Set', description: 'Unique values located through hash buckets', symbol: '{}' },
    { kind: 'bloom-filter', group: 'hash-based', name: 'Bloom Filter', description: 'A bit array for probabilistic membership checks', symbol: '01' },
    {
      kind: 'linked-list',
      group: 'linear',
      name: 'Linked list',
      description: 'Nodes connected by next pointers',
      symbol: '→',
    },
    {
      kind: 'array',
      group: 'linear',
      name: 'Array',
      description: 'A fixed number of consecutive indexed slots',
      symbol: '[]',
    },
    {
      kind: 'stack',
      group: 'linear',
      name: 'Stack',
      description: 'Last in, first out: push and pop at the top',
      symbol: '≡',
    },
    { kind: 'queue', group: 'linear', name: 'Queue', description: 'First in, first out with front and rear pointers', symbol: 'FIFO' },
    { kind: 'deque', group: 'linear', name: 'Deque', description: 'A double-ended queue with linked front and back', symbol: '<>' },
    { kind: 'doubly-linked-list', group: 'linear', name: 'Doubly linked list', description: 'Linked nodes with both prev and next pointers', symbol: '<->' },
    { kind: 'circular-buffer', group: 'linear', name: 'Circular buffer', description: 'Fixed-capacity FIFO slots with read/write wraparound', symbol: '@' },
    {
      kind: 'binary-tree',
      group: 'trees',
      name: 'Binary search tree (BST)',
      description: 'Unique keys: strictly smaller left, strictly larger right',
      symbol: '⋔',
    },
    { kind: 'avl-tree', group: 'trees', name: 'AVL tree', description: 'Height-balanced search with single and double rotations', symbol: '+' },
    { kind: 'red-black-tree', group: 'trees', name: 'Red-Black tree', description: 'Balanced search using red/black colors and rotations', symbol: '+' },
    { kind: 'b-tree', group: 'trees', name: 'B-Tree', description: 'Multi-key order-4 pages with splitting, borrowing, and merging', symbol: '+' },
    { kind: 'b-plus-tree', group: 'trees', name: 'B+ Tree', description: 'Order-4 routing pages and linked leaves containing all records', symbol: '+' },
    { kind: 'trie', group: 'trees', name: 'Trie', description: 'Shared character prefixes with explicit word ends', symbol: 'abc' },
    { kind: 'heap', group: 'trees', name: 'Heap (min-heap)', description: 'Complete binary min-heap with sift-up and sift-down', symbol: 'min' },
    { kind: 'segment-tree', group: 'trees', name: 'Segment Tree', description: 'Cached interval sums with point assignment and range queries', symbol: 'sum' },
    { kind: 'fenwick-tree', group: 'trees', name: 'Fenwick Tree (BIT)', description: 'Binary indexed sums navigated by the least significant set bit', symbol: 'BIT' },
    { kind: 'r-tree', group: 'trees', name: 'R-Tree', description: 'Bounding rectangles in balanced pages with quadratic splitting', symbol: 'xy' },
    { kind: 'lsm-tree', group: 'trees', name: 'LSM Tree', description: 'Memtable writes, immutable sorted runs, tombstones, and full compaction', symbol: 'LSM' },
    { kind: 'ast', group: 'trees', name: 'Abstract Syntax Tree (AST)', description: 'Arithmetic expressions represented by operators and operand nodes', symbol: 'AST' },
    {
      kind: 'graph',
      group: 'graphs',
      name: 'Graph',
      description: 'Vertices connected by undirected edges',
      symbol: '◇',
    },
  ]

  public static getGroup(kind: StructureGroupKind): StructureGroupDefinition {
    for (const group of this.groups) {
      if (group.kind === kind) return group
    }
    throw new RangeError('Unknown structure group')
  }

  public static getStructures(group: StructureGroupKind): readonly StructureDefinition[] {
    const structures: StructureDefinition[] = []
    for (const structure of this.structures) {
      if (structure.group === group) structures.push(structure)
    }
    return structures
  }

  public static getGroupForStructure(kind: StructureKind): StructureGroupKind {
    for (const structure of this.structures) {
      if (structure.kind === kind) return structure.group
    }
    throw new RangeError('Unknown data structure')
  }

  public static getName(kind: StructureKind): string {
    for (const structure of this.structures) {
      if (structure.kind === kind) return structure.name
    }
    return 'Data structure'
  }

  public static createPreview(
    kind: StructureKind,
    list: LinkedList,
    array: FixedArray = FixedArray.createDefault(),
    tree: BinaryTree = BinaryTree.createDefault(),
    graph: Graph = Graph.createDefault(),
    stack: Stack = Stack.createDefault(),
    queue: Queue = Queue.createDefault(),
    deque: Deque = Deque.createDefault(),
    doublyList: DoublyLinkedList = DoublyLinkedList.createDefault(),
    buffer: CircularBuffer = CircularBuffer.createDefault(),
    avlTree: AVLTree = AVLTree.createDefault(),
    redBlackTree: RedBlackTree = RedBlackTree.createDefault(),
    bTree: BTree = BTree.createDefault(),
    bPlusTree: BPlusTree = BPlusTree.createDefault(),
    hashMap: HashMap = HashMap.createDefault(),
    hashSet: HashSet = HashSet.createDefault(),
    bloomFilter: BloomFilter = BloomFilter.createDefault(),
    additionalModels?: ReadonlyMap<StructureKind, AdditionalTreeModel>,
  ): Scene {
    const additional = additionalModels?.get(kind) ?? AdditionalTreeCatalog.createDefault(kind)
    if (additional) return AdditionalTreeCatalog.createScene(additional)
    if (kind === 'hash-map') return new HashMapLayout().create(hashMap)
    if (kind === 'hash-set') return new HashSetLayout().create(hashSet)
    if (kind === 'bloom-filter') return new BloomFilterLayout().create(bloomFilter)
    if (kind === 'avl-tree') return new AVLTreeLayout().create(avlTree)
    if (kind === 'red-black-tree') return new RedBlackTreeLayout().create(redBlackTree)
    if (kind === 'b-tree') return new BTreeLayout().create(bTree)
    if (kind === 'b-plus-tree') return new BPlusTreeLayout().create(bPlusTree)
    if (kind === 'queue') return new QueueLayout().create(queue.getEntries())
    if (kind === 'deque') return new DequeLayout().create(deque.getEntries())
    if (kind === 'doubly-linked-list') return new DoublyLinkedListLayout().create(doublyList.getEntries())
    if (kind === 'circular-buffer') return new CircularBufferLayout().create(buffer)
    if (kind === 'linked-list')
      return new LinkedListLayout().create(list.getEntries())
    if (kind === 'array') return new ArrayLayout().create(array.getEntries())
    if (kind === 'stack') return new StackLayout().create(stack.getEntries())
    if (kind === 'binary-tree')
      return new BinaryTreeLayout().create(tree.getEntries())

    return new GraphLayout().create(graph.getEntries())
  }
}
