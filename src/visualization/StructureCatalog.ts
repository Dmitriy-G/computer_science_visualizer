import { PriorityStructureCatalog } from './PriorityStructureCatalog.ts'
import type { PriorityModel } from '../components/DataStructuresOverview/QueuePriority/PriorityModel.ts'
import { LinearStructureCatalog } from './LinearStructureCatalog.ts'
import type { LinearModel } from './LinearModel.ts'
import { AVLTree } from '../components/DataStructuresOverview/Trees/AVLTree/AVLTree.ts'
import { AVLTreeLayout } from '../components/DataStructuresOverview/Trees/AVLTree/AVLTreeLayout.ts'
import { RedBlackTree } from '../components/DataStructuresOverview/Trees/RedBlackTree/RedBlackTree.ts'
import { RedBlackTreeLayout } from '../components/DataStructuresOverview/Trees/RedBlackTree/RedBlackTreeLayout.ts'
import { BTree } from '../components/DataStructuresOverview/Trees/BTree/BTree.ts'
import { BTreeLayout } from '../components/DataStructuresOverview/Trees/BTree/BTreeLayout.ts'
import { BPlusTree } from '../components/DataStructuresOverview/Trees/BPlusTree/BPlusTree.ts'
import { BPlusTreeLayout } from '../components/DataStructuresOverview/Trees/BPlusTree/BPlusTreeLayout.ts'
import { Queue } from '../components/DataStructuresOverview/QueuePriority/Queue/Queue.ts'
import { QueueLayout } from '../components/DataStructuresOverview/QueuePriority/Queue/QueueLayout.ts'
import { Deque } from '../components/DataStructuresOverview/QueuePriority/Deque/Deque.ts'
import { DequeLayout } from '../components/DataStructuresOverview/QueuePriority/Deque/DequeLayout.ts'
import { DoublyLinkedList } from '../components/DataStructuresOverview/Linear/DoublyLinkedList/DoublyLinkedList.ts'
import { DoublyLinkedListLayout } from '../components/DataStructuresOverview/Linear/DoublyLinkedList/DoublyLinkedListLayout.ts'
import { CircularBuffer } from '../components/DataStructuresOverview/QueuePriority/CircularBuffer/CircularBuffer.ts'
import { CircularBufferLayout } from '../components/DataStructuresOverview/QueuePriority/CircularBuffer/CircularBufferLayout.ts'
import { LinkedList } from '../components/DataStructuresOverview/Linear/LinkedList/LinkedList.ts'
import { LinkedListLayout } from '../components/DataStructuresOverview/Linear/LinkedList/LinkedListLayout.ts'
import { FixedArray } from '../components/DataStructuresOverview/Linear/Array/FixedArray.ts'
import { ArrayLayout } from '../components/DataStructuresOverview/Linear/Array/ArrayLayout.ts'
import { BinaryTree } from '../components/DataStructuresOverview/Trees/BinaryTree/BinaryTree.ts'
import { BinaryTreeLayout } from '../components/DataStructuresOverview/Trees/BinaryTree/BinaryTreeLayout.ts'
import { Graph } from '../components/DataStructuresOverview/Graphs/SimpleGraph/Graph.ts'
import { GraphSceneLayout } from './GraphSceneLayout.ts'
import { GraphCatalog } from './GraphCatalog.ts'
import type { GraphModel } from './GraphModel.ts'
import { Stack } from '../components/DataStructuresOverview/Linear/Stack/Stack.ts'
import { StackLayout } from '../components/DataStructuresOverview/Linear/Stack/StackLayout.ts'
import type { Scene, StructureKind } from './Scene.ts'
import { AdditionalTreeCatalog } from './AdditionalTreeCatalog.ts'
import type { AdditionalTreeModel } from './AdditionalTreeModel.ts'
import { HashMap } from '../components/DataStructuresOverview/HashBased/HashMap/HashMap.ts'
import { HashMapLayout } from '../components/DataStructuresOverview/HashBased/HashMap/HashMapLayout.ts'
import { HashSet } from '../components/DataStructuresOverview/HashBased/HashSet/HashSet.ts'
import { HashSetLayout } from '../components/DataStructuresOverview/HashBased/HashSet/HashSetLayout.ts'
import { BloomFilter } from '../components/DataStructuresOverview/HashBased/BloomFilter/BloomFilter.ts'
import { BloomFilterLayout } from '../components/DataStructuresOverview/HashBased/BloomFilter/BloomFilterLayout.ts'

