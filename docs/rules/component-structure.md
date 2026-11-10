# Component structure

All React components belong under `src/components/`.
`App` is the root of Computer Science Visualizer. Feature folders mirror the
data-structure category hierarchy: category, subject, structure, then action. The
menu groups these categories under the Algorithms root; this extra navigation
level does not add an Algorithms wrapper directory. Use
`FundamentalDataStructures`, `AdvancedDataStructures`, and `DataStructuresAlgorithms`
with exact PascalCase spelling. MainMenu/MenuStructureCatalog.ts defines structure
membership. Do not retain a separate Overview folder or duplicate canonical models.
Use concise subject labels such as Probabilistic, Spatial Indexes, and Memory / I/O.

## Data structures and actions

Canonical models, structure layouts, and ordinary-operation action folders live
under `src/components/<RootCategory>/<Subject>/<Structure>/`.
The subjects map to source directories as follows:

| Root category | Subject folder | Structure folders |
| --- | --- | --- |
| FundamentalDataStructures | Graphs | AdjacencyList, AdjacencyMatrix, BipartiteGraph, CompleteGraph, DAG, DirectedGraph, EdgeList, FunctionalGraph, Multigraph, SimpleGraph, TreeGraph, WeightedGraph |
| FundamentalDataStructures | HashBased | HashMap, OpenAddressingHashTable, SeparateChainingHashTable |
| FundamentalDataStructures | Linear | Array, DenseTensor, DoublyLinkedList, Grid2D, LinkedList, Stack |
| FundamentalDataStructures | QueuePriority | BinaryMaxHeap, CircularBuffer, Deque, Heap, PriorityQueue, Queue |
| FundamentalDataStructures | SetUnion | BitSet, DisjointSet, HashSet, Multiset, OrderedSet |
| FundamentalDataStructures | StringText | Trie |
| FundamentalDataStructures | Trees | AVLTree, BinaryTree, CompleteBinaryTree, GeneralTree, RedBlackTree, UnorderedBinaryTree |
| AdvancedDataStructures | Hashing | ConsistentHashingRing, CuckooHashTable, ExtendibleHashing, HopscotchHashing, LinearHashing, PerfectHashTable, RobinHoodHashTable |
| AdvancedDataStructures | Integrity | ChecksummedBlockTree, ContentAddressedLayers, MerkleTree |
| AdvancedDataStructures | MemoryIO | FreeList, LockFreeRing, MapleTree, MultiQueue, RequestTagArray, XArray |
| AdvancedDataStructures | MultiwayTrees | BPlusTree, BTree, TwoThreeFourTree, TwoThreeTree |
| AdvancedDataStructures | Probabilistic | BlockedBloomFilter, BloomFilter, CountMinSketch, CountingBloomFilter, CuckooFilter, HyperLogLog, QuotientFilter, ReservoirSamplingBuffer |
| AdvancedDataStructures | QueuesHeaps | BinomialHeap, FibonacciHeap, IndexedPriorityQueue, LeftistHeap, MonotonicQueue, PairingHeap, SkewHeap |
| AdvancedDataStructures | RangeQueries | FenwickTree, IntervalSet, IntervalTree, OrderStatisticTree, PersistentSegmentTree, SegmentTree, SparseTable |
| AdvancedDataStructures | SearchTrees | AATree, CartesianTree, ScapegoatTree, SplayTree, ThreadedBinaryTree, Treap, VanEmdeBoasTree |
| AdvancedDataStructures | Sequences | SkipList, UnrolledLinkedList, XORLinkedList |
| AdvancedDataStructures | SparseArraysMatrices | CompressedSparseRow, NumericalCSR, SparseArray, SparseCOO, SparseCSC |
| AdvancedDataStructures | SpatialIndexes | BKDTree, BallTree, BoundingVolumeHierarchy, FlatVectorArray, HNSWGraph, IVFIndex, KDTree, LSHIndex, Octree, Quadtree, RTree |
| AdvancedDataStructures | SpecializedGraphs | AddressSpaceGraph, CompactedDeBruijnGraph, FlowNetwork, Hypergraph, MinimizerIndex |
| AdvancedDataStructures | StorageIndexes | AppendOnlyLog, BRIN, FanoutArray, GiST, LSMTree, SSTable, SparseOffsetIndex, SparsePrimaryIndex, TimeIndex |
| AdvancedDataStructures | Syntax | AST |
| AdvancedDataStructures | TextSearch | AhoCorasickAutomaton, DAWG, FMIndex, GapBuffer, InvertedIndex, RadixTree, Rope, SuffixArray, SuffixAutomaton, SuffixTree, TernarySearchTree |

