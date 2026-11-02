import type { StructureKind } from './Scene.ts'
import type { ActionChoice } from './ActionCatalog.ts'
export class ExtendedTreeActionCatalog {
  public static getActions(kind: StructureKind): readonly ActionChoice[] | null {
    switch (kind) {
      case 'general-tree': return [
        { kind: 'insert', title: 'Attach a child', description: 'Attach a unique key below an existing parent; the first insertion creates the root.' },
        { kind: 'search-value', title: 'Search by key', description: 'Find a key and report its actual location or absence.' },
        { kind: 'delete-value', title: 'Delete a subtree', description: 'Remove the selected key and every node below it.' },
        { kind: 'clear', title: 'Clear', description: 'Release the structure so a new example can be built.' },
      ]
      case 'unordered-binary-tree': return [
        { kind: 'insert', title: 'Attach a child', description: 'Attach a unique key below an existing parent; the first insertion creates the root.' },
        { kind: 'search-value', title: 'Search by key', description: 'Find a key and report its actual location or absence.' },
        { kind: 'delete-value', title: 'Delete a subtree', description: 'Remove the selected key and every node below it.' },
        { kind: 'clear', title: 'Clear', description: 'Release the structure so a new example can be built.' },
      ]
      case 'complete-binary-tree': return [
        { kind: 'insert', title: 'Append a value', description: 'Fill the next level-order position. Duplicate values are allowed.' },
        { kind: 'search-value', title: 'Search by value', description: 'Find a key and report its actual location or absence.' },
        { kind: 'delete-value', title: 'Delete a value', description: 'Replace the first matching value with the deepest rightmost value.' },
        { kind: 'clear', title: 'Clear', description: 'Release the structure so a new example can be built.' },
      ]
      case 'threaded-binary-tree': return [
        { kind: 'insert', title: 'Insert a key', description: 'Insert a unique key using this tree\'s own placement and repair policy.' },
        { kind: 'search-value', title: 'Search by key', description: 'Find a key and report its actual location or absence.' },
        { kind: 'traverse-inorder', title: 'Traverse inorder', description: 'Visit sorted keys through predecessor/successor threads, without a traversal stack.' },
        { kind: 'clear', title: 'Clear', description: 'Release the structure so a new example can be built.' },
      ]
      case 'splay-tree': return [
        { kind: 'insert', title: 'Insert a key', description: 'Insert a unique key using this tree\'s own placement and repair policy.' },
        { kind: 'search-value', title: 'Search by key', description: 'Find a key and report its actual location or absence.' },
        { kind: 'delete-value', title: 'Delete a key', description: 'Remove a key using this structure\'s deletion policy.' },
        { kind: 'clear', title: 'Clear', description: 'Release the structure so a new example can be built.' },
      ]
      case 'treap': return [
        { kind: 'insert', title: 'Insert a key', description: 'Insert a unique key using this tree\'s own placement and repair policy.' },
        { kind: 'search-value', title: 'Search by key', description: 'Find a key and report its actual location or absence.' },
        { kind: 'delete-value', title: 'Delete a key', description: 'Remove a key using this structure\'s deletion policy.' },
        { kind: 'clear', title: 'Clear', description: 'Release the structure so a new example can be built.' },
      ]
      case 'cartesian-tree': return [
        { kind: 'insert', title: 'Append a value', description: 'Pop greater values from the monotone right spine and attach the new array position.' },
        { kind: 'range-min', title: 'Range minimum', description: 'Find the minimum value in an inclusive zero-based index range.' },
        { kind: 'clear', title: 'Clear', description: 'Release the structure so a new example can be built.' },
      ]
      case 'scapegoat-tree': return [
        { kind: 'insert', title: 'Insert a key', description: 'Insert a unique key using this tree\'s own placement and repair policy.' },
        { kind: 'search-value', title: 'Search by key', description: 'Find a key and report its actual location or absence.' },
        { kind: 'delete-value', title: 'Delete a key', description: 'Remove a key using this structure\'s deletion policy.' },
        { kind: 'clear', title: 'Clear', description: 'Release the structure so a new example can be built.' },
      ]
      case 'aa-tree': return [
        { kind: 'insert', title: 'Insert a key', description: 'Insert a unique key using this tree\'s own placement and repair policy.' },
        { kind: 'search-value', title: 'Search by key', description: 'Find a key and report its actual location or absence.' },
        { kind: 'delete-value', title: 'Delete a key', description: 'Remove a key using this structure\'s deletion policy.' },
        { kind: 'clear', title: 'Clear', description: 'Release the structure so a new example can be built.' },
      ]
      case 'two-three-tree': return [
        { kind: 'insert', title: 'Insert a key', description: 'Insert a unique key using this tree\'s own placement and repair policy.' },
        { kind: 'search-value', title: 'Search by key', description: 'Find a key and report its actual location or absence.' },
        { kind: 'clear', title: 'Clear', description: 'Release the structure so a new example can be built.' },
      ]
      case 'two-three-four-tree': return [
        { kind: 'insert', title: 'Insert a key', description: 'Insert a unique key using this tree\'s own placement and repair policy.' },
        { kind: 'search-value', title: 'Search by key', description: 'Find a key and report its actual location or absence.' },
        { kind: 'delete-value', title: 'Delete a key', description: 'Remove a key using this structure\'s deletion policy.' },
        { kind: 'clear', title: 'Clear', description: 'Release the structure so a new example can be built.' },
      ]
      case 'radix-tree': return [
        { kind: 'insert', title: 'Insert a word', description: 'Insert lowercase text using this structure\'s character branching policy.' },
        { kind: 'search-value', title: 'Search by word', description: 'Follow the character branches and require a complete-word marker.' },
        { kind: 'starts-with', title: 'Check a prefix', description: 'Match a prefix even when it ends inside a compressed edge.' },
        { kind: 'delete-value', title: 'Delete a word', description: 'Remove the terminal marker and prune unused character paths.' },
        { kind: 'clear', title: 'Clear', description: 'Release the structure so a new example can be built.' },
      ]
      case 'ternary-search-tree': return [
        { kind: 'insert', title: 'Insert a word', description: 'Insert lowercase text using this structure\'s character branching policy.' },
        { kind: 'search-value', title: 'Search by word', description: 'Follow the character branches and require a complete-word marker.' },
        { kind: 'delete-value', title: 'Delete a word', description: 'Remove the terminal marker and prune unused character paths.' },
        { kind: 'clear', title: 'Clear', description: 'Release the structure so a new example can be built.' },
      ]
      case 'suffix-tree': return [
        { kind: 'build-text', title: 'Build from text', description: 'Build all suffixes using compressed source-text edge ranges and a unique terminator.' },
        { kind: 'search-value', title: 'Search substring', description: 'Match a pattern along compressed edges and collect its descendant suffix indices.' },
        { kind: 'clear', title: 'Clear', description: 'Release the structure so a new example can be built.' },
      ]
      case 'interval-tree': return [
        { kind: 'insert', title: 'Insert an interval', description: 'Insert a unique inclusive interval and maintain each ancestor\'s maximum high endpoint.' },
        { kind: 'search-overlap', title: 'Find an overlap', description: 'Return one inclusive overlapping interval, using subtree maxima to prune the search.' },
        { kind: 'clear', title: 'Clear', description: 'Release the structure so a new example can be built.' },
      ]
      case 'order-statistic-tree': return [
        { kind: 'insert', title: 'Insert a key', description: 'Insert a unique key using this tree\'s own placement and repair policy.' },
        { kind: 'search-value', title: 'Search by key', description: 'Find a key and report its actual location or absence.' },
        { kind: 'delete-value', title: 'Delete a key', description: 'Remove a key using this structure\'s deletion policy.' },
        { kind: 'rank', title: 'Rank of a key', description: 'Count stored keys strictly smaller than the supplied key, including absent keys.' },
        { kind: 'select-rank', title: 'Select by rank', description: 'Find the key at a zero-based sorted rank using subtree sizes.' },
        { kind: 'clear', title: 'Clear', description: 'Release the structure so a new example can be built.' },
      ]
      case 'persistent-segment-tree': return [
        { kind: 'update-index', title: 'Update a value', description: 'Assign a value at a zero-based index and update the affected path.' },
        { kind: 'range-sum', title: 'Range sum in a version', description: 'Read an exact inclusive range sum from the selected immutable version.' },
        { kind: 'clear', title: 'Clear (reset to zero)', description: 'Reset all ten indexed values to zero; discard old versions or recompute hashes.' },
      ]
      case 'sparse-table': return [
        { kind: 'build-values', title: 'Build from values', description: 'Precompute minima for every available power-of-two interval.' },
        { kind: 'range-min', title: 'Range minimum', description: 'Find the minimum value in an inclusive zero-based index range.' },
        { kind: 'clear', title: 'Clear', description: 'Release the structure so a new example can be built.' },
      ]
      case 'kd-tree': return [
        { kind: 'insert', title: 'Insert a point', description: 'Insert a unique point using this structure\'s spatial partition rules.' },
        { kind: 'search-overlap', title: 'Search overlaps', description: 'Prune disjoint branches and return matching spatial records.' },
        { kind: 'clear', title: 'Clear', description: 'Release the structure so a new example can be built.' },
      ]
      case 'quadtree': return [
        { kind: 'insert', title: 'Insert a point', description: 'Insert a unique point using this structure\'s spatial partition rules.' },
        { kind: 'search-overlap', title: 'Search overlaps', description: 'Prune disjoint branches and return matching spatial records.' },
        { kind: 'clear', title: 'Clear', description: 'Release the structure so a new example can be built.' },
      ]
      case 'octree': return [
        { kind: 'insert', title: 'Insert a point', description: 'Insert a unique point using this structure\'s spatial partition rules.' },
        { kind: 'search-overlap', title: 'Search overlaps', description: 'Prune disjoint branches and return matching spatial records.' },
        { kind: 'clear', title: 'Clear', description: 'Release the structure so a new example can be built.' },
      ]
      case 'bvh': return [
        { kind: 'insert', title: 'Insert a rectangle', description: 'Insert an AABB primitive and refit ancestor bounding volumes.' },
        { kind: 'search-overlap', title: 'Search overlaps', description: 'Prune disjoint branches and return matching spatial records.' },
        { kind: 'clear', title: 'Clear', description: 'Release the structure so a new example can be built.' },
      ]
      case 'merkle-tree': return [
        { kind: 'update-index', title: 'Update a value', description: 'Assign a value at a zero-based index and update the affected path.' },
        { kind: 'verify-proof', title: 'Verify inclusion proof', description: 'Use sibling hashes to verify the supplied leaf value against the current root.' },
        { kind: 'clear', title: 'Clear (reset to zero)', description: 'Reset all ten indexed values to zero; discard old versions or recompute hashes.' },
      ]
      case 'van-emde-boas-tree': return [
        { kind: 'insert', title: 'Insert a key', description: 'Insert a unique key using this tree\'s own placement and repair policy.' },
        { kind: 'search-value', title: 'Search by key', description: 'Find a key and report its actual location or absence.' },
        { kind: 'successor', title: 'Strict successor', description: 'Find the smallest stored integer strictly greater than the supplied key.' },
        { kind: 'delete-value', title: 'Delete a key', description: 'Remove a key using this structure\'s deletion policy.' },
        { kind: 'clear', title: 'Clear', description: 'Release the structure so a new example can be built.' },
      ]
      default: return null
    }
  }
}
