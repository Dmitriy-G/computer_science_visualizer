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
Graphs Traversal lists all fifteen graph entries with BFS and DFS, plus Dijkstra for
Weighted Graph, topological sorting for DAG, and Edmonds–Karp maximum flow for
Flow Network. These algorithm actions live in
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
| Linear | Array, Linked list, Stack, Doubly linked list, Skip List, Unrolled Linked List, XOR Linked List, Bit Array / BitSet, Sparse Array, Free List |
| Queue / Priority | Queue, Deque, Circular buffer, Heap (min-heap), Priority Queue, Binary Max-Heap, Binomial Heap, Fibonacci Heap, Pairing Heap, Leftist Heap, Skew Heap, Indexed Priority Queue, Monotonic Queue |
| Trees | Binary search tree (BST), AVL tree, Red-Black tree, B-Tree, B+ Tree, Segment Tree, Fenwick Tree (BIT), R-Tree, LSM Tree, Abstract Syntax Tree (AST), General Tree (N-ary Tree), Binary Tree, Complete Binary Tree, Threaded Binary Tree, Splay Tree, Treap, Cartesian Tree, Scapegoat Tree, AA Tree, 2-3 Tree, 2-3-4 Tree, Interval Tree, Order Statistic Tree, Persistent Segment Tree, Sparse Table, KD-Tree, Quadtree, Octree, Bounding Volume Hierarchy (BVH), Merkle Tree, Van Emde Boas Tree |
| String / Text | Gap Buffer, Rope, Trie, Radix Tree (Patricia Trie), Ternary Search Tree, Suffix Tree, Suffix Array, Suffix Automaton, Aho-Corasick Automaton, Directed Acyclic Word Graph (DAWG), FM-Index |
| Graphs | Undirected Graph, Directed Graph, Weighted Graph, DAG, Multigraph, Bipartite Graph, Complete Graph, Tree Graph, Hypergraph, Flow Network, Functional Graph, Adjacency Matrix, Adjacency List, Edge List, Compressed Sparse Row (CSR) |
| Hash-based | Hash Table / Hash Map, Hash Set, Open Addressing Hash Table, Separate Chaining Hash Table, Robin Hood Hash Table, Cuckoo Hash Table, Hopscotch Hashing, Extendible Hashing, Linear Hashing, Perfect Hash Table, Consistent Hashing Ring |
| Probabilistic | Bloom Filter, Counting Bloom Filter, Cuckoo Filter, Quotient Filter, Count-Min Sketch, HyperLogLog, Reservoir Sampling Buffer |

Select a structure to load its example, then choose an action from the canvas
card. Examples generally start with ten elements. Sparse Array has ten stored
entries across 64 logical slots; Free List shows a ten-slot pool with three
allocated slots; Bloom Filter records ten add operations rather than an exact
distinct-member count. The new filters show allocated counters, fingerprint buckets,
or quotient slots. Count-Min Sketch counts weighted update operations, HyperLogLog
counts add operations while estimating distinct values, and Reservoir Sampling Buffer
shows five retained occurrences after ten stream arrivals. The back button reopens the current
group's structure list.

The probabilistic examples animate their actual storage. Counting Bloom Filter
rejects four-bit counter overflow; it and Cuckoo Filter keep an extra exact-key
ledger only to guard deletion, with that memory overhead disclosed in their info
dialogs. Quotient Filter uses O/C/S metadata for lookup and rebuilds packed runs on
insertion. Count-Min Sketch accepts positive weights with BigInt counters.
HyperLogLog uses sixteen registers and small-range linear counting. Reservoir
sampling uses Algorithm R with five slots and a reproducible seeded generator.
These fixed seeds support replay; theoretical error and sampling claims assume
suitable ideal hashing or uniform random draws. All six provide Clear and Reset.

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

The original Graph is the **Undirected Graph** choice. All graph entries support vertex
editing, value search, and clear in Overview. Complete Graph maintains its edges
automatically, Tree Graph permits leaf edits, and Functional Graph replaces
successors instead of deleting outgoing edges. Traversal examples use
the same models, validated input, and playback under Algorithms. Weighted Graph is undirected with nonnegative weights
and Dijkstra shortest paths; DAG rejects cycles and supports topological sort;
Multigraph preserves parallel edges and self-loops with visible edge IDs.

The ten additional graph entries start with ten vertices and cap examples at
16 vertices and 128 ordinary edges (32 hyperedges). Bipartite Graph fixes L/R
partitions; Complete Graph connects every pair; Tree Graph remains connected
and acyclic; Functional Graph preserves one successor per vertex. Hypergraph
uses multi-member sets and incidence nodes. Flow Network accepts nonnegative
safe-integer capacities, computes exact maximum flow, and resets flows after
valid edits. Adjacency Matrix, Adjacency List, Edge List, and CSR use their actual
storage representations and show storage beside topology, with Inspect storage
actions. BFS/DFS follow the selected representation. Playback stores at most
96 detailed events, executes the entire operation, and reports omitted detail.

