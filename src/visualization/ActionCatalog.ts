import { GraphCatalog } from './GraphCatalog.ts'
import type { StructureKind } from './Scene.ts'

export type ActionScope = 'overview' | 'graph-traversal' | 'sorting'

export type ActionKind = ArraySortingActionKind | 'insert-middle' | 'insert-start' | 'insert-end' | 'insert' | 'search-value' | 'search-index' | 'delete-value' | 'push' | 'pop' | 'peek' | 'clear' | 'enqueue' | 'dequeue' | 'push-front' | 'push-back' | 'pop-front' | 'pop-back' | 'peek-front' | 'peek-back' | 'delete-start' | 'delete-end' | 'range-from-value' | 'starts-with' | 'extract-min' | 'update-index' | 'add-index' | 'prefix-sum' | 'range-sum' | 'search-overlap' | 'flush' | 'compact' | 'build-expression' | 'evaluate' | 'traverse-preorder' | 'traverse-inorder' | 'traverse-postorder' | 'add-vertex' | 'add-edge' | 'remove-edge' | 'breadth-first' | 'depth-first' | 'shortest-path' | 'topological-sort' | 'update-weight' | 'bubble-sorting'

export type ArraySortingActionKind = 'selection-sort' | 'insertion-sort' | 'binary-insertion-sort' | 'merge-sort' | 'quick-sort' | 'heap-sort' | 'shell-sort' | 'counting-sort' | 'radix-sort' | 'bucket-sort' | 'tim-sort' | 'intro-sort' | 'dual-pivot-quick-sort' | 'block-merge-sort' | 'wiki-sort' | 'smooth-sort' | 'tree-sort' | 'tournament-sort' | 'patience-sort' | 'cycle-sort' | 'comb-sort' | 'cocktail-shaker-sort' | 'gnome-sort' | 'odd-even-sort' | 'odd-even-merge-sort' | 'bitonic-sort' | 'pairwise-sorting-network' | 'sample-sort' | 'parallel-merge-sort' | 'parallel-quick-sort' | 'external-merge-sort' | 'polyphase-merge-sort' | 'natural-merge-sort'

export interface ActionChoice {
  readonly kind: ActionKind
  readonly title: string
  readonly description: string
}

