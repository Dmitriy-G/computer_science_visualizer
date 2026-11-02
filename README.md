# Computer Science Visualizer

An interactive TypeScript and React app powered by Vite for exploring computer
science concepts. Its current subject area is data structures, implemented with
React class components and separate model, layout, and animation classes.

Repository: [Dmitriy-G/computer_science_visualizer](https://github.com/Dmitriy-G/computer_science_visualizer).

## Explore

The root menu offers **Data Structures Overview** and **Data Structures Algorithms**.
Algorithms contains **Sorting** and **Graphs Traversal**. Sorting contains
**Array**, with **Bubble Sort**, **Selection Sort**, **Insertion Sort**,
**Binary Insertion Sort**, **Merge Sort**, **Quick Sort**, **Heap Sort**, **Shell Sort**,
**Counting Sort**, **Radix Sort**, **Bucket Sort**, **TimSort**, **IntroSort**,
**Dual-Pivot QuickSort**, and **Block Merge Sort**. The action list scrolls inside
its panel with the heading and navigation kept visible. Animations show
comparisons, swaps, held insertion values, binary-search bounds, merge-buffer
copies, pivot partitions, heap repairs, gap passes, count tables, and distribution
buckets as appropriate. Insertion, binary insertion, merge, bubble, counting, radix,
and bucket sorts are stable, as are TimSort and Block Merge Sort.
Selection, quicksort, heap, Shell, IntroSort, and Dual-Pivot QuickSort are unstable.
TimSort shows natural runs, binary insertion, run-stack collapse, and galloping.
IntroSort shows a partition-depth budget and heap fallback. Dual-Pivot QuickSort
uses endpoint pivots; it omits the sampling and worst-case protections of the
OpenJDK production hybrid. Block Merge Sort demonstrates a locally implemented
buffered block-wise multiway merge variant: sort square-root-sized blocks,
then merge their heads through a min-heap into stable output. It uses O(n)
working storage and does not implement constant-space internal-buffer block sorting.
Counting Sort accepts an inclusive integer key range of at most 4,096 values;
wider inputs are rejected unchanged. Radix and Bucket Sort support negative safe
integers and their full span using exact integer arithmetic.
Its ten-element example starts shuffled; Reset restores that example.
Graphs Traversal lists all five graph types with BFS and DFS, plus Dijkstra for
Weighted Graph and topological sorting for DAG. These algorithm actions live in
Algorithms; Overview retains graph editing and value search. Switching branches
for the same graph preserves its committed vertices and edges.

Sorting and graph algorithm info dialogs include **Real technologies**, with
primary source links, concrete uses, and implementation-variant notes. A separate
**Real products** section displays comma-separated product names linked to original evidence
of their use of the specific algorithm. Unverified
algorithms display an explicit educational-example notice. Overview operations
such as Add, Search, and Clear do not receive this section.

Choose **Data Structures Overview**, then a group:

| Group | Structures |
| --- | --- |
| Linear | Array, Linked list, Stack, Doubly linked list, Skip List, Unrolled Linked List, XOR Linked List, Gap Buffer, Rope, Bit Array / BitSet, Sparse Array, Free List |
| Queue / Priority | Queue, Deque, Circular buffer, Heap (min-heap) |
| Trees | Binary search tree (BST), AVL tree, Red-Black tree, B-Tree, B+ Tree, Trie, Segment Tree, Fenwick Tree (BIT), R-Tree, LSM Tree, Abstract Syntax Tree (AST) |
| Graphs | Undirected Graph, Directed Graph, Weighted Graph, DAG, Multigraph |
| Hash-based | Hash Table / Hash Map, Hash Set, Bloom Filter |

Select a structure to load its example, then choose an action from the canvas
card. Examples generally start with ten elements. Sparse Array has ten stored
entries across 64 logical slots; Free List shows a ten-slot pool with three
allocated slots; Bloom Filter records ten add operations rather than an exact
distinct-member count. The back button reopens the current
group's structure list.

Actions that need input open a validated dialog. Hash Map insertion collects a
key and a value; B+ Tree range search collects inclusive minimum and maximum
keys. Trie accepts lowercase words or prefixes; range indexes collect indices
and values; R-Tree accepts rectangle coordinates or a rectangle ID; LSM writes
collect a key and value. Animations run automatically at normal speed. The header
shows the current
explanation and progress; pseudocode appears above the diagram. **Reset** cancels
playback and restores the default example. Reduced-motion preferences suppress
visual transitions.

Searches finish on their result and preserve the highlight, reporting a location
where available. Bloom Filter checks return **definitely absent** or **possibly
present**; positive results can be false positives. Mutations commit only on the
final frame.

The original Graph is the **Undirected Graph** choice. All graphs support vertex
and edge editing, value search, and clear in Overview. Traversal examples use
the same models, validated input, and playback under Algorithms. Weighted Graph is undirected with nonnegative weights
and Dijkstra shortest paths; DAG rejects cycles and supports topological sort;
Multigraph preserves parallel edges and self-loops with visible edge IDs.

Small info buttons open action complexity explanations. The large info button
opens a structure introduction, use-case table, and technology links. Dialogs
leave playback running. Hash-based structures also show their hash function
below the legend.

The technology lists include documented uses in systems, language runtimes,
standard libraries, and established application libraries. Each entry explains
its purpose and links to primary documentation or source. Counts vary by
structure; competition libraries and educational algorithm collections are not
used to fill a quota, and implementation variants are identified explicitly.

The extended linear structures offer these actions:

| Structure | Allowed actions |
| --- | --- |
| Skip List | Insert a key, Search by key, Delete a key, Clear |
| Unrolled Linked List | Insert at index, Search by value, Delete by value, Clear |
| XOR Linked List | Append a value, Search by value, Delete by value, Clear |
| Gap Buffer | Insert text, Move the gap, Delete text, Search for text, Clear |
| Rope | Insert text, Concatenate text, Read character by index, Delete text, Clear |
| Bit Array / BitSet | Set a bit, Clear a bit, Toggle a bit, Test a bit, Clear all bits |
| Sparse Array | Set an entry, Read an entry, Delete an entry, Clear stored entries |
| Free List | Allocate a slot, Release a slot, Release all slots |

Skip List uses reproducible seeded towers; Unrolled Linked List splits four-value
blocks. XOR Linked List uses simulated numeric addresses and BigInt XOR, with no
native-pointer or memory-saving claim. Gap Buffer moves a physical gap; Rope
uses immutable AVL split/join operations with cached left weights. Text requests
accept 1–32 printable ASCII characters, with a 256-character example limit.
BitSet packs bits into unsigned 32-bit words. Sparse Array distinguishes stored
zero from a hole, and Free List rejects exhaustion and double release.

The new numeric lists allow at most 64 values. Their shared trace recorder keeps
at most 96 detailed operation frames, executes every operation event, and reports
omitted frames in the result. Snapshots preserve stable bounds during playback.

The additional tree structures offer these actions:

| Structure | Allowed actions |
| --- | --- |
| Trie | Insert a word, Search by word, Check a prefix, Delete a word, Clear |
| Heap (min-heap) | Insert a value, Extract minimum, Peek minimum, Clear |
| Segment Tree | Update a value, Range sum, Clear (reset to zero) |
| Fenwick Tree (BIT) | Add to a value, Prefix sum, Range sum, Clear (reset to zero) |
| R-Tree | Insert a rectangle, Search overlapping rectangles, Delete by rectangle ID, Clear |
| LSM Tree | Insert / update, Look up a key, Delete a key (tombstone), Flush memtable, Compact all runs, Clear |
| Abstract Syntax Tree (AST) | Build from expression, Traverse preorder, Traverse inorder, Traverse postorder, Evaluate expression, Clear |

Segment and Fenwick queries use inclusive zero-based array indices and exact
integer sums. Their Clear action preserves length and zeroes the values so
point operations remain available. R-Tree uses order-4 pages with quadratic
splitting and inclusive overlap, including touching edges. LSM Tree is an
in-memory teaching model with a sorted-array memtable, a four-key flush threshold,
immutable runs, and full compaction; it does not simulate disk I/O or a WAL.

AST models arithmetic expressions with integer literals, unary signs, `+`, `-`,
`*`, `/`, and parentheses (up to 128 characters). The default expression
`-(8 + 2) * (9 - 3) / 2` has ten syntax nodes and evaluates to `-30`.
Traversal results list node tokens, using `neg` and `pos` for unary signs;
inorder does not reconstruct parentheses. Evaluation displays the computed value
and reports division by zero or unsafe integer results without changing the tree.

## Project layout

The app's display name is **Computer Science Visualizer**. Its package and IntelliJ
module use `computer_science_visualizer`. Use that name for the checkout folder
as well; close apps using an existing checkout before renaming its directory.

- `src/components/App/`: application shell and branding.
- `src/components/DataStructuresOverview/<Group>/<Structure>/`: canonical models,
  layouts, and common operations under `Linear`, `QueuePriority`, `Trees`, `Graphs`,
  and `HashBased`.
- `src/components/DataStructuresAlgorithms/Sorting/Array/`: the 48 sorting actions
  and their array-specific algorithm, trace, and layout helpers.
- `src/components/DataStructuresAlgorithms/GraphsTraversal/<Graph>/`: BFS, DFS,
  Dijkstra, and topological-sort actions for the supported graph variants.
- `src/components/MainMenu/`: menu navigation and action selection.
- `src/components/Renderer/`: shared diagram renderer and optional hints.
- `src/components/ActionPlayback/`: animation progress and pseudocode display.
- `src/visualization/`: shared scene contracts, catalogs, and playback classes.
- `docs/rules/`: implementation rules.
- `tests/`: models, sequences, input validation, navigation, and playback.
- `public/`: static assets.

Feature folders mirror the menu's main category, subcategory, structure, and
action. Sorting and graph algorithms reuse the canonical Overview models.

## Development

Use Node.js 22.12+ and npm. Run commands manually:

```sh
npm install
npm run dev
```

Open the local URL printed by Vite.

## Production build

```sh
npm run build
npm run preview
```

The build checks TypeScript before generating `dist/`.

## Checks

```sh
npm run typecheck
npm test
```

Tests use Node.js's built-in test runner and experimental TypeScript stripping.
Coverage includes structure invariants, collision handling and rehashing, Bloom
filter membership, independent animation snapshots, input validation, navigation,
and playback cancellation.

See [AGENTS.md](AGENTS.md), [component structure](docs/rules/component-structure.md),
and [visualization flow](docs/rules/visualization-flow.md) for project guidance.