Use `FundamentalDataStructures/Linear/LinkedList/` as the ordinary-operation example.
Its model and layout sit beside AddInTheMiddle, SearchByValue, and other action
folders. Keep supporting entities used only by that structure beside its model.

Sorting actions, algorithm-specific helpers, traces, and layouts remain under
`DataStructuresAlgorithms/Sorting/Array/`. Import the one canonical FixedArray
model from `FundamentalDataStructures/Linear/Array/`; retain its sorting entry
points delegating to algorithm helpers. Never duplicate a model for an algorithm.

Graph algorithm actions remain under `DataStructuresAlgorithms/GraphsTraversal/<Graph>/`.
Import graph models from their actual Fundamental or Advanced subject directory.
The graph CSR model lives in Advanced/SparseArraysMatrices; HNSWGraph lives in
Advanced/SpatialIndexes; specialized graph models live in Advanced/SpecializedGraphs.
Algorithm and ordinary-operation branches share the same committed models and
scene/playback contracts. Moving model folders must not change algorithm behavior.

Place class-based dispatchers spanning subjects in `src/components/StructureFeatures/`.
This includes AppliedFeatures, LinearFeatures, NumericalFeatures, TreeFeatures,
ExtendedTreeFeatures, GraphFeatures, ExtendedGraphFeatures, PriorityFeatures,
SetUnionFeatures, HashFeatures, StringTextFeatures, and ProbabilisticFeatures.
Keep single-structure dispatchers with their structure: HeapFeatures beside Heap,
and RopeFeatures beside Rope. Shared dispatcher names describe model interfaces,
not category membership.

Keep helpers shared across subjects under `src/visualization/`, including
PriorityModel, PriorityLayout, BinaryPriorityHeap, MeldableBinaryHeap,
ExtendedTreeModel, SearchTreeModel, ExtendedGraphModel, ExtendedGraphLayout,
StoredEdgeGraph, HashTableModel, ProbingHashTable, NumericalModel, NumericalLayout,
and SetUnionModel. Subject-local shared helpers stay under their actual subject:
DenseArrayModel in Fundamental/Linear; SparseMatrixModel and CompressedMatrixModel
in Advanced/SparseArraysMatrices; StringTextModel and SuffixOrder in
Advanced/TextSearch; OrthantTreeModel in Advanced/SpatialIndexes; ByteLog and
SortedRecords in Advanced/StorageIndexes; ProbabilisticModel in Advanced/Probabilistic.
Reuse genuine shared primitives while keeping distinct structure policies in
concrete models. Shared action catalogs and validation remain in src/visualization.

Inside each data structure folder, create a PascalCase folder for each action,
such as `AddInTheMiddle` or `SearchByValue`. Every action folder must contain
a `.tsx` React component and a separate `.css` file with its styles. Name both
files after the action and import the stylesheet from the component.
Keep action-specific sequence classes, such as `InsertionAnimation.ts`, in the
same action folder. Use relative imports with exact directory casing. Ordinary-operation
actions normally import their model and layout from the parent folder;
Algorithms actions import the canonical model from its canonical category location and
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
  FundamentalDataStructures/
    Linear/
      Array/
        FixedArray.ts
        ArrayLayout.ts
        AddInTheMiddle/
          AddInTheMiddle.tsx
          AddInTheMiddle.css
      LinkedList/
        LinkedList.ts
        LinkedListLayout.ts
        AddInTheMiddle/
          AddInTheMiddle.tsx
          AddInTheMiddle.css
          InsertionAnimation.ts
    QueuePriority/
      Queue/
        Queue.ts
  AdvancedDataStructures/
    StorageIndexes/
      SSTable/
        SSTable.ts
        SSTableLayout.ts
        Build/
          Build.tsx
          Build.css
          BuildAnimation.ts
    SpatialIndexes/
      HNSWGraph/
        HNSWGraph.ts
    Integrity/
      MerkleTree/
        MerkleTree.ts
  DataStructuresAlgorithms/
    Sorting/
      Array/
        QuickSort/
          QuickSort.tsx
          QuickSort.css
          QuickSortAnimation.ts
    GraphsTraversal/
      HNSWGraph/
        BreadthFirst/
          BreadthFirst.tsx
          BreadthFirst.css
          BreadthFirstAnimation.ts
  StructureFeatures/
    AppliedFeatures.tsx
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

