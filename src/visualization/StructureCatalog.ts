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

export type StructureGroupKind = 'linear' | 'trees' | 'graphs'

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
    { kind: 'trees', name: 'Trees', description: 'BST, AVL, Red-Black, B-Tree, and B+ Tree', symbol: '⋔' },
    { kind: 'graphs', name: 'Graphs', description: 'Vertices and edges', symbol: '◇' },
  ]

  public static readonly structures: readonly StructureDefinition[] = [
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
      description: 'A binary search tree: smaller left, larger or equal right',
      symbol: '⋔',
    },
    { kind: 'avl-tree', group: 'trees', name: 'AVL tree', description: 'Height-balanced search with single and double rotations', symbol: '+' },
    { kind: 'red-black-tree', group: 'trees', name: 'Red-Black tree', description: 'Balanced search using red/black colors and rotations', symbol: '+' },
    { kind: 'b-tree', group: 'trees', name: 'B-Tree', description: 'Multi-key order-4 pages with splitting, borrowing, and merging', symbol: '+' },
    { kind: 'b-plus-tree', group: 'trees', name: 'B+ Tree', description: 'Order-4 routing pages and linked leaves containing all records', symbol: '+' },
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
  ): Scene {
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
