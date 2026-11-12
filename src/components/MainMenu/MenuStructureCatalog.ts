import { StructureCatalog } from '../../visualization/StructureCatalog.ts'
import type { StructureDefinition } from '../../visualization/StructureCatalog.ts'
import type { StructureKind } from '../../visualization/Scene.ts'

export type StructureCategoryKind = 'fundamental' | 'advanced'
export type MenuStructureGroupKind =
  | 'linear'
  | 'queue-priority'
  | 'trees'
  | 'string-text'
  | 'graphs'
  | 'set-union'
  | 'hash-based'
  | 'sequence-variants'
  | 'sparse-arrays-matrices'
  | 'specialized-queues-heaps'
  | 'specialized-search-trees'
  | 'multiway-search-trees'
  | 'range-queries-persistence'
  | 'spatial-similarity-indexes'
  | 'storage-database-indexes'
  | 'memory-concurrency-io'
  | 'text-editing-search'
  | 'syntax-program-representation'
  | 'advanced-hashing-distribution'
  | 'specialized-graphs-domain-indexes'
  | 'integrity-verification'
  | 'probabilistic-filters-sketches-sampling'

export interface MenuStructureGroup {
  readonly kind: MenuStructureGroupKind
  readonly category: StructureCategoryKind
  readonly name: string
  readonly description: string
  readonly symbol: string
  readonly structures: readonly StructureKind[]
}