Do not render inline scene hints or step pseudocode. Use the shared Show pseudocode
button below the node-state legend only for Data Structures Algorithms actions in
Sorting and Graphs Traversal. Keep each static listing with its algorithm code
under `DataStructuresAlgorithms/`.

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
In Sorting and Graphs Traversal, the renderer provides the `renderer-code` host
below the legend for `ActionPlayback` to render the `PseudocodeDialog` trigger
and dialog. Each action in those groups supplies a static listing directly or
through a structured action adapter.

## Shared visualization infrastructure

Keep contracts and infrastructure used across structures in `src/visualization/`,
such as `Scene.ts`, `AnimationController.ts`, and `StructureCatalog.ts`.
Structure-specific layouts belong beside their canonical model in the matching
FundamentalDataStructures or AdvancedDataStructures subject folder.
Algorithm-specific layouts stay beside their algorithm helpers under
`DataStructuresAlgorithms/`.

## Main menu

Show Algorithms and System Components Overview at the root, in that order. Algorithms
contains Fundamental Data Structures, Data Structures Algorithms, and Advanced
Data Structures in that fixed order. Back navigation and restored selection paths
include this Algorithms parent. Keep existing feature source directory names.

Hardware overviews use their own component tags: CPU, RAM, Disk, and Bus. Store
the relevant components in each overview's catalog choice and reuse
`RealSystemsAlgorithms/OverviewTags/` across menu cards, workspace cards, and
search results. Keep its styles separate from algorithm usage tags. Fundamental
CPU mechanisms use CPU; current Complex lessons use CPU, RAM, and Bus for their
processor, memory-system, and interconnect coverage. Disk is available for future
device lessons. Overviews do not show Real Systems, Educational, or Popular tags.

Storage overview cards can also show HDD or SSD from optional `devices` metadata,
alongside the Disk component tag. HDD sector access uses HDD; the SSD FTL, garbage
collection, and wear-leveling lessons use SSD. Universal storage mechanisms such
as the NAND cell lesson omit device tags. Propagate device metadata to workspace
cards and search results through the shared OverviewTags component. Device tags
are separate from CPU architecture tags.

CPU-related overview cards may also show architecture tags from their catalog's
`architectures` metadata. Use x86 for the named x86 fence and locked-instruction
overviews, and ARM for the named Arm barrier, acquire/release, exclusive, LSE, and
instruction-synchronization overviews. Architecture-independent mechanisms have an empty
architecture list and show no architecture tag: this includes register renaming,
out-of-order execution, history/return prediction, store buffering, cache-coherence
protocols, and general TLB/table walking. A product cited as an example does not
make the mechanism exclusive to that product's architecture. Render architecture
tags alongside component tags in workspaces and search results. Add other
architecture labels only when a corresponding specific overview exists. An empty
architecture list does not imply that every processor implements the mechanism.
For coherence protocols, distinguish MESI, MESIF, and MOESI and cite the exact
protocol and cache/interconnect implementation. Keep only verified examples:
MESIF currently cites Intel Xeon 7500-series; MOESI cites Arm Cortex-A53 and AMD
Ryzen. Optional implementation notes explain this distinction in Real technologies.
Use the overview-specific descriptions for search technology names so newly
verified examples appear consistently in the popup and search results.

