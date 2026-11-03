import type { ActionChoice } from './ActionCatalog.ts'
import type { StructureKind } from './Scene.ts'

export class SetUnionActionCatalog {
  public static getActions(kind: StructureKind): readonly ActionChoice[] | null {
    switch (kind) {
      case 'disjoint-set': return [
        { kind: 'insert', title: 'Make set', description: 'Add a new member as its own singleton component.' },
        { kind: 'find-set', title: 'Find representative', description: 'Follow parents to a root and compress the visited path.' },
        { kind: 'union', title: 'Union components', description: 'Merge two existing components by rank.' },
        { kind: 'connected', title: 'Check connectivity', description: 'Compare representatives of two existing members.' },
        { kind: 'clear', title: 'Clear', description: 'Release members in child-before-parent order.' },
      ]
      case 'ordered-set': return [
        { kind: 'insert', title: 'Add a key', description: 'Insert a unique key and repair AVL balance.' },
        { kind: 'search-value', title: 'Contains key', description: 'Compare keys along one AVL search path.' },
        { kind: 'lower-bound', title: 'Lower bound', description: 'Find the smallest stored key greater than or equal to the input.' },
        { kind: 'delete-value', title: 'Remove a key', description: 'Remove a matching key and rebalance its ancestors.' },
        { kind: 'clear', title: 'Clear', description: 'Release all stored keys in postorder.' },
      ]
      case 'multiset': return [
        { kind: 'insert', title: 'Add an occurrence', description: 'Increment a value count, allowing duplicates.' },
        { kind: 'count-value', title: 'Count occurrences', description: 'Read the exact count of a value, including zero for an absent value.' },
        { kind: 'delete-value', title: 'Remove one occurrence', description: 'Decrement one count and release the entry when it reaches zero.' },
        { kind: 'clear', title: 'Clear', description: 'Release all distinct-value counters and their occurrences.' },
      ]
      case 'interval-set': return [
        { kind: 'insert', title: 'Union with interval', description: 'Add an inclusive integer range, merging overlaps and adjacent intervals.' },
        { kind: 'delete-value', title: 'Subtract interval', description: 'Remove an inclusive range, splitting stored intervals when needed.' },
        { kind: 'search-value', title: 'Contains value', description: 'Binary-search the sorted intervals for one integer.' },
        { kind: 'search-overlap', title: 'Intersect with interval', description: 'Report the exact intersections without changing stored intervals.' },
        { kind: 'clear', title: 'Clear', description: 'Release every stored interval.' },
      ]
      default: return null
    }
  }
}