Small info buttons open action complexity explanations. The large info button
opens a structure introduction, use-case table, and technology links. Dialogs
leave playback running. Hash-based structures and Bloom Filter also show their hash function
below the legend.

The technology lists include documented uses in systems, language runtimes,
standard libraries, and established application libraries. Each entry explains
its purpose and links to primary documentation or source. Counts vary by
structure; competition libraries and educational algorithm collections are not
used to fill a quota, and implementation variants are identified explicitly.

The 24 additional tree entries include separate general, unordered binary, complete,
threaded, and ordered search trees; compressed word indexes; versioned and static
range indexes; spatial partitions; a SHA-256 Merkle tree; and a bounded integer
universe tree. Each has its own model and layout plus animated actions and input
validation. The existing BST keeps its selection key and behavior.

| Tree family | Operations and conventions |
| --- | --- |
| General Tree, Binary Tree | Attach by parent key (and left/right position for Binary Tree), search, delete a whole subtree, clear |
| Complete Binary Tree | Append in level order, search, replace a deleted match with the last value, clear; duplicates allowed |
| Threaded Binary Tree | Insert, search, stack-free inorder via actual predecessor/successor threads, clear |
| Splay, Treap, Scapegoat, AA, 2-3-4 | Insert, search, delete, clear using each structure's own repair rules |
| 2-3 Tree | Insert with bottom-up splits, search, clear |
| Cartesian Tree | Append through a monotone spine, inclusive range minimum, clear |
| Radix Tree, Ternary Search Tree | Insert/search/delete lowercase words and clear; Radix also checks prefixes |
| Suffix Tree | Build text, find substring occurrence indices, clear; quadratic compressed suffix insertion |
| Interval Tree | Insert inclusive intervals, find one overlap through maximum-endpoint augmentation, clear; unbalanced BST variant |
| Order Statistic Tree | AVL insert/search/delete, rank (strictly smaller), zero-based selection, clear |
| Persistent Segment Tree | Path-copy updates from any existing version, exact inclusive range sum by version, reset values to zero |
| Sparse Table | Build static values, constant-time inclusive range minimum, clear; this requested menu entry is tabular rather than a tree |
| KD-Tree, Quadtree, Octree | Insert points, query an inclusive box, clear; KD is 2D, Octree is 3D |
| BVH | Insert 2D rectangles, query overlaps, clear; incremental AABB hierarchy without balancing |
| Merkle Tree | Update a data leaf, verify a supplied value using sibling hashes, reset values to zero |
| Van Emde Boas Tree | Insert/search/delete keys, strict successor, clear; sparse recursive universe 0..255 |

Examples start with ten elements. Numeric examples allow at most 64 elements;
word/text input accepts 1–32 lowercase letters. Persistent Segment Tree retains
at most eight versions of ten fixed values. Quadtree/Octree coordinates are
integers in [-1024,1024), with two-point buckets and depth at most eleven.
Merkle Tree hashes ten data leaves and six empty-byte padding leaves with SHA-256;
displayed digests are shortened, but comparisons use the complete digest. Its
padded shape differs from Certificate Transparency log trees.
Tree playback records at most 96 detailed events, executes the whole operation,
reports omitted events, reserves fixed scene bounds, and commits only its final
clone. Rejected requests preserve the committed model and ID counters.

The additional hash structures start with ten entries (ten physical servers for
the ring), use shared automatic playback, and retain stable record IDs across
relocation and resizing. Their action sequences cap detailed traces at 96 events,
execute every operation fully, disclose omitted events, and commit only the final
clone. Key/value inputs accept all whole safe integers, including negatives.

| Hash structure | Operations and storage policy |
| --- | --- |
| Open Addressing Hash Table | Insert/update, lookup, delete, clear; linear probing and reusable tombstones |
| Separate Chaining Hash Table | Insert/update, lookup, delete, clear; actual linked bucket chains, reusing Hash Map storage |
| Robin Hood Hash Table | Insert/update, lookup, delete, clear; greater-distance arrivals displace residents; deletion shifts backward |
| Cuckoo Hash Table | Insert/update, two-candidate lookup/delete, clear; held evictions, up to eight larger-table rebuilds |
| Hopscotch Hashing | Insert/update, bitmap-guided lookup/delete, clear; four-position neighborhoods and legal hole relocation |
| Extendible Hashing | Insert/update, lookup, delete, clear; shared directory aliases, three-record buckets, local/global depths |
| Linear Hashing | Insert/update, lookup, delete, clear; three-record pages, overflow links, and a round split pointer |
| Perfect Hash Table | Build a distinct static key set, exact membership lookup, clear; two-level FKS tables rather than dynamic insert/delete |
| Consistent Hashing Ring | Add/remove server, route a key, inspect ten sample assignments, clear; three virtual nodes per physical server |