Overview descriptions use the dedicated class-based dialog and stylesheet in
`RealSystemsAlgorithms/SystemOverviewInfo/`, with the heading System Components
overview. Its information contract contains the name, a short definition, the
problem solved, an ordered flow, and sourced real technology/product usage. Show
What it is, Problem it solves, Step-by-step flow, and Real technologies. Omit the
Real products section from component overviews. Author each flow in no more than ten steps, combining related events
when needed rather than dropping later steps. Keep each lesson's class-based
overview description beside its animation in a matching `*Overview.ts` file.
The CPU and Complex catalogs expose these through `describeOverview`; do not
construct an animation to obtain popup text. Omit complexity tables and
explanations, Teaching model, and Terms used in this action. Both hardware
workspaces target `system-components-overview`.
Keep AlgorithmInfo for data-structure actions and algorithms. Reuse global dialog
viewport sizing, scrolling, and sticky close-control rules for the overview popup.

Keep the System Components Overview category hierarchy in
`MainMenu/AdvancedAlgorithmCatalog.ts`, separate from structure membership and
data-structure algorithm scopes. Hardware and Network each contain Fundamental
and Complex, always displaying Fundamental first and Complex second rather than
sorting that pair alphabetically. Choosing Hardware/Fundamental or Hardware/Complex
opens its workspace action panel directly and closes MainMenu; do not render a
second lesson list inside the menu. Each workspace can open with no lesson selected,
showing all overview cards and their separate info buttons while the diagram waits
for selection. The Renderer supports action children without a scene and accepts
an optional empty-state message. Selecting an overview starts playback; its info
button only opens information. Workspace Back and header menu reopen Hardware,
where selecting the current group preserves its session. Hardware/Fundamental
includes all implemented fundamental overviews without CPU, Disks, or Memory cards;
Network/Fundamental contains Physical, Data Link, Network, Transport, Session,
Presentation, and Application in OSI layer order. Complex categories describe
cross-component hardware systems or systems spanning network layers. Unimplemented
leaves show an empty-state message. Reuse MainMenu and MenuNavigation for parent
navigation rather than adding empty implementation directories.

Do not add empty hardware-component categories or operating-system disk scheduling
policies. The former mq-deadline, BFQ, and Kyber lessons and destinations were removed.

Keep CPU hardware lessons under `RealSystemsAlgorithms/Hardware/Fundamental/CPU/`,
with RegisterRenaming, OutOfOrder, BranchPrediction, and ReturnStack action folders.
This source grouping is not a menu level. Search selections open the Fundamental
workspace and start the selected lesson. Menu reopening and workspace Back lead to
Hardware, without an intermediate lesson picker.
Each owns its mechanism model, component, CSS, animation, layout, and sourced
information. Diagrams show the enclosing CPU core, register files or history/
return registers, instruction cache, and data-cache context. Highlight actual
instruction, operand, result, retirement, and prediction flows. Cache accesses,
hit/miss timing, and precise physical wiring are outside these bounded models.
CpuModel, CpuLayout, CpuTrace, and CpuLesson share only visual-state snapshots,
scene generation, and playback contracts. Use the cpu-hardware Scene kind and
distinct CPU search/menu destinations, preserving data-structure and Complex
destinations. CpuWorkspace reuses Renderer, ActionView, ActionPlayback, and the
SystemOverviewInfo dialog and shared info icon styling. Keep CPU operating-system
schedulers out of this branch. Cross-component cache/memory mechanisms belong
directly under `RealSystemsAlgorithms/Hardware/Complex/`, without CPU, cache,
or memory subcategory folders. Its twelve lesson folders own their models,
components, CSS, animations, and sourced descriptions. HardwareModel,
HardwareLayout, and HardwareLesson share snapshots, bounded recording, scene
geometry, and playback contracts; HardwareWorkspace reuses Renderer,
ActionView/ActionPlayback, and SystemOverviewInfo. Use the hardware-system Scene kind
and distinct HardwareAlgorithmCatalog menu/search destinations. CoherenceModel
shares line-transfer primitives with explicit MOESI/MESIF state policies;
PublicationModel shares data/flag observation primitives. Keep instruction and
protocol semantics separate from scene recording and timing.
HardwareDiagram and HardwareSceneLayout live in `src/visualization/` and share
only placements, labeled CPU/cache/memory regions, connections, and scene
geometry across Fundamental CPU and Complex lessons. Keep each mechanism's topology in its own layout (shared publication
and coherence layouts stay at Complex level). Snapshots carry independent diagram
metadata; CpuLayout and HardwareLayout delegate scene geometry to the shared
HardwareSceneLayout. Render
region boundaries behind nodes and connections, with region titles above paths.
Complex/HardwareSystemLayout groups the logical components into large CPU,
Bus/Interconnect, and Memory-system blocks. Cores, private caches, registers, and
MMU units stay inside CPU; shared memory and PoU/backing state stay outside it.
Route cross-block paths through the CPU, bus-side, and memory-side interfaces,
including visible flows inside the bus and memory blocks. Preserve model values
and transaction meaning while arranging the hierarchy. These are logical
subsystem boundaries, not claims about physical chip/package wiring. Identify
coherent state versus actual RAM contents explicitly. Add Disk or other device
blocks only for mechanisms that actually include those devices.
Highlight the actual request, data, invalidation, or completion transaction; do
not infer transfers just because two displayed values changed.

