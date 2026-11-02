# Component structure

All React components belong under `src/components/`.
`App` is the root of Computer Science Visualizer. Feature folders follow the
menu hierarchy: main category, subcategory, structure, then action. Use
`DataStructuresOverview` and `DataStructuresAlgorithms` for the current main
categories, with consistent PascalCase spelling.

## Data structures and actions

Use `src/components/DataStructuresOverview/<Group>/<Structure>/` for canonical
models, structure layouts, and Overview actions. Overview groups map to `Linear`,
`QueuePriority`, `Trees`, `Graphs`, and `HashBased`. Queue, Deque, CircularBuffer,
and Heap belong under `DataStructuresOverview/QueuePriority/`.

PriorityQueue, BinaryMaxHeap, BinomialHeap, FibonacciHeap, PairingHeap,
LeftistHeap, SkewHeap, IndexedPriorityQueue, and MonotonicQueue also live under
`DataStructuresOverview/QueuePriority/`, each with its own model, layout, and
action folders. `PriorityFeatures` connects the new actions to App.
`PriorityModel`, `PriorityLayout`, `BinaryPriorityHeap`, and `MeldableBinaryHeap`
share only contracts, scene geometry, and actual common heap primitives within
that group. Keep each heap's distinct linking, consolidation, rank, or cut policy
in its own model. Shared priority catalogs and input validation live under
`src/visualization/`. Reuse the bounded `LinearAnimation` trace recorder and
`StructuredLinearAction` playback adapter; their contract also supports heaps.

Use `src/components/DataStructuresAlgorithms/Sorting/Array/` for all sorting
actions and array-specific sorting helpers, traces, and layouts. Keep the single
canonical FixedArray model and its ordinary-operation layout under
`DataStructuresOverview/Linear/Array/`; sorting imports that model. Retain its
existing sorting entry points, which delegate to the relocated sorting helpers.

Use `src/components/DataStructuresAlgorithms/GraphsTraversal/<Graph>/` for
BreadthFirst, DepthFirst, ShortestPath, TopologicalSort, and MaxFlow actions where supported.
Keep each graph's canonical model and editing/search/clear actions under
`DataStructuresOverview/Graphs/<Graph>/`. Both branches share the same models and
scene/playback contracts; never duplicate model classes to satisfy the hierarchy.

Keep action-specific entities together in the action's category folder. Keep a
canonical model and its supporting entities beside its Overview actions, with
algorithm-specific helpers beside their Algorithms actions. Follow the
existing `LinkedList/` organization: `LinkedList.ts` and `LinkedListLayout.ts`
sit beside `AddInTheMiddle/`. Do not split structure-specific entities into
top-level model or visualization folders.

Inside each data structure folder, create a PascalCase folder for each action,
such as `AddInTheMiddle` or `SearchByValue`. Every action folder must contain
a `.tsx` React component and a separate `.css` file with its styles. Name both
files after the action and import the stylesheet from the component.
Keep action-specific sequence classes, such as `InsertionAnimation.ts`, in the
same action folder. Use relative imports with exact directory casing. Overview
actions normally import their model and layout from the parent folder;
Algorithms actions import the canonical model from its Overview location and
algorithm-specific layouts from the Algorithms structure folder.
Tree action components use key terminology: `SearchByKey`, `DeleteByKey`, and
the B+ Tree's `RangeFromKey`. Match their class, folder, `.tsx`, and `.css` names.
Trie uses word terminology (`SearchByWord`, `DeleteByWord`, and `StartsWith`),
and R-Tree deletes spatial records with `DeleteById`. Segment and Fenwick actions
use `Update` / `Add`, `PrefixSum`, and `RangeSum` as appropriate.
AST keeps its grammar parser beside its model and uses `Build`, `Preorder`,
`Inorder`, `Postorder`, `Evaluate`, and `Clear` action folders. Reuse its parser
for expression validation in the shared input dialog.