Mutable hash tables are capped at 64 records. Hopscotch retries capacities up to
256 slots; cuckoo rebuilds use up to 256 slots per table; extendible global depth
is capped at eight. Exhausted placement attempts restore entries, capacities,
metadata, and ID counters. Extendible deletion retains its directory; linear
hashing deletion retains split progress. Clear restarts their initial metadata.
Perfect construction accepts 1–64 distinct CSV keys, tries at most 128 primary
seeds and 128 secondary seeds per bucket, and retains the old table on failure.
Candidates are shown separately until the complete static set is constructed.
The ring accepts at most sixteen server IDs and does not store routed keys or
simulate a network. Tokens are equally spaced in sorted clockwise order in the
diagram; labels show actual 32-bit positions, so angle is not hash distance.

The extended linear structures offer these actions:

| Structure | Allowed actions |
| --- | --- |
| Skip List | Insert a key, Search by key, Delete a key, Clear |
| Unrolled Linked List | Insert at index, Search by value, Delete by value, Clear |
| XOR Linked List | Append a value, Search by value, Delete by value, Clear |
| Gap Buffer | Insert text, Move the gap, Delete text, Search for text, Clear |
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

The additional priority structures offer these actions:

| Structure | Allowed actions |
| --- | --- |
| Priority Queue | Enqueue with priority, Dequeue highest priority, Peek, Clear |
| Binary Max-Heap | Insert, Extract maximum, Peek maximum, Clear |
| Binomial Heap | Insert, Extract minimum, Peek, Meld a donor, Clear |
| Fibonacci Heap | Insert, Extract minimum, Decrease key by visible ID, Peek, Meld a donor, Clear |
| Pairing Heap, Leftist Heap, Skew Heap | Insert, Extract minimum, Peek, Meld a donor, Clear |
| Indexed Priority Queue | Insert key / priority, Change priority, Delete by key, Extract minimum, Peek, Clear |
| Monotonic Queue | Push next window value, Peek window maximum, Clear window |

Priority Queue uses a binary min-heap and FIFO tie-breaking. Binomial Heap links
equal-degree trees through child/sibling pointers. Fibonacci Heap shows circular
root lists, consolidation, loss marks, and cascading cuts; its numeric handle Map
adds transfer work to meld. Pairing Heap uses two-pass extraction; Leftist Heap
repairs null-path ranks, while Skew Heap swaps children unconditionally. Indexed
Priority Queue updates an inverse key-to-position Map after every exchange.
Monotonic Queue maintains a decreasing deque for the latest ten arrivals and
shows candidate nodes separately from its circular window history.

The existing binary min-heap remains a separate structure. New heap examples
allow up to 64 nodes. Meld accepts 1–16 donor values and includes donor-building
cost in its complexity information. Playback keeps at most 96 detailed frames,
executes the complete operation, and reports any omitted events. Amortized bounds
are identified explicitly in action information.

Gap Buffer, Rope, Trie, Radix Tree (Patricia Trie), Ternary Search Tree, and
Suffix Tree belong to **String / Text**, with their models and actions under
`DataStructuresOverview/StringText/`.

The five additional text indexes have their own models, layouts, and actions:

| Structure | Allowed actions |
| --- | --- |
| Suffix Array | Build from text, Find substring positions, Clear |
| Suffix Automaton | Build from text, Append text, Contains substring, Clear |
| Aho-Corasick Automaton | Build pattern dictionary, Scan text for all patterns, Clear |
| Directed Acyclic Word Graph (DAWG) | Build word dictionary, Contains complete word, Clear |
| FM-Index | Build text index, Find substring positions, Clear |

Suffix Array, Suffix Automaton, and FM-Index start with ten source characters;
Aho-Corasick and DAWG start with ten dictionary words. Build and pattern input
accepts 1–32 lowercase letters. Dictionaries accept 1–16 distinct comma-separated
words and at most 128 total letters. Aho-Corasick scans up to 128 letters and
reports all overlaps using zero-based `[start, end)` ranges. Suffix Automaton
supports online append up to 64 source characters, with actual clone states and
suffix links. The dictionary DAWG merges equivalent right languages through
bottom-up trie minimization; it is distinct from the single-text suffix automaton.

Suffix Array uses comparison merge sort and adjacent LCP scans, with construction
bounds shown in its info dialog. Its searches and FM-Index searches return all
zero-based positions in suffix order. FM-Index shows BWT, cumulative counts, dense
exclusive-prefix Occ counters, and suffix samples selected by position modulo four.
It locates unsampled positions through LF steps and discards the full source and
suffix array after construction. Dense Occ is an uncompressed teaching choice,
not a claim of production FM-index compression. All actions reuse automatic
playback, immutable snapshots, final-frame commits, and full Reset.

The additional tree structures offer these actions:

| Structure | Allowed actions |
| --- | --- |
| Trie | Insert a word, Search by word, Check a prefix, Delete a word, Clear |
| Rope | Insert text, Concatenate text, Read character by index, Delete text, Clear |
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