Keep the root menu's search component and catalog index in `MainMenu/Search/`.
Place its search trigger in the app header between the menu button and brand
icon. It opens the existing search panel directly; do not show a search trigger
beside Categories or a back button in the search panel. Close and Escape dismiss
search and restore focus to the header search button. Keep back buttons for
ordinary category and group navigation.
Index only names, Area of use labels, and verified technology/product names.
Exclude summaries, card descriptions, use-case explanations, usage notes,
complexity explanations, and terms. Algorithm names come from the same read-only
describe methods as their info dialogs, without constructing animations or
changing the selected model.
Search results retain the structure, scope, and optional algorithm action so App
can open a result through its usual structure loading and action-input flow.

Place the `MainMenu` component in `src/components/MainMenu/`. It lets the user
choose the data structure. Keep its canvas action card in
`src/components/MainMenu/ActionMenu/`, with a `.tsx` class component and a separate
`.css` file. The app supplies this card to the shared renderer as a child so
action selection remains separate from drawing the scene.
Each action row has a separate info button on its right. It opens that action's
overview dialog without selecting or restarting the action.
Use two consistent card styles for menu buttons. Category, group, structure,
and search-result cards have a heading and up to two description lines, with
no icon or reserved icon column. Keep the Close icon and Back arrow on navigation
controls, and retain the separate action info and sorting icons.
Action cards have a heading and up to two description lines,
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
Follow Real technologies with a separate Real products section, using the same
comma-separated linked-name format as the algorithm dialog. Keep curated product
labels in `StructureInfo/StructureProductCatalog.ts`, reuse the verified technology
evidence links and variant notes, and deduplicate product names per structure.
Standards alone do not identify a product. Show "No verified real products." when
none are established. Include product names in structure search alongside technology names.
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

## Applied structure adapters

Applied structures follow the category/subject mapping above. In particular,
AppendOnlyLog and FanoutArray live in Advanced/StorageIndexes; FlatVectorArray,
BKDTree, BallTree, LSHIndex, and HNSWGraph live in Advanced/SpatialIndexes;
XArray, RequestTagArray, MultiQueue, LockFreeRing, and MapleTree live in
Advanced/MemoryIO; ChecksummedBlockTree lives in Advanced/Integrity; InvertedIndex
lives in Advanced/TextSearch; MinimizerIndex, CompactedDeBruijnGraph, and
AddressSpaceGraph live in Advanced/SpecializedGraphs.
Each owns a layout wrapper and action component/CSS/sequence folders. Their BFS/DFS
folders live under Algorithms/GraphsTraversal, sharing the canonical graph models.