export class ActionCatalog {
  public static getScopedActions(structure: StructureKind, scope: ActionScope): readonly ActionChoice[] {
    if (scope === 'sorting') return structure === 'array'
      ? [
        { kind: 'bubble-sorting', title: 'Bubble Sort', description: 'Compare adjacent values and swap them into ascending order.' },
        { kind: 'selection-sort', title: 'Selection Sort', description: 'Find each remaining minimum and swap it into the sorted prefix.' },
        { kind: 'insertion-sort', title: 'Insertion Sort', description: 'Scan backward and shift larger entries to insert the next value.' },
        { kind: 'binary-insertion-sort', title: 'Binary Insertion Sort', description: 'Binary-search the insertion position, then shift entries right.' },
        { kind: 'merge-sort', title: 'Merge Sort', description: 'Split the array and stably merge sorted halves through a buffer.' },
        { kind: 'quick-sort', title: 'Quick Sort', description: 'Partition around the last-entry pivot and sort both sides.' },
        { kind: 'heap-sort', title: 'Heap Sort', description: 'Build a max-heap and extract maxima into a sorted suffix.' },
        { kind: 'shell-sort', title: 'Shell Sort', description: 'Sort gap-separated subsequences with decreasing Knuth gaps.' },
        { kind: 'counting-sort', title: 'Counting Sort', description: 'Count integer keys in a limited range and distribute stably.' },
        { kind: 'radix-sort', title: 'Radix Sort', description: 'Distribute and gather stable decimal digit buckets.' },
        { kind: 'bucket-sort', title: 'Bucket Sort', description: 'Distribute into equal-width buckets, sort each, and concatenate.' },
        { kind: 'tim-sort', title: 'TimSort', description: 'Detect natural runs, extend short runs, and stably merge with galloping.' },
        { kind: 'intro-sort', title: 'IntroSort', description: 'Partition with quicksort, falling back to heap and insertion sorting.' },
        { kind: 'dual-pivot-quick-sort', title: 'Dual-Pivot QuickSort', description: 'Partition into three ranges using two ordered pivots.' },
        { kind: 'block-merge-sort', title: 'Block Merge Sort', description: 'Sort blocks and stably merge their heads through a heap into buffered output.' },
        { kind: 'wiki-sort', title: 'WikiSort', description: 'Borrow internal buffers and stably merge tagged blocks by exchanges and rotations.' },
        { kind: 'smooth-sort', title: 'Smoothsort', description: 'Grow and split Leonardo heaps, adapting repairs to existing order.' },
        { kind: 'tree-sort', title: 'Tree Sort', description: 'Insert entries into a binary search tree and read them in order.' },
        { kind: 'tournament-sort', title: 'Tournament Sort', description: 'Replay winner-tree matches to repeatedly select the smallest entry.' },
        { kind: 'patience-sort', title: 'Patience Sort', description: 'Deal entries into decreasing piles and heap-merge their tops.' },
        { kind: 'cycle-sort', title: 'Cycle Sort', description: 'Count smaller keys and rotate cycles with few array writes.' },
        { kind: 'comb-sort', title: 'Comb Sort', description: 'Exchange entries across shrinking gaps, then clean up adjacent pairs.' },
        { kind: 'cocktail-shaker-sort', title: 'Cocktail Shaker Sort', description: 'Sweep adjacent pairs forward and backward to fix both boundaries.' },
        { kind: 'gnome-sort', title: 'Gnome Sort', description: 'Walk forward over ordered neighbors and backtrack after an exchange.' },
        { kind: 'odd-even-sort', title: 'Odd-Even Sort', description: 'Alternate even and odd adjacent pairs until both phases are ordered.' },
        { kind: 'odd-even-merge-sort', title: 'Odd-Even Merge Sort', description: 'Sort halves and combine them through Batcher’s odd-even merge network.' },
        { kind: 'bitonic-sort', title: 'Bitonic Sort', description: 'Build opposite-direction ranges and merge them with a comparator network.' },
        { kind: 'pairwise-sorting-network', title: 'Pairwise Sorting Network', description: 'Order pairs and combine their lower and upper members through fixed comparisons.' },
        { kind: 'sample-sort', title: 'Sample Sort', description: 'Sample splitters, distribute into buckets, sort locally, and concatenate.' },
        { kind: 'parallel-merge-sort', title: 'Parallel Merge Sort', description: 'Fork a dependency tree, schedule ready tasks on two virtual workers, and stably merge completed halves.' },
        { kind: 'parallel-quick-sort', title: 'Parallel QuickSort', description: 'Partition around a middle-slot pivot, then schedule independent less-than and greater-than tasks on two virtual workers.' },
        { kind: 'external-merge-sort', title: 'External Merge Sort', description: 'Sort three-record RAM chunks into runs, then perform balanced two-way merge passes over four virtual tapes.' },
        { kind: 'polyphase-merge-sort', title: 'Polyphase Merge Sort', description: 'Distribute sorted runs in Fibonacci quotas over two tapes and rotate a third empty tape through polyphase merges.' },
        { kind: 'natural-merge-sort', title: 'Natural Merge Sort', description: 'Detect existing monotone runs, reverse strictly decreasing ones, and stably merge adjacent run pairs.' },
      ]
      : []
    const actions = this.getActions(structure)
    if (!GraphCatalog.supports(structure)) return scope === 'overview' ? actions : []
    const choices: ActionChoice[] = []
    for (const action of actions) {
      const traversal = action.kind === 'breadth-first' || action.kind === 'depth-first' || action.kind === 'shortest-path' || action.kind === 'topological-sort'
      if (traversal === (scope === 'graph-traversal')) choices.push(action)
    }
    return choices
  }

