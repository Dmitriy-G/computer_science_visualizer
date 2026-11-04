import { MenuStructureCatalog } from '../../src/components/MainMenu/MenuStructureCatalog.ts'

export class StructurePaths {
  static groups = {
    'linear': 'Linear',
    'queue-priority': 'QueuePriority',
    'trees': 'Trees',
    'string-text': 'StringText',
    'graphs': 'Graphs',
    'set-union': 'SetUnion',
    'hash-based': 'HashBased',
    'sequence-variants': 'Sequences',
    'sparse-arrays-matrices': 'SparseArraysMatrices',
    'specialized-queues-heaps': 'QueuesHeaps',
    'specialized-search-trees': 'SearchTrees',
    'multiway-search-trees': 'MultiwayTrees',
    'range-queries-persistence': 'RangeQueries',
    'spatial-similarity-indexes': 'SpatialIndexes',
    'storage-database-indexes': 'StorageIndexes',
    'memory-concurrency-io': 'MemoryIO',
    'text-editing-search': 'TextSearch',
    'syntax-program-representation': 'Syntax',
    'advanced-hashing-distribution': 'Hashing',
    'specialized-graphs-domain-indexes': 'SpecializedGraphs',
    'integrity-verification': 'Integrity',
    'probabilistic-filters-sketches-sampling': 'Probabilistic',
  }

  static group(kind) {
    const group = MenuStructureCatalog.getGroupForStructure(kind)
    const root = group.category === 'fundamental' ? 'FundamentalDataStructures' : 'AdvancedDataStructures'
    return `${root}/${this.groups[group.kind]}`
  }
}