AppliedFeatures connects their action-owned sequences to the existing
LinearFeatures/LinearStructureCatalog storage adapters; these adapter names do
not determine menu membership. AppliedStructureDefinitions, AppliedActionCatalog,
AppliedStructureCatalog, and AppliedInput supply menus, defaults, and structured
dialogs. AppliedModel shares trace/rejection contracts, AppliedGraphModel shares
only reachable-vertex traversal, PointData shares coordinate validation/distance,
and AppliedLayout shares storage-row and link geometry. Structure-specific
storage, splitting, compaction, hashing, and searches stay in each canonical model.

Reuse LinearAnimation and StructuredLinearAction for bounded tracing and final
clone commits. Do not substitute generic arrays or graphs for the advertised
representation. Document sequential SPSC, interval GiST, rebuilt Maple pages,
block-checksum serialization, fixed LSH planes, simplified HNSW link selection,
and forward-only DNA variants explicitly. Deferred categories and production
extensions belong in coverage.md, not empty menu scaffolding.

## Extended linear structures

DenseTensor and Grid2D live under FundamentalDataStructures/Linear. SparseCOO,
SparseCSC, and NumericalCSR live under AdvancedDataStructures/SparseArraysMatrices.
Each has its own model, layout, and action folders. NumericalFeatures,
NumericalStructureCatalog, NumericalActionCatalog, and StructuredNumericalInput
reuse LinearFeatures, LinearStructureCatalog, LinearAnimation, and shared playback.
NumericalModel shares validation; DenseArrayModel shares contiguous storage;
SparseMatrixModel shares matrix operations; CompressedMatrixModel shares the actual
major-axis compression algorithm for CSC and numerical CSR. COO retains its own
triplet arrays. Pass current shape into the shared input request for coordinate,
reshape, and vector validation. Keep numerical CSR separate from binary graph CSR.

Keep SkipList, UnrolledLinkedList, and XORLinkedList under
`AdvancedDataStructures/Sequences/`; SparseArray under
`AdvancedDataStructures/SparseArraysMatrices/`; and FreeList under
`AdvancedDataStructures/MemoryIO/`. Each owns its model,
layout, and action folders. `LinearFeatures` connects their class components and
action-owned information to App; shared contracts, catalog, input validation,
scene helpers, and trace recording live in `src/visualization/Linear*.ts` and
`StructuredLinearInput.ts`. Reuse `StructuredLinearAction` and `ActionPlayback`.
Do not reuse a tree model or tree layout to stand in for these linear structures.

## String / Text structures

Keep Trie under `FundamentalDataStructures/StringText/`. Keep GapBuffer, Rope,
RadixTree, TernarySearchTree, and SuffixTree under `AdvancedDataStructures/TextSearch/`,
including their canonical models, layouts, and action folders. Keep `RopeFeatures` beside Rope in this group. Reuse the
existing linear/tree model contracts, catalogs, structured inputs, action
dispatchers, and playback adapters; their names describe shared implementation
contracts rather than menu membership. Cross-group imports of shared tree
primitives are allowed. MenuStructureCatalog assigns these entries to their subjects without changing
structure keys or operation behavior. AST lives under AdvancedDataStructures/Syntax.

SuffixArray, SuffixAutomaton, AhoCorasickAutomaton, DAWG, and FMIndex also live
under `AdvancedDataStructures/TextSearch/`, each with a canonical model, layout,
and action component/CSS/animation folders. `StringTextFeatures` owns dispatch;
`StringTextStructureDefinitions`, `StringTextActionCatalog`,
`StringTextStructureCatalog`, and `StructuredStringTextInput` connect menus,
models, and dialogs. Reuse the existing LinearStructureCatalog/LinearFeatures
storage and routing adapters in App, `LinearAnimation`, `StructuredLinearAction`,
and `ActionPlayback`; do not duplicate session or timer logic. `StringTextModel`
shares validation and rejection contracts, `SuffixOrder` shares real suffix-range
merge sorting for SuffixArray and FMIndex, and `StringTextScene` shares geometry.
Each model owns its actual array, automaton, or rank/sampling representation.
Keep dictionary DAWG semantics separate from the suffix automaton and disclose
construction variants, retained storage, input limits, and actual complexity.