  public static getActions(structure: StructureKind): readonly ActionChoice[] {
    if (GraphCatalog.supports(structure)) {
      const actions: ActionChoice[] = [
        { kind: 'add-vertex', title: 'Add vertex', description: 'Add an isolated vertex with a unique whole-number value.' },
        { kind: 'add-edge', title: 'Add edge', description: structure === 'dag' ? 'Connect source to target only if no directed cycle would result.' : structure === 'multigraph' ? 'Add an undirected edge, including parallel edges and self-loops.' : 'Connect existing endpoints; duplicate edges are ignored.' },
        { kind: 'remove-edge', title: 'Remove edge', description: 'Remove one edge by its visible e-number.' },
        { kind: 'delete-value', title: 'Delete vertex', description: 'Find a vertex by value and remove all incident edges.' },
        { kind: 'search-value', title: 'Search by value', description: 'Search with BFS, restarting at each unvisited component.' },
        { kind: 'breadth-first', title: 'Breadth-first traversal', description: 'Visit vertices reachable from a start vertex using a queue.' },
        { kind: 'depth-first', title: 'Depth-first traversal', description: 'Follow a branch before backtracking, using an explicit stack.' },
      ]
      if (structure === 'weighted-graph') actions.push(
        { kind: 'update-weight', title: 'Update edge weight', description: 'Change one edge to a nonnegative integer weight.' },
        { kind: 'shortest-path', title: 'Dijkstra shortest path', description: 'Find a minimum-weight path between two vertices.' },
      )
      if (structure === 'dag') actions.push({ kind: 'topological-sort', title: 'Topological sort', description: 'Use the Kahn algorithm to order predecessors before successors.' })
      actions.push({ kind: 'clear', title: 'Clear', description: 'Detach all edges and release all vertices.' })
      return actions
    }
    if (structure === 'ast') return [
      { kind: 'build-expression', title: 'Build from expression', description: 'Parse an arithmetic expression, preserving precedence and grouping.' },
      { kind: 'traverse-preorder', title: 'Traverse preorder', description: 'Visit each operator before its operands: root, left, right.' },
      { kind: 'traverse-inorder', title: 'Traverse inorder', description: 'Visit binary nodes between operands; visit unary signs before their operand.' },
      { kind: 'traverse-postorder', title: 'Traverse postorder', description: 'Visit operands before their operator: left, right, root.' },
      { kind: 'evaluate', title: 'Evaluate expression', description: 'Evaluate operands and apply operators, showing the computed result.' },
      { kind: 'clear', title: 'Clear', description: 'Release syntax nodes after their children and empty the AST.' },
    ]
    if (structure === 'trie') return [
      { kind: 'insert', title: 'Insert a word', description: 'Follow shared prefixes, create missing characters, and mark a word end.' },
      { kind: 'search-value', title: 'Search by word', description: 'Follow the characters and require a word-end marker.' },
      { kind: 'starts-with', title: 'Check a prefix', description: 'Check whether a character prefix exists, without requiring a word end.' },
      { kind: 'delete-value', title: 'Delete a word', description: 'Unmark a word and prune only its unused suffix nodes.' },
      { kind: 'clear', title: 'Clear', description: 'Release all character nodes and keep the empty root.' },
    ]
    if (structure === 'heap') return [
      { kind: 'insert', title: 'Insert a value', description: 'Append a leaf and sift up in a binary min-heap. Duplicates are allowed.' },
      { kind: 'extract-min', title: 'Extract minimum', description: 'Remove the root, replace it with the last leaf, and sift down.' },
      { kind: 'peek', title: 'Peek minimum', description: 'Read the root without removing it.' },
      { kind: 'clear', title: 'Clear', description: 'Release all heap entries from the last slot.' },
    ]
    if (structure === 'segment-tree') return [
      { kind: 'update-index', title: 'Update a value', description: 'Set one array value and recompute sums on its path to the root.' },
      { kind: 'range-sum', title: 'Range sum', description: 'Sum an inclusive index range using cached covered segments.' },
      { kind: 'clear', title: 'Clear (reset to zero)', description: 'Reset all array values and sums to zero, preserving the indexed length.' },
    ]
    if (structure === 'fenwick-tree') return [
      { kind: 'add-index', title: 'Add to a value', description: 'Add a delta at an array index and update its BIT ancestors.' },
      { kind: 'prefix-sum', title: 'Prefix sum', description: 'Sum from array index zero through the chosen inclusive index.' },
      { kind: 'range-sum', title: 'Range sum', description: 'Subtract two prefix sums to sum an inclusive index range.' },
      { kind: 'clear', title: 'Clear (reset to zero)', description: 'Reset values and BIT cells to zero while keeping the indexed length.' },
    ]
    if (structure === 'r-tree') return [
      { kind: 'insert', title: 'Insert a rectangle', description: 'Choose least enlargement, insert a spatial record, and split overflowing pages.' },
      { kind: 'search-overlap', title: 'Search overlapping rectangles', description: 'Prune disjoint bounding rectangles and report intersecting record IDs.' },
      { kind: 'delete-value', title: 'Delete by rectangle ID', description: 'Locate a rectangle ID, remove it, condense pages, and reinsert orphan records.' },
      { kind: 'clear', title: 'Clear', description: 'Release all spatial records and pages.' },
    ]
    if (structure === 'lsm-tree') return [
      { kind: 'insert', title: 'Insert / update', description: 'Write a key/value version to a sorted memtable; flush at four distinct keys.' },
      { kind: 'search-value', title: 'Look up a key', description: 'Search memory and sorted runs from newest to oldest; respect tombstones.' },
      { kind: 'delete-value', title: 'Delete a key (tombstone)', description: 'Write a tombstone that hides older values until full compaction.' },
      { kind: 'flush', title: 'Flush memtable', description: 'Copy the sorted memtable into a new immutable level-0 run.' },
      { kind: 'compact', title: 'Compact all runs', description: 'Flush memory, merge all sorted runs, and discard obsolete versions and covered tombstones.' },
      { kind: 'clear', title: 'Clear', description: 'Release memory records and sorted runs.' },
    ]
    if (structure === 'hash-map') {
      return [
        { kind: 'insert', title: 'Insert / update', description: 'Store a key-value pair or update an existing key; rehash when needed.' },
        { kind: 'search-value', title: 'Look up a key', description: 'Hash the key and inspect its collision chain.' },
        { kind: 'delete-value', title: 'Delete a key', description: 'Remove the matching entry while preserving other collisions.' },
        { kind: 'clear', title: 'Clear', description: 'Release all entries and keep the buckets available for reuse.' },
      ]
    }
    if (structure === 'hash-set') {
      return [
        { kind: 'insert', title: 'Add a value', description: 'Add a unique value; leave duplicates unchanged.' },
        { kind: 'search-value', title: 'Contains value', description: 'Hash the value and check its collision chain.' },
        { kind: 'delete-value', title: 'Remove a value', description: 'Remove the value if it is present.' },
        { kind: 'clear', title: 'Clear', description: 'Release every entry and empty the set.' },
      ]
    }
    if (structure === 'bloom-filter') {
      return [
        { kind: 'insert', title: 'Add a value', description: 'Compute three hashes and set their bits.' },
        { kind: 'search-value', title: 'Check membership', description: 'Report definitely absent or possibly present; false positives are possible.' },
        { kind: 'clear', title: 'Clear', description: 'Reset every bit; individual item deletion is not supported.' },
      ]
    }
    if (structure === 'binary-tree' || structure === 'avl-tree' || structure === 'red-black-tree' || structure === 'b-tree' || structure === 'b-plus-tree') {
      const actions: ActionChoice[] = [
        { kind: 'insert', title: 'Insert a key', description: structure === 'binary-tree' ? 'Compare from the root and connect a new leaf. Duplicate keys are rejected.' : 'Insert one unique key and restore balance or page occupancy.' },
        { kind: 'search-value', title: 'Search by key', description: 'Follow ordered comparisons to a matching key.' },
        { kind: 'delete-value', title: 'Delete a key', description: structure === 'binary-tree' ? 'Remove a key and reconnect the tree while preserving search order.' : 'Remove a key and restore balance or page occupancy.' },
        { kind: 'clear', title: 'Clear', description: 'Release every node or page and empty the tree.' },
      ]
      if (structure === 'b-plus-tree') actions.push({ kind: 'range-from-value', title: 'Range from key', description: 'Report all records between two inclusive keys through linked leaves.' })
      return actions
    }
    if (structure === 'queue') {
      return [
        { kind: 'enqueue', title: 'Enqueue', description: 'Add a value at the rear.' },
        { kind: 'dequeue', title: 'Dequeue', description: 'Remove and return the front value.' },
        { kind: 'peek', title: 'Peek (front)', description: 'Read the front without removing it.' },
        { kind: 'clear', title: 'Clear', description: 'Release all nodes from front to rear.' },
        { kind: 'search-value', title: 'Search by value', description: 'Find the first match from the front without changing order.' },
      ]
    }
    if (structure === 'deque') {
      return [
        { kind: 'push-front', title: 'Push front', description: 'Add a value before the front.' },
        { kind: 'push-back', title: 'Push back', description: 'Add a value after the back.' },
        { kind: 'pop-front', title: 'Pop front', description: 'Remove and return the front value.' },
        { kind: 'pop-back', title: 'Pop back', description: 'Remove and return the back value.' },
        { kind: 'peek-front', title: 'Peek front', description: 'Read the front without removing it.' },
        { kind: 'peek-back', title: 'Peek back', description: 'Read the back without removing it.' },
        { kind: 'clear', title: 'Clear', description: 'Release every node from front to back.' },
        { kind: 'search-value', title: 'Search by value', description: 'Find the first match from the front without changing order.' },
      ]
    }
    if (structure === 'doubly-linked-list') {
      return [
        { kind: 'insert-middle', title: 'Insert in the middle', description: 'Insert at floor(length / 2) and connect both pointers.' },
        { kind: 'insert-start', title: 'Insert at the start', description: 'Insert a new head and connect next and prev.' },
        { kind: 'insert-end', title: 'Insert at the end', description: 'Insert a new tail and connect next and prev.' },
        { kind: 'delete-start', title: 'Delete at the start', description: 'Remove the head and clear the new head prev pointer.' },
        { kind: 'delete-end', title: 'Delete at the end', description: 'Remove the tail and clear the new tail next pointer.' },
        { kind: 'delete-value', title: 'Delete by value', description: 'Find the first match and reconnect next and prev.' },
        { kind: 'search-value', title: 'Search by value', description: 'Follow next pointers to the first match.' },
        { kind: 'search-index', title: 'Search by index', description: 'Follow next or prev from the nearer end.' },
        { kind: 'clear', title: 'Clear', description: 'Release nodes one at a time and empty both end pointers.' },
      ]
    }
    if (structure === 'circular-buffer') {
      return [
        { kind: 'enqueue', title: 'Enqueue', description: 'Write into the next free slot; reject when full.' },
        { kind: 'dequeue', title: 'Dequeue', description: 'Read and release the oldest slot, then advance read.' },
        { kind: 'peek', title: 'Peek (oldest)', description: 'Read the oldest value without advancing read.' },
        { kind: 'clear', title: 'Clear', description: 'Release occupied slots in FIFO order.' },
        { kind: 'search-value', title: 'Search by value', description: 'Search occupied slots in logical FIFO order, wrapping as needed.' },
      ]
    }
    if (structure === 'stack') {
      return [
        { kind: 'push', title: 'Push', description: 'Place a new value on top of the stack.' },
        { kind: 'pop', title: 'Pop', description: 'Remove and return the top value.' },
        { kind: 'peek', title: 'Peek (top)', description: 'Read the top value without removing it.' },
        { kind: 'clear', title: 'Clear', description: 'Remove every value from top to bottom.' },
        { kind: 'search-value', title: 'Search by value', description: 'Find the first match from the top without changing the stack.' },
      ]
    }
    const actions: ActionChoice[] = []
    if (structure === 'linked-list' || structure === 'array') {
      actions.push(
        { kind: 'insert-middle', title: 'Insert in the middle', description: 'Insert at the zero-based index floor(length / 2).' },
        { kind: 'insert-start', title: 'Insert at the start', description: 'Insert a value before the first element.' },
        { kind: 'insert-end', title: 'Insert at the end', description: 'Append a value after the last element.' },
      )
    }
    actions.push({ kind: 'search-value', title: 'Search by value', description: 'Follow the search path to the first matching value.' })
    if (structure === 'linked-list' || structure === 'array') actions.push({ kind: 'search-index', title: 'Search by index', description: 'Find an element using its zero-based index.' })
    actions.push({ kind: 'delete-value', title: 'Delete by value', description: 'Remove the first match and reconnect the remaining structure.' })
    actions.push({
      kind: 'clear',
      title: 'Clear',
      description: structure === 'array' ? 'Replace the selected array with an empty fixed array.' : structure === 'graph' ? 'Release every edge and vertex, including disconnected components.' : 'Release every node and empty the structure.',
    })
    return actions
  }
}