export class MenuStructureCatalog {
  public static readonly groups: readonly MenuStructureGroup[] = [
    {
      kind: 'linear', category: 'fundamental', name: 'Linear',
      description: 'Keep elements in a sequence, with each item at a defined position.', symbol: '[]',
      structures: ['array', 'linked-list', 'doubly-linked-list', 'stack', 'grid-2d', 'dense-tensor'],
    },
    {
      kind: 'queue-priority', category: 'fundamental', name: 'Queue / Priority',
      description: 'Choose the next item by arrival order or priority.', symbol: 'Q',
      structures: ['queue', 'deque', 'circular-buffer', 'priority-queue', 'heap', 'binary-max-heap'],
    },
    {
      kind: 'trees', category: 'fundamental', name: 'Trees',
      description: 'Organize data into branching hierarchies for lookup and updates.', symbol: 'T',
      structures: ['general-tree', 'unordered-binary-tree', 'complete-binary-tree', 'binary-tree', 'avl-tree', 'red-black-tree'],
    },
    {
      kind: 'string-text', category: 'fundamental', name: 'String / Text',
      description: 'Organize words by shared character prefixes.', symbol: 'Aa',
      structures: ['trie'],
    },
    {
      kind: 'graphs', category: 'fundamental', name: 'Graphs',
      description: 'Represent connections and their common storage formats.', symbol: 'G',
      structures: ['graph', 'directed-graph', 'weighted-graph', 'dag', 'multigraph', 'bipartite-graph', 'complete-graph', 'tree-graph', 'functional-graph', 'adjacency-list', 'adjacency-matrix', 'edge-list'],
    },
    {
      kind: 'set-union', category: 'fundamental', name: 'Set / Union',
      description: 'Track membership, ordering, and groups of related elements.', symbol: '{}',
      structures: ['hash-set', 'ordered-set', 'multiset', 'bit-set', 'disjoint-set'],
    },
    {
      kind: 'hash-based', category: 'fundamental', name: 'Hash-based',
      description: 'Locate keys with buckets, collision chains, or probing.', symbol: '#',
      structures: ['hash-map', 'separate-chaining-hash-table', 'open-addressing-hash-table'],
    },
    {
      kind: 'sequence-variants', category: 'advanced', name: 'Sequences',
      description: 'Explore layered links, block nodes, and compact link representations.', symbol: '<>',
      structures: ['skip-list', 'unrolled-linked-list', 'xor-linked-list'],
    },
    {
      kind: 'sparse-arrays-matrices', category: 'advanced', name: 'Sparse Arrays / Matrices',
      description: 'Store indexed data efficiently when most entries are empty.', symbol: '[]',
      structures: ['sparse-array', 'sparse-coo', 'sparse-csc', 'numerical-csr', 'compressed-sparse-row'],
    },
    {
      kind: 'specialized-queues-heaps', category: 'advanced', name: 'Queues / Heaps',
      description: 'Explore melding, indexed priorities, and sliding-window queues.', symbol: 'Q',
      structures: ['binomial-heap', 'fibonacci-heap', 'pairing-heap', 'leftist-heap', 'skew-heap', 'indexed-priority-queue', 'monotonic-queue'],
    },
    {
      kind: 'specialized-search-trees', category: 'advanced', name: 'Search Trees',
      description: 'Explore alternative balancing, ordering, and traversal policies.', symbol: 'T',
      structures: ['threaded-binary-tree', 'splay-tree', 'treap', 'cartesian-tree', 'scapegoat-tree', 'aa-tree', 'van-emde-boas-tree'],
    },
    {
      kind: 'multiway-search-trees', category: 'advanced', name: 'Multiway Trees',
      description: 'Organize keys in branching pages with multiple entries.', symbol: 'T',
      structures: ['two-three-tree', 'two-three-four-tree', 'b-tree', 'b-plus-tree'],
    },
    {
      kind: 'range-queries-persistence', category: 'advanced', name: 'Range Queries',
      description: 'Answer interval queries and retain previous versions.', symbol: 'sum',
      structures: ['segment-tree', 'fenwick-tree', 'interval-tree', 'order-statistic-tree', 'persistent-segment-tree', 'sparse-table', 'interval-set'],
    },
    {
      kind: 'spatial-similarity-indexes', category: 'advanced', name: 'Spatial Indexes',
      description: 'Index coordinates, bounding regions, and nearest neighbors.', symbol: 'xy',
      structures: ['ivf-index', 'kd-tree', 'quadtree', 'octree', 'r-tree', 'bvh', 'bkd-tree', 'ball-tree', 'flat-vector-array', 'lsh-index', 'hnsw-graph'],
    },
    {
      kind: 'storage-database-indexes', category: 'advanced', name: 'Storage Indexes',
      description: 'Organize durable records, sorted runs, and database searches.', symbol: 'DB',
      structures: ['brin', 'sstable', 'sparse-primary-index', 'sparse-offset-index', 'time-index', 'append-only-log', 'fanout-array', 'lsm-tree', 'gist'],
    },
    {
      kind: 'memory-concurrency-io', category: 'advanced', name: 'Memory / I/O',
      description: 'Manage allocation, request routing, and producer/consumer storage.', symbol: 'IO',
      structures: ['free-list', 'xarray', 'request-tag-array', 'maple-tree', 'multi-queue', 'lock-free-ring'],
    },
    {
      kind: 'text-editing-search', category: 'advanced', name: 'Text / Search',
      description: 'Edit text and index words, substrings, and patterns.', symbol: 'Aa',
      structures: ['gap-buffer', 'rope', 'radix-tree', 'ternary-search-tree', 'suffix-tree', 'suffix-array', 'suffix-automaton', 'aho-corasick-automaton', 'dawg', 'fm-index', 'inverted-index'],
    },
    {
      kind: 'syntax-program-representation', category: 'advanced', name: 'Syntax',
      description: 'Represent expression syntax for traversal and evaluation.', symbol: 'AST',
      structures: ['ast'],
    },
    {
      kind: 'advanced-hashing-distribution', category: 'advanced', name: 'Hashing',
      description: 'Explore collision policies, dynamic buckets, and server assignment.', symbol: '#',
      structures: ['robin-hood-hash-table', 'cuckoo-hash-table', 'hopscotch-hashing', 'extendible-hashing', 'linear-hashing', 'perfect-hash-table', 'consistent-hashing-ring'],
    },
    {
      kind: 'specialized-graphs-domain-indexes', category: 'advanced', name: 'Specialized Graphs',
      description: 'Model hyperedges, flows, biological sequences, and domain relationships.', symbol: 'G',
      structures: ['hypergraph', 'flow-network', 'compacted-de-bruijn-graph', 'minimizer-index', 'address-space-graph'],
    },
    {
      kind: 'integrity-verification', category: 'advanced', name: 'Integrity',
      description: 'Use hash hierarchies and checksums to verify stored data.', symbol: '#',
      structures: ['content-addressed-layers', 'merkle-tree', 'checksummed-block-tree'],
    },
    {
      kind: 'probabilistic-filters-sketches-sampling', category: 'advanced', name: 'Probabilistic',
      description: 'Estimate membership, frequency, cardinality, and stream samples.', symbol: '~',
      structures: ['bloom-filter', 'blocked-bloom-filter', 'counting-bloom-filter', 'cuckoo-filter', 'quotient-filter', 'count-min-sketch', 'hyperloglog', 'reservoir-sampling-buffer'],
    },
  ]

  public static getGroups(category: StructureCategoryKind): readonly MenuStructureGroup[] {
    const groups: MenuStructureGroup[] = []
    for (const group of this.groups) {
      if (group.category === category) groups.push(group)
    }
    return groups
  }

  public static getGroup(kind: MenuStructureGroupKind): MenuStructureGroup {
    for (const group of this.groups) {
      if (group.kind === kind) return group
    }
    throw new RangeError(`Unknown structure menu group: ${kind}`)
  }

  public static getGroupForStructure(kind: StructureKind): MenuStructureGroup {
    for (const group of this.groups) {
      if (group.structures.includes(kind)) return group
    }
    throw new RangeError(`Structure has no menu category: ${kind}`)
  }

  public static getStructures(kind: MenuStructureGroupKind): readonly StructureDefinition[] {
    const group = this.getGroup(kind)
    const structures: StructureDefinition[] = []
    for (const structure of StructureCatalog.structures) {
      if (group.structures.includes(structure.kind)) structures.push(structure)
    }
    return structures
  }
}