```text
src/components/
  DataStructuresOverview/
    Linear/
      LinkedList/
        LinkedList.ts
        LinkedListLayout.ts
        AddInTheMiddle/
          AddInTheMiddle.tsx
          AddInTheMiddle.css
          InsertionAnimation.ts
      Array/
        FixedArray.ts
        ArrayLayout.ts
        AddInTheMiddle/
          AddInTheMiddle.tsx
          AddInTheMiddle.css
        SearchByValue/
          SearchByValue.tsx
          SearchByValue.css
    QueuePriority/
      Queue/
        Queue.ts
        Enqueue/
          Enqueue.tsx
          Enqueue.css
          InsertionAnimation.ts
      Heap/
        Heap.ts
        Insert/
          Insert.tsx
          Insert.css
          InsertAnimation.ts
    Graphs/
      SimpleGraph/
        Graph.ts
  DataStructuresAlgorithms/
    Sorting/
      Array/
        ArraySortingLayout.ts
        QuickSort/
          QuickSort.tsx
          QuickSort.css
          QuickSortAnimation.ts
    GraphsTraversal/
      SimpleGraph/
        BreadthFirst/
          BreadthFirst.tsx
          BreadthFirst.css
          BreadthFirstAnimation.ts
  Renderer/
    Renderer.tsx
    Renderer.css
  MainMenu/
    MainMenu.tsx
    MainMenu.css
```

## Renderer

Place the shared `Renderer` component in `src/components/Renderer/`. Match the
folder's PascalCase spelling exactly. It displays data structures and animates their
dynamic changes. Reuse it across data structure actions instead of creating a
separate rendering system for every action.

Keep data structure operations separate from rendering and animation timing.
Keep the algorithm overview dialog in `src/components/AlgorithmInfo/`, outside
the renderer. The app supplies its action information and open/close state.

Scenes can supply an optional `hint` with a title, description, and optional code.
The renderer displays it in a small block below the node-state legend and above
the action pseudocode, outside the SVG. Omit the block entirely when no hint is
supplied. Keep structure-specific hint content in its layout, not in the renderer.

## Shared action playback

Use `src/components/ActionPlayback/` for the shared playback component and its
styles. Each action's component supplies its own class-based definition with phase
labels, explanations, and a factory method that creates its animation plan.
Keep structure-specific algorithms and model types in their action folders;
reuse the common animation session and progress display. Accept an optional
operation value, an optional upper range bound, and completion callback so actions can collect input separately
and unlock further operations after the result is committed. Otherwise use each
action's default value. Keep normal playback speed and do not render a bottom panel.
The app header provides the `playback-toolbar` host. `ActionPlayback` renders
its step description and noninteractive progress bar there through a React portal, keeping them
connected to the same controller without adding a bottom-panel wrapper.
Actions start automatically and run to completion. The header's full structure
Reset is the only playback control; do not add pause, play, or seeking controls.
The renderer provides the `renderer-code` host above the diagram in its center
column. `ActionPlayback` renders the current step's pseudocode there through a
second portal, using the same playback index as the scene and timeline.

## Shared visualization infrastructure

Keep contracts and infrastructure used across structures in `src/visualization/`,
such as `Scene.ts`, `AnimationController.ts`, and `StructureCatalog.ts`.
Structure-specific layouts belong in their structure's folder under
`src/components/DataStructuresOverview/`, alongside the canonical model.
Algorithm-specific layouts stay beside their algorithm helpers under
`DataStructuresAlgorithms/`.

## Main menu

