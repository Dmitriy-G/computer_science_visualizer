import type { StructureDefinition } from './StructureCatalog.ts'

export class SetUnionStructureDefinitions {
  public static readonly structures: readonly StructureDefinition[] = [
    { kind: 'disjoint-set', group: 'set-union', name: 'Disjoint Set (Union-Find)', description: 'Parent forests, ranked union, path compression, and connectivity', symbol: 'UF' },
    { kind: 'ordered-set', group: 'set-union', name: 'Ordered Set', description: 'Unique sorted keys in an AVL tree with lower-bound lookup', symbol: '<>' },
    { kind: 'multiset', group: 'set-union', name: 'Multiset (Bag)', description: 'Repeated values stored with positive occurrence counts', symbol: '{}' },
    { kind: 'interval-set', group: 'set-union', name: 'Interval Set', description: 'Merged integer ranges with union, difference, and intersection', symbol: '[ ]' },
  ]
}