Numeric lists allow up to 64 values, text models up to 256 ASCII characters,
and each text input up to 32 characters. Record at most 96 detailed trace frames
per action while still executing the complete operation; disclose omitted events
in the result description. Keep scene bounds fixed throughout each playback.
The simulated address table in XORLinkedList must be described explicitly;
do not claim JavaScript exposes native pointers or saves memory through XOR links.

## Set / Union structures

Keep HashSet and BitSet under `src/components/FundamentalDataStructures/SetUnion/`,
including their canonical models, layouts, and action folders. Preserve their
structure keys and existing operations. HashSet composes the HashMap storage in
HashBased; BitSet reuses the LinearStructureCatalog and LinearFeatures adapters.
These shared adapter names describe implementation contracts rather than menu
membership.

DisjointSet, OrderedSet, and Multiset also live in FundamentalDataStructures/SetUnion.
IntervalSet lives in AdvancedDataStructures/RangeQueries. Each owns its canonical
model, layout, and action component/CSS/animation folders.
SetUnionFeatures owns action dispatch and action-owned information;
SetUnionStructureDefinitions, SetUnionStructureCatalog, SetUnionActionCatalog,
and StructuredSetUnionInput connect menus, defaults, scenes, and input dialogs.
Reuse LinearStructureCatalog/LinearFeatures as App routing adapters and reuse
LinearAnimation, StructuredLinearAction, and ActionPlayback for bounded traces
and final-frame commits. SetUnionModel shares only rejection and trace adapters.
OrderedSet composes the canonical AVLTree storage and uses its actual lower-bound
search; do not duplicate AVL repair logic. The other models retain their own
parent forests, positive occurrence counters, and normalized interval arrays.

## Hash-based structures

Keep Hash Map under
`src/components/FundamentalDataStructures/HashBased/`, with its model, layout, and action
folders. Reuse shared hashing,
bucket layout, and trace playback from `src/visualization/` where they serve more
than one structure. Each action has its own sequence, class component, and CSS file.

## Probabilistic structures

Keep Bloom Filter under
`src/components/AdvancedDataStructures/Probabilistic/BloomFilter/`, including its
model, layout, and Add, CheckMembership, and Clear action folders. The Probabilistic
menu group contains approximate-answer filters and sketches as they are implemented.
Exact lookup structures retain their representation groups even when their internal
construction or balancing uses randomization. Keep existing structure keys and reuse
shared hashing, input, and playback infrastructure across groups.

CountingBloomFilter, CuckooFilter, QuotientFilter, CountMinSketch, HyperLogLog,
and ReservoirSamplingBuffer also belong under `AdvancedDataStructures/Probabilistic/`,
each with its own model, layout, and action component/CSS/animation folders.
`ProbabilisticFeatures` dispatches their actions; catalogs and structured input live
under `src/visualization/Probabilistic*.ts` and `StructuredProbabilisticInput.ts`.
Reuse `LinearAnimation`, `StructuredLinearAction`, and `ActionPlayback` for trace
recording and final-frame commits. `ProbabilisticModel` shares only count/rejection
contracts; `ProbabilisticHash` shares reproducible numeric hashing, and
`ProbabilisticScene` shares geometry. Keep counter, fingerprint, quotient metadata,
register, and reservoir algorithms in their own models. Document teaching variants,
extra deletion-ledger storage, overflow/capacity rejection, and approximate semantics.

## Graphs

Keep the original undirected Graph under FundamentalDataStructures/Graphs/SimpleGraph
and DirectedGraph, WeightedGraph, DAG, and Multigraph beside it. GraphFeatures
dispatches only ordinary-operation actions; GraphTraversalFeatures belongs under
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
folders under their subjects: ordinary graphs in FundamentalDataStructures/Graphs,
Hypergraph and FlowNetwork in AdvancedDataStructures/SpecializedGraphs, and
CompressedSparseRow in AdvancedDataStructures/SparseArraysMatrices. Keep their BFS/DFS actions and FlowNetwork's
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
model entry points in the canonical FundamentalDataStructures/Linear/Array/FixedArray, with shared sorting
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
AlgorithmInformation supplied by App. Keep catalog order and ordinary-operation actions
unchanged; sort selection is local menu state and does not affect playback.
Algorithm structure buttons show at most two example names in one truncated line;
keep the complete list in the independently scrolling action panel.
Do not duplicate graph models or sequence classes to expose traversal examples
in the Algorithms branch.