Place the `MainMenu` component in `src/components/MainMenu/`. It lets the user
choose the data structure. Keep its canvas action card in
`src/components/MainMenu/ActionMenu/`, with a `.tsx` class component and a separate
`.css` file. The app supplies this card to the shared renderer as a child so
action selection remains separate from drawing the scene.
Each action row has a separate info button on its right. It opens that action's
overview dialog without selecting or restarting the action.
Use two consistent card styles for menu buttons. Category, group, and structure
cards have one leading icon, a heading, and up to two description lines; omit
trailing arrow icons. Action cards have a heading and up to two description lines,
with no icon inside the card. Keep their info controls separate and vertically
centered beside them. Both styles use the shared --menu-card-height token (112px),
matching text sizes and spacing. Allow headings up to two lines for long names;
keep full text in the DOM and provide title text for clipped content. Preserve
keyboard focus visibility and the independently scrolling action list.
The card's top-left back button reopens the current structure group's list,
preserving the selected structure and playback session.
The card's top-right corner has a larger info button for general structure
information. Keep that separate dialog in `src/components/StructureInfo/`;
it shows a one- or two-sentence introduction and a two-column table of four or
five use cases, pairing each area of use with a short explanation of its purpose.
Below the table, list only verified uses in real systems, language runtimes,
standard libraries, or established application libraries. Each entry needs a
primary documentation or source link and a short explanation of what the
technology uses the structure for. Identify implementation variants explicitly.
There is no minimum example count. Exclude competitive-programming collections,
educational algorithm catalogs, and standalone projects without evidence of real
application use. If no use can be verified, leave the list empty and state that
limitation without claiming the structure is never used anywhere.
Shared value/index dialogs belong in `src/components/ActionInput/`, with their
request configuration and validation in `src/visualization/ActionInputRequest.ts`.
Reuse them for Array, Linked list, Stack, Queue, Deque, Doubly linked list,
Circular buffer, all tree types, Hash Map, Hash Set, and Bloom Filter.
The additional Trie, Heap, Segment Tree, Fenwick Tree, R-Tree, LSM Tree, and AST
use structured fields in the same dialog. Keep field validation in
`src/visualization/StructuredTreeInput.ts`, with its request attached to
`ActionInputRequest`. Word, expression, and rectangle input must not be coerced through the
legacy single-number callback. Reuse the shared playback session through
`StructuredTreeAction`; keep each action's component, CSS, sequence, and
complexity information in its own action folder.
Hash Map insertion collects
separate whole-number key and value fields; the second value is not a range bound.
These dialogs are separate from the info dialogs and start an action only when
the user confirms valid input. Keep structure-specific operations in
their existing models and action folders.
The B+ Tree range action uses two numeric fields in this shared dialog and passes
both inclusive bounds through the action definition and playback to its model.

Create these components and folders as their features are implemented. The tree
defines the required organization; it does not mean those features already exist.

## Extended linear structures

Keep SkipList, UnrolledLinkedList, XORLinkedList, GapBuffer, BitSet,
SparseArray, and FreeList under `DataStructuresOverview/Linear/`. Each owns its model,
layout, and action folders. `LinearFeatures` connects their class components and
action-owned information to App; shared contracts, catalog, input validation,
scene helpers, and trace recording live in `src/visualization/Linear*.ts` and
`StructuredLinearInput.ts`. Reuse `StructuredLinearAction` and `ActionPlayback`.
Do not reuse a tree model or tree layout to stand in for these linear structures.

Rope belongs under `DataStructuresOverview/Trees/Rope/`, with `RopeFeatures`
beside the other tree dispatchers. Its immutable AVL model still uses the shared
trace/input/playback contracts and is retained in the shared trace-model catalog;
menu membership comes from StructureCatalog rather than the adapter's name.

Numeric lists allow up to 64 values, text models up to 256 ASCII characters,
and each text input up to 32 characters. Record at most 96 detailed trace frames
per action while still executing the complete operation; disclose omitted events
in the result description. Keep scene bounds fixed throughout each playback.
The simulated address table in XORLinkedList must be described explicitly;
do not claim JavaScript exposes native pointers or saves memory through XOR links.

## Hash-based structures

Keep Hash Map, Hash Set, and Bloom Filter under
`src/components/DataStructuresOverview/HashBased/`, each with its model, layout, and action
folders. Hash Set composes the chained Hash Map storage. Reuse shared hashing,
bucket layout, and trace playback from `src/visualization/` where they serve more
than one structure. Each action has its own sequence, class component, and CSS file.

## Graphs