export type StructureGroupKind = 'linear' | 'queue-priority' | 'trees' | 'graphs' | 'hash-based'

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
    { kind: 'linear', name: 'Linear', description: 'Arrays, linked blocks, text buffers, packed bits, and allocation pools', symbol: '[]' },
    { kind: 'queue-priority', name: 'Queue / Priority', description: 'Queues, binary and meldable heaps, indexed priorities, and sliding windows', symbol: '⇥' },
    { kind: 'trees', name: 'Trees', description: 'Search trees, tries, range indexes, spatial indexes, and LSM storage', symbol: '⋔' },
    { kind: 'graphs', name: 'Graphs', description: 'Undirected, directed, weighted, acyclic, and parallel edges', symbol: '◇' },
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
    { kind: 'queue', group: 'queue-priority', name: 'Queue', description: 'First in, first out with front and rear pointers', symbol: 'FIFO' },
    { kind: 'deque', group: 'queue-priority', name: 'Deque', description: 'A double-ended queue with linked front and back', symbol: '<>' },
    { kind: 'doubly-linked-list', group: 'linear', name: 'Doubly linked list', description: 'Linked nodes with both prev and next pointers', symbol: '<->' },
    { kind: 'circular-buffer', group: 'queue-priority', name: 'Circular buffer', description: 'Fixed-capacity FIFO slots with read/write wraparound', symbol: '@' },
    { kind: 'skip-list', group: 'linear', name: 'Skip List', description: 'Sorted keys with linked express levels and seeded tower heights', symbol: '⇉' },
    { kind: 'unrolled-linked-list', group: 'linear', name: 'Unrolled Linked List', description: 'Linked blocks of values with local shifts and block splitting', symbol: '▤' },
    { kind: 'xor-linked-list', group: 'linear', name: 'XOR Linked List', description: 'Bidirectional traversal with simulated address XOR links', symbol: '⊕' },
    { kind: 'gap-buffer', group: 'linear', name: 'Gap Buffer', description: 'Editable text around a movable gap in backing storage', symbol: '[]' },
    { kind: 'rope', group: 'trees', name: 'Rope', description: 'Balanced text chunks with cached left-subtree weights', symbol: 'R' },
    { kind: 'bit-set', group: 'linear', name: 'Bit Array / BitSet', description: 'Indexed bits packed into unsigned 32-bit words', symbol: '01' },
    { kind: 'sparse-array', group: 'linear', name: 'Sparse Array', description: 'Explicit indexed entries with implicit zero-valued holes', symbol: '⋯' },
    { kind: 'free-list', group: 'linear', name: 'Free List', description: 'Fixed pool slots linked for allocation and reuse', symbol: '↺' },
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
    { kind: 'heap', group: 'queue-priority', name: 'Heap (min-heap)', description: 'Complete binary min-heap with sift-up and sift-down', symbol: 'min' },
    { kind: 'priority-queue', group: 'queue-priority', name: 'Priority Queue', description: 'Value/priority pairs with FIFO ties and a binary min-heap', symbol: 'PQ' },
    { kind: 'binary-max-heap', group: 'queue-priority', name: 'Binary Max-Heap', description: 'Complete binary heap with the largest value at the root', symbol: 'max' },
    { kind: 'binomial-heap', group: 'queue-priority', name: 'Binomial Heap', description: 'A forest of unique-degree binomial trees linked during meld', symbol: 'B' },
    { kind: 'fibonacci-heap', group: 'queue-priority', name: 'Fibonacci Heap', description: 'Lazy circular root lists, consolidation, marks, and cascading cuts', symbol: 'F' },
    { kind: 'pairing-heap', group: 'queue-priority', name: 'Pairing Heap', description: 'Child/sibling links with two-pass pairing after extraction', symbol: 'P' },
    { kind: 'leftist-heap', group: 'queue-priority', name: 'Leftist Heap', description: 'Meld along short right spines using null-path ranks', symbol: 'L' },
    { kind: 'skew-heap', group: 'queue-priority', name: 'Skew Heap', description: 'Self-adjusting meld with unconditional child exchanges', symbol: 'S' },
    { kind: 'indexed-priority-queue', group: 'queue-priority', name: 'Indexed Priority Queue', description: 'Unique keys with an inverse map for priority changes and deletion', symbol: 'IPQ' },
    { kind: 'monotonic-queue', group: 'queue-priority', name: 'Monotonic Queue', description: 'A decreasing deque for maxima over the latest ten arrivals', symbol: 'MQ' },
    { kind: 'segment-tree', group: 'trees', name: 'Segment Tree', description: 'Cached interval sums with point assignment and range queries', symbol: 'sum' },
    { kind: 'fenwick-tree', group: 'trees', name: 'Fenwick Tree (BIT)', description: 'Binary indexed sums navigated by the least significant set bit', symbol: 'BIT' },
    { kind: 'r-tree', group: 'trees', name: 'R-Tree', description: 'Bounding rectangles in balanced pages with quadratic splitting', symbol: 'xy' },
    { kind: 'lsm-tree', group: 'trees', name: 'LSM Tree', description: 'Memtable writes, immutable sorted runs, tombstones, and full compaction', symbol: 'LSM' },
    { kind: 'ast', group: 'trees', name: 'Abstract Syntax Tree (AST)', description: 'Arithmetic expressions represented by operators and operand nodes', symbol: 'AST' },
    {
      kind: 'graph',
      group: 'graphs',
      name: 'Undirected Graph',
      description: 'Vertices connected by undirected edges',
      symbol: '◇',
    },
    { kind: 'directed-graph', group: 'graphs', name: 'Directed Graph', description: 'Oriented edges; cycles and reciprocal edges are allowed', symbol: '->' },
    { kind: 'weighted-graph', group: 'graphs', name: 'Weighted Graph', description: 'Undirected edges with nonnegative weights and Dijkstra paths', symbol: 'w' },
    { kind: 'dag', group: 'graphs', name: 'DAG', description: 'A directed acyclic graph with cycle-safe insertion and topological ordering', symbol: '->' },
    { kind: 'multigraph', group: 'graphs', name: 'Multigraph', description: 'Undirected parallel edges and self-loops, each with a stable edge ID', symbol: '->' },
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
    graphModels?: ReadonlyMap<StructureKind, GraphModel>,
    linearModels?: ReadonlyMap<StructureKind, LinearModel>,
    priorityModels?: ReadonlyMap<StructureKind, PriorityModel>,
  ): Scene {
    const priority = priorityModels?.get(kind) ?? PriorityStructureCatalog.createDefault(kind)
    if (priority) return PriorityStructureCatalog.createScene(priority)
    const linear = linearModels?.get(kind) ?? LinearStructureCatalog.createDefault(kind)
    if (linear) return LinearStructureCatalog.createScene(linear)
    if (GraphCatalog.supports(kind)) {
      const model = graphModels?.get(kind) ?? (kind === 'graph' ? graph : GraphCatalog.createDefault(kind))
      if (model) return new GraphSceneLayout().create(model)
    }
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

    throw new RangeError('Unknown data structure')
  }
}