## Extended tree structures

Extended tree models and layouts follow the Fundamental/Trees, Advanced/SearchTrees,
MultiwayTrees, RangeQueries, SpatialIndexes, Integrity, and TextSearch subjects
in the mapping above. `UnorderedBinaryTree` is the ordinary Binary Tree;
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

## Additional hash structures

Keep OpenAddressingHashTable, SeparateChainingHashTable, RobinHoodHashTable,
CuckooHashTable, HopscotchHashing, ExtendibleHashing, LinearHashing,
PerfectHashTable, and ConsistentHashingRing in their matching FundamentalDataStructures/HashBased or
AdvancedDataStructures/Hashing folders, each with a canonical model, layout, and action component/CSS/sequence
folders. HashFeatures connects their components and action-owned information to
App. HashStructureCatalog owns defaults and scene dispatch; HashStructureDefinitions
and HashActionCatalog own menu entries. Store these committed models in App's
hashModels map and pass it into shared previews and final-commit callbacks.

Reuse LinearModel trace contracts, LinearAnimation, StructuredLinearAction,
ActionPlayback, LinearScene, and shared hash grid geometry. The adapter names do
not determine menu membership. HashTableModel shares only operation contracts and
validation; ProbingHashTable shares actual slot-array storage and rehash primitives
for linear probing and Robin Hood. SeparateChainingHashTable composes HashMap
because it is the same canonical collision policy. Keep all other placement,
neighborhood, directory, overflow, perfect-table, and token policies distinct.
Use StructuredHashInput through ActionInputRequest for input; never coerce the
second value into a range bound or CSV key sets through a numeric callback.
HashTableHash provides seeded exact affine arithmetic for the variants using it.


## Storage and integrity index lessons

Keep BRIN, SSTable, SparsePrimaryIndex, SparseOffsetIndex, and TimeIndex under
`AdvancedDataStructures/StorageIndexes/`. Keep IVFIndex under
`AdvancedDataStructures/SpatialIndexes/` and ContentAddressedLayers under
`AdvancedDataStructures/Integrity/`.
MenuStructureCatalog assigns the five
storage/log indexes to Advanced > Storage Indexes, IVF to Spatial Indexes, and
layer references to Integrity. AppliedStructureDefinitions, AppliedStructureCatalog,
AppliedActionCatalog, AppliedInput, and AppliedFeatures integrate these models.
Use SortedRecords only for shared safe-integer key/value parsing, deterministic
merge sorting, and byte-position calculation. ByteLog shares encoded sequential
record metadata, monotone offset allocation, cloning, and incremental release;
SparseOffsetIndex and TimeIndex retain their distinct checkpoint and search logic.
Each structure owns its model, layout wrapper, and action component/CSS/sequence
folders. Reuse AppliedLayout, LinearAnimation, and StructuredLinearAction.

BRIN eagerly maintains three-record min/max ranges and exactly rechecks candidates.
SSTable builds immutable sorted three-record blocks with last-key fences and explicit
simulated reads. SparsePrimaryIndex samples every third data key and scans only the
selected interval. SparseOffsetIndex samples every third record; TimeIndex uses
prefix maxima at three-record boundaries and skips only maxima strictly below the
query to handle out-of-order and duplicate timestamps. Record byte positions follow
the documented numeric UTF-8 serialization, without claiming production file formats.

IVF uses actual centroid-owned inverted lists, eight deterministic Lloyd iterations,
and configurable probing; disclose partial-probe approximation and uncompressed
IVF-flat storage. Layer references use the existing SHA256 implementation, full
DiffID/ChainID identities, shared numeric payloads, immutable parents, and child-first
release. Display hashes in abbreviated form but never compare abbreviated digests.
Reject invalid builds and exhausted bounds before changing canonical storage or IDs.
Document representation variants and excluded production behavior in README and
structure information. Keep the None entries in coverage.md deferred.