Keep the original undirected Graph under DataStructuresOverview/Graphs/SimpleGraph
and DirectedGraph, WeightedGraph, DAG, and Multigraph beside it. GraphFeatures
dispatches only Overview actions; GraphTraversalFeatures belongs under
DataStructuresAlgorithms/GraphsTraversal and dispatches graph algorithms.
GraphModel, GraphSceneLayout, and
GraphAnimation are shared across these variants. Each allowed action has its own
component, CSS, animation class, and complexity description. Reuse
StructuredGraphAction for playback and GraphActionInput for structured dialogs;
shared field contracts live in StructuredActionInput. Expose variant-specific real
technology examples with primary links and explain differences from this model.

BipartiteGraph, CompleteGraph, TreeGraph, Hypergraph, FlowNetwork,
FunctionalGraph, AdjacencyMatrix, AdjacencyList, EdgeList, and
CompressedSparseRow also own canonical models, layouts, and editing action
folders under Overview/Graphs. Keep their BFS/DFS actions and FlowNetwork's
MaxFlow under Algorithms/GraphsTraversal. ExtendedGraphFeatures and
ExtendedGraphTraversalFeatures dispatch the two scopes separately.
ExtendedGraphModel shares vertex identity, validation, traversal, and trace
contracts; StoredEdgeGraph shares actual edge-record storage only where used.
Matrix, adjacency rows, and CSR must retain their distinct canonical storage.
Reuse StructuredLinearAction, LinearAnimation, LinearScene, and
ExtendedGraphInput rather than copying playback or dialogs. ExtendedGraphCatalog
connects their models/layouts to previews and App; ExtendedGraphActionCatalog
owns action availability. Both scopes use the same committed model instance.

