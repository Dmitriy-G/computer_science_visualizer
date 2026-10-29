import { LinkedList } from '../components/DataStructures/LinkedList/LinkedList.ts'
import { LinkedListLayout } from '../components/DataStructures/LinkedList/LinkedListLayout.ts'
import { FixedArray } from '../components/DataStructures/Array/FixedArray.ts'
import { ArrayLayout } from '../components/DataStructures/Array/ArrayLayout.ts'
import { BinaryTree } from '../components/DataStructures/BinaryTree/BinaryTree.ts'
import { BinaryTreeLayout } from '../components/DataStructures/BinaryTree/BinaryTreeLayout.ts'
import { Graph } from '../components/DataStructures/Graph/Graph.ts'
import { GraphLayout } from '../components/DataStructures/Graph/GraphLayout.ts'
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
    { kind: 'linear', name: 'Linear', description: 'Arrays and linked lists', symbol: '[]' },
    { kind: 'trees', name: 'Trees', description: 'Binary search trees', symbol: '⋔' },
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
      kind: 'binary-tree',
      group: 'trees',
      name: 'Binary tree',
      description: 'A binary search tree: smaller left, larger or equal right',
      symbol: '⋔',
    },
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
  ): Scene {
    if (kind === 'linked-list')
      return new LinkedListLayout().create(list.getEntries())
    if (kind === 'array') return new ArrayLayout().create(array.getEntries())
    if (kind === 'binary-tree')
      return new BinaryTreeLayout().create(tree.getEntries())

    return new GraphLayout().create(graph.getEntries())
  }
}
