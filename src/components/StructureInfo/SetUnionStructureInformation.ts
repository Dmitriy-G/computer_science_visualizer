import type { StructureOverview } from './StructureInformation.ts'

export class SetUnionStructureInformation {
  public static readonly overviews = {
    'disjoint-set': {
      summary: 'A Disjoint Set maintains nonoverlapping components, each represented by a parent-tree root. This model uses union by rank and iterative path compression; find and connectivity can change parent links while preserving component membership.',
      useCases: [
        { area: 'Incremental connectivity', description: 'Merge components as connections arrive and check whether two members are connected.' },
        { area: 'Spanning forests', description: 'Detect whether an edge joins different components during Kruskal-style processing.' },
        { area: 'Equivalence classes', description: 'Group identities known to be equivalent without storing every pairwise relationship.' },
        { area: 'Region labeling', description: 'Combine neighboring provisional regions and resolve their shared representative.' },
      ],
      technologies: [
        { name: 'Boost Graph Library (disjoint_sets)', url: 'https://www.boost.org/doc/libs/1_39_0/libs/disjoint_sets/disjoint_sets.html', usage: 'Provides ranked union and path-compressed representatives for component tracking. Boost exposes configurable property maps and compression policies; this numeric teaching model uses Map-indexed nodes and full two-pass compression.' },
      ],
    },
    'ordered-set': {
      summary: 'An Ordered Set stores each key once and maintains comparison order, supporting exact membership and lower-bound queries. This example composes the existing AVL storage, including rotations, cached heights, and parent pointers.',
      useCases: [
        { area: 'Sorted unique indexes', description: 'Maintain distinct keys as values are inserted and removed.' },
        { area: 'Threshold queries', description: 'Find the smallest available key that meets a requested minimum.' },
        { area: 'Deduplication', description: 'Reject repeated keys while preserving comparison order.' },
        { area: 'Ordered selection', description: 'Use neighboring-key queries for allocators, scheduling, and range endpoints.' },
      ],
      technologies: [
        { name: 'Java TreeSet (TreeMap-backed variant)', url: 'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/TreeSet.html', usage: 'Provides a sorted, unique NavigableSet with logarithmic add, remove, and contains. Its TreeMap backing differs from the AVL storage shown here.' },
      ],
    },
    'multiset': {
      summary: 'A Multiset, or Bag, retains repeated occurrences rather than rejecting duplicates. This counted variant stores one Map entry per distinct integer with a positive count; the example begins with ten total occurrences and permits at most 64.',
      useCases: [
        { area: 'Frequency counting', description: 'Accumulate how often each value appears without storing every occurrence separately.' },
        { area: 'Inventory', description: 'Track item quantities and remove exactly one unit at a time.' },
        { area: 'Repeated observations', description: 'Retain multiplicities when equal readings or events are meaningful.' },
        { area: 'Collection comparison', description: 'Compare counts when order is irrelevant but duplicate frequency matters.' },
      ],
      technologies: [
        { name: 'Python collections.Counter (counted variant)', url: 'https://docs.python.org/3/library/collections.html#collections.Counter', usage: 'Uses dictionary entries to count hashable objects and supports bag-style operations. Counter also permits zero and negative counts; this model removes zero entries and allows only positive stored counts.' },
      ],
    },
    'interval-set': {
      summary: 'An Interval Set represents covered integers as sorted, disjoint closed ranges and joins both overlaps and adjacent ranges. This array-backed teaching variant adds by union, subtracts with possible splitting, and queries without enumerating every covered integer; it starts with ten stored intervals.',
      useCases: [
        { area: 'Availability ranges', description: 'Combine available integer slots and remove blocked ranges.' },
        { area: 'Coverage tracking', description: 'Store large contiguous covered regions using endpoint pairs.' },
        { area: 'Allocation regions', description: 'Merge adjacent free ranges and split them when a range is reserved.' },
        { area: 'Range filtering', description: 'Intersect a query range with the covered regions to report exact overlaps.' },
      ],
      technologies: [
        { name: 'Boost Interval Container Library (interval_set)', url: 'https://www.boost.org/doc/libs/latest/libs/icl/doc/html/index.html', usage: 'Offers joining interval sets with union and subtraction for compact range coverage. Boost supports several endpoint domains and interval styles; this example uses closed safe-integer bounds and a sorted array.' },
      ],
    },
  } satisfies Record<string, StructureOverview>
}