Algorithm menu groups stay in MainMenu/MenuNavigation alongside root-category
navigation. Reuse MainMenu to list graphs under Algorithms > Graphs Traversal;
list Array under Sorting with Bubble Sort, SelectionSort, InsertionSort,
BinaryInsertionSort, MergeSort, QuickSort, HeapSort, ShellSort, CountingSort,
RadixSort, BucketSort, TimSort, IntroSort, DualPivotQuickSort, BlockMergeSort,
WikiSort, Smoothsort, TreeSort, TournamentSort, PatienceSort, CycleSort, CombSort,
CocktailShakerSort, GnomeSort, OddEvenSort, OddEvenMergeSort, BitonicSort,
PairwiseSortingNetwork, SampleSort, ParallelMergeSort, ParallelQuickSort,
ExternalMergeSort, PolyphaseMergeSort, NaturalMergeSort, Flashsort,
AmericanFlagSort, Spreadsort, Burstsort, PigeonholeSort, InterpolationSort,
LibrarySort, SplaySort, StrandSort, PancakeSort, StoogeSort, SlowSort, BogoSort,
and SleepSort.
Each action owns its component,
CSS, and sequence folder under DataStructuresAlgorithms/Sorting/Array. Keep the
model entry points in the canonical Overview FixedArray, with shared sorting
algorithms, trace, layout, and snapshot helpers in the Algorithms Array folder.
HybridArraySort implements TimSort, IntroSort, and Dual-Pivot QuickSort on the
existing allocation. BlockMergeArraySort implements buffered block-wise multiway
merging with stable ties and O(n) working storage.
WikiArraySort implements cache-free internal-buffer block merging; SmoothArraySort
implements Leonardo heaps. TreeArraySort, TournamentArraySort, and PatienceArraySort
keep their BST, winner-tree, and pile/heap operations beside the sorting helpers.
ArraySortOperations shares only comparison, exchange, and trace primitives.
CycleArraySort, CombArraySort, CocktailShakerArraySort, and GnomeArraySort keep
their cycle writes, shrinking gaps, alternating sweeps, and backtracking beside
the array model, reusing the existing trace and playback classes.
ArrayNetworkSort executes shared comparators; OddEvenArraySort,
OddEvenMergeArraySort, BitonicArraySort, and PairwiseNetworkArraySort own their
stage schedules. SampleArraySort owns regular sampling, splitter selection,
bucket classification, stable local merge sorting, and concatenation. Keep all
these helpers in DataStructuresAlgorithms/Sorting/Array; use the shared layout for comparator links and
separate sample/splitter/bucket/output rows.
ArrayMergeOperations shares stable adjacent merging with a lazy buffer.
NaturalMergeArraySort owns natural-run detection and pairwise merge passes.
ParallelArraySort owns the two-lane virtual scheduler and fork/join dependency
graph for merge sort and three-way quicksort. ExternalArraySort owns bounded
run generation, balanced four-tape merging, and three-tape Fibonacci polyphase
merging. Extend ArraySortTrace and ArraySortingLayout for immutable task and
storage snapshots; keep algorithm execution outside the renderer.
IntegerDistributionSort shares exact bounds, histogram permutation, and small
insertion ranges. FlashArraySort owns Flashsort class cycles and cleanup;
AmericanFlagArraySort owns fixed hexadecimal MSD recursion; SpreadArraySort
owns adaptive range splits and the comparison-sort fallback. BurstArraySort
keeps its encoded integer keys and bursting prefix containers beside the sorting helpers;
ArraySortTrace and ArraySortingLayout describe its trie and leaf records.
PigeonholeArraySort owns guarded full-record hole lists and stable gathering.
InterpolationArraySort owns stable histogram placement and collision cleanup.
LibraryArraySort owns the separate sparse shelf, gap-aware upper-bound search,
nearest-gap shifts, and doubling insertion rounds. SplayArraySort keeps mutable
parent links and rotations beside the sorting helpers; StrandArraySort owns linked
remaining/strand/merged lists. PancakeArraySort performs only prefix reversals.
RecursiveDemoSort bounds recorded detail and rejects oversized demonstrations;
StoogeArraySort and SlowArraySort retain their distinct exact recurrences.
BogoArraySort owns seeded shuffles, the attempt budget, and rollback on failure.
SleepArraySort owns the virtual deadline heap and never creates real timers.
ActionMenu receives an explicit
ActionScope, and App preserves the selected scope independently of menu browsing.
ActionOrdering belongs beside ActionMenu. It sorts copies of algorithm action
choices alphabetically or by average time/memory growth using action-owned
AlgorithmInformation supplied by App. Keep catalog order and Overview actions
unchanged; sort selection is local menu state and does not affect playback.
Algorithm structure buttons show at most two example names in one truncated line;
keep the complete list in the independently scrolling action panel.
Do not duplicate graph models or sequence classes to expose traversal examples
in the Algorithms branch.

## Extended tree structures

The 24 extended tree models and their layouts live in individual folders under
`DataStructuresOverview/Trees/`. `UnorderedBinaryTree` is the ordinary Binary Tree;
the existing `BinaryTree` and `binary-tree` key remain the BST. Use
`ExtendedTreeFeatures` for their action components and action-owned information,
`ExtendedTreeDefinitions` / `ExtendedTreeActionCatalog` for menu entries, and
`ExtendedTreeCatalog` through `AdditionalTreeCatalog` for model storage and scenes.
Keep each action's component, CSS, and animation class in its action folder.
Reuse `StructuredTreeAction` / `ActionPlayback`, `ExtendedTreeAnimation` for bounded
traces, and `ExtendedTreeInput` through `StructuredTreeInput` for dialogs.

`SearchTreeModel` shares only actual BST links, rotations, metadata, and ordered
operations. Concrete models own splaying, priority rotations, scapegoat rebuilding,
AA levels, and AVL order-statistic repair. `OrthantTreeModel` shares the actual
2D/3D midpoint subdivision algorithm. The 2-3-4 adapter reuses `BTree` because a
minimum-degree-two B-tree is exactly a 2-3-4 tree; 2-3 Tree owns bottom-up splitting.
Keep all other canonical storage distinct. Persistent roots share immutable nodes;
draw each canonical node once with multiple incoming links. Threaded layouts draw
threads separately from child links. Sparse Table uses rows of cached intervals.
