# Visualization flow and action animations

## Main flow

1. Start with an empty renderer and a clickable menu icon in the top left.
   Place the search icon in the app header between the menu button and brand
   icon. It opens the existing search panel directly with a labeled search field, an exclusive Data
   structures / Algorithms choice, and matching cards sorted A–Z. Match all query
   words case-insensitively across names, Area of use labels where available,
   and documented real technology/product names. Exclude descriptive prose,
   use-case explanations, technology usage, and notes. Show an entry prompt for empty input and
   a no-results message for unmatched text. Algorithm cards include the target
   structure name; selecting one follows its normal input/animation flow. Browsing
   results does not change the current visualization. Do not show a search icon
   beside Categories or a back button in search. Close search with the × icon
   or Escape and restore focus to the header search icon. Keep back buttons in
   ordinary category and group navigation.
2. Open the menu to see **Algorithms** and **System Components Overview**, in that
   fixed order. Algorithms contains **Fundamental Data Structures**,
   **Data Structures Algorithms**, and **Advanced Data Structures**, in that order.
   These category lists are excluded from alphabetical menu ordering. System Components Overview
   opens Hardware or Network, each containing Fundamental and Complex.
   Choosing Hardware/Fundamental or Hardware/Complex closes the menu and opens
   its workspace panel directly, with overview cards, component tags, and separate
   information buttons. Show no intermediate lesson picker and start no animation
   until an overview is selected. Fundamental includes four hardware execution and
   prediction overviews without CPU, Disks, or Memory subcategories. Network/Fundamental
   contains Physical, Data Link, Network, Transport, Session, Presentation, and
   Application in OSI layer order. Complex covers systems combining components
   or network layers. OS scheduler lessons have been removed. The Complex workspace lists twelve
   cross-component lessons for ordering, barriers, atomic updates, coherence,
   translation, and instruction synchronization, without CPU/memory subcategories.
   Selecting a lesson starts its bounded trace in the shared renderer. Workspace
   Back and the header menu reopen Hardware. Returning to the current group keeps
   its playback session; selecting another group opens that group's idle panel.
   Hardware overview cards in Fundamental and Complex workspace action lists and
   search show component tags (CPU, RAM, Disk, Bus) from their catalog metadata,
   instead of Real Systems, Educational, or Popular usage tags. Tag the existing
   Fundamental CPU lessons with CPU and current Complex lessons with CPU, RAM,
   and Bus. Reserve Disk for overviews that cover a disk.
   Add x86 or ARM tags beside component tags for architecture-specific CPU
   instruction overviews. Architecture-independent mechanisms receive no
   architecture tag, regardless of the architecture of a cited example product.
   This does not imply implementation by every processor. Real technologies lists
   verified examples of the exact mechanism; optional implementation notes clarify
   protocol distinctions and implementation coverage.
   Overview info buttons open the dedicated System Components overview popup
   with the name, What it is, Problem it solves, Step-by-step flow, Real
   technologies. Do not show a Real products section in component overviews.
   Give every overview a short definition, a
   concrete explanation of the problem solved, and at most ten numbered flow
   steps. Combine related events into one step for longer processes. Omit time and
   memory complexities and explanations, Teaching model, and Terms used in this
   action. Algorithm action dialogs retain their existing content.
   Other empty leaves show that no overviews have been added yet. Back returns
   through their parents without changing the current visualization or playback.
   Structure assignments are defined in `MainMenu/MenuStructureCatalog.ts`,
   and mirrored by canonical model folders under the matching root and subject.
   Fundamental contains Linear, Queue / Priority, Trees, String / Text, Graphs,
   Set / Union, and Hash-based. Advanced contains Sequences, Sparse Arrays / Matrices,
   Queues / Heaps, Search Trees, Multiway Trees, Range Queries, Spatial Indexes,
   Storage Indexes, Memory / I/O, Text / Search, Syntax, Hashing, Specialized Graphs,
   Integrity, and Probabilistic. Choose a group to see only its assigned structures.
   Data Structures Algorithms retains Sorting (Array with forty-eight sorting actions) and
   Graphs Traversal (all eighteen graph entries), including BFS/DFS, Dijkstra for
   Weighted Graph, topological sorting for DAG, and maximum flow for Flow Network.
   Graph editing and value search remain in the structure categories. Browsing
   preserves the current visualization and playback. Back returns through the
   selected subject, its data-structure category, and Algorithms. Reopening a selected structure restores
   that same path, including after a search selection. Do not show a breadcrumb
   path or instruction text on the structure list.
3. Selecting a structure loads an example containing 10 elements in the shared
   renderer. Lists, trees, graphs, and other structures can use different layouts.
4. After selection, close the structure picker and show the structure's allowed
   actions in a persistent card at the upper-left of the canvas. Mark the
   selected action with a highlight and `aria-current`, and put a small info
   button to each action's right.
   In Sorting and Graphs Traversal, show a small **Real systems** or
   **Educational** tag inside the top of each algorithm button. Derive the tag
   from AlgorithmTechnologyCatalog: verified technology or product evidence
   means Real systems; otherwise Educational. The tag describes practical use,
   not execution mode or actual threads in this visualizer. Preserve button
   width and the existing 112px height, leaving space for two-line titles and
   descriptions. Overview operation buttons do not receive algorithm-use tags.
   Structure picker buttons in Overview use the same tags, based on their
   documented technologies. Structure picker buttons in Sorting and Graphs
   Traversal have no tags; only specific algorithm buttons do in those sections.
   Add a second **Popular** tag beside the usage tag when a
   structure has at least three technology examples, or an algorithm has at
   least three distinct source links across its technology and product examples.
   Count a repeated algorithm source link once, even if listed in both sections.
   Only algorithm action lists have a sorting icon immediately left of the
   large structure-info button. Offer exactly three choices: Alphabetical
   (A–Z, default), Average time (fast to slow), and Average memory (less to more).
   Read average bounds from the same action information used by the info dialog;
   never instantiate an animation to obtain ordering data. Compare asymptotic
   growth families with bounded digit/radix/range parameters held fixed, use A–Z
   for ties, and put unestablished or unavailable bounds after known finite
   bounds. Explain these conventions in the control tooltip. Keep action sizes,
   selected action, playback, and Overview catalog order unchanged. Use a
   keyboard-accessible picker with visible focus; selecting an order does not
   start an algorithm.
5. Selecting a supported value/index action on a linear structure, tree, graph, or
   hash-based or probabilistic structure opens its input dialog.
   Confirming valid input starts its animation. Actions without an argument run
   directly. Graph actions use the same structured input dialog. Animations
   run to completion automatically. Reduced-motion styles still suppress visual
   transitions.

Browsing categories or groups must preserve the current visualization and action
session. Opening menus or info dialogs does not pause playback. If a structure is already selected,
reopen its structure group and retain the group path for Back navigation.
Actions are selected directly from the canvas card, without reopening the menu.
On smaller screens, place the action card above the diagram so it does not
overlap nodes. Move keyboard focus to the first action after choosing
a structure. Linear-structure, tree, graph, and hash-based actions can be repeated after completion, reopening
their input dialog when applicable and using the latest committed model. Disable their
operation buttons while an animation runs; keep info buttons and full Reset
available. Every graph action can be repeated after completion.
Place the Current / Visited / New node legend at the top-left of the renderer's
center area, beside the actions panel and above the pseudocode button. Let the legend
wrap on narrow screens; do not keep it in the canvas footer.
Hide scene hints and inline step pseudocode in all workspaces. Only in Data
Structures Algorithms (Sorting and Graphs Traversal), show a Show pseudocode
icon button below the legend for the active action.
It opens a scrollable modal with the action name and its complete static listing,
available during playback and after completion. Limit each listing to 50 lines.
Keep the main control flow and use named helper operations for lower-level detail.
Keep runtime values and results in the timeline description. Close, Escape, and
backdrop dismissal return focus to the
button without interrupting playback. Reset or selecting another action disposes
the popup with the old session.

Fit the full diagram to the available width and a bounded viewport height by
default, preserving its aspect ratio and top alignment. Offer Fit diagram and
Actual size as view controls outside the SVG. Actual size allows horizontal and
vertical scrolling and keeps the current node visible during playback. These
controls never affect playback timing. On stacked layouts, bound the action list
height so it does not consume the whole screen. Keep dialogs inside the visual
viewport, including while a mobile keyboard is open, with internal scrolling,
wrapping content, safe-area spacing, and reachable close controls.

Do not render a bottom animation panel or speed selector. Use the shared input
dialog for these actions:

- **Array, Linked list, Doubly linked list:** Insert at the start, middle, or end;
  Search by value; Search by index; Delete by value.
- **Stack:** Push and Search by value.
- **Queue and Circular buffer:** Enqueue and Search by value.
- **Deque:** Push front, Push back, and Search by value.
- **BST, AVL tree, Red-Black tree, B-Tree, B+ Tree:** Insert a key,
  Search by key, and Delete a key. Use **Key** for their input field labels.
- **B+ Tree range:** collect **Minimum key (inclusive)** and **Maximum key
  (inclusive)** in the same dialog. Start both empty, require whole safe integers,
  and require maximum >= minimum. Equal keys are valid; bounds need not exist in
  the tree. An empty tree can still be queried.
- **Hash Table / Hash Map:** Insert / update collects separate **Key** and
  **Value** fields. Look up a key and Delete a key collect only **Key**.
- **Hash Set:** Add a value, Contains value, and Remove a value collect **Value**.
- **Bloom Filter:** Add a value and Check membership collect **Value**.
  Clear runs without input for all hash-based structures.
- **Trie:** Insert a word, Search by word, Delete a word, and Check a prefix
  collect lowercase a-z text of 1 to 32 letters.
- **Heap:** Insert collects a whole-number value; Extract minimum and Peek minimum
  run without input. Use a binary min-heap with duplicate values allowed.
- **Segment Tree:** Update collects an index and replacement value; Range sum
  collects inclusive minimum and maximum array indices.
- **Fenwick Tree (BIT):** Add collects an index and delta; Prefix sum collects an
  inclusive ending index; Range sum collects inclusive minimum and maximum indices.
  Array indices are zero-based even though BIT cells are one-based.
- **R-Tree:** Insert and Search overlapping rectangles collect minimum X,
  minimum Y, maximum X, and maximum Y; Delete collects the rectangle ID.
- **LSM Tree:** Insert / update collects Key and Value; Look up and Delete collect
  Key. Flush memtable and Compact all runs run without input.
- **Original five graph variants:** Add vertex collects a unique vertex value. Add edge collects existing
  source and target vertex values. Search and Delete vertex collect a value;
  BFS and DFS collect an existing starting vertex and visit only its reachable
  vertices. Search restarts at unvisited components. Remove edge collects the
  numeric part of a visible edge ID. Clear runs without input.
- **Undirected Graph:** Reuses the original Graph model/key, with unweighted edges,
  self-loops allowed, and duplicate endpoint pairs ignored.
- **Directed Graph:** Unweighted arrows, cycles and self-loops allowed; opposite
  directions are distinct edges.
- **Weighted Graph:** Undirected, nonnegative safe-integer edge weights (zero is
  valid). Add edge also collects Weight. Update weight collects an edge ID and
  weight. Dijkstra collects source and target values and reports the actual path
  and distance, or unreachable. Use BigInt for exact path sums.
- **DAG:** Reject cycle-forming edges before changing the model. Topological sort
  uses Kahn's algorithm and runs without input, including on an empty graph.
- **Multigraph:** Undirected, with parallel edges and self-loops. Stable edge IDs
  distinguish parallel edges; remove by ID rather than endpoint pair.
- **Bipartite Graph:** Add vertex also collects its fixed partition (0 = L,
  1 = R). Reject same-partition edges, self-loops, and duplicate pairs.
- **Complete Graph:** Add vertex connects it to every existing vertex in one
  atomic published step. Individual edge edits are unavailable.
- **Tree Graph:** Attach a new leaf to an existing parent; the first vertex
  names itself as parent. Delete only leaves, keeping the graph connected and
  acyclic. This is a general graph tree, without search-key ordering.
- **Hypergraph:** Add hyperedge collects 2–16 distinct existing values as CSV.
  Show square H nodes and undirected membership links. Delete by h-number.
  Vertex deletion shrinks sets, drops sets with fewer than two members, and
  coalesces duplicate sets, keeping the first ID. Traversals follow vertices
  sharing a hyperedge, without creating a stored clique.
- **Flow Network:** Add edge collects Capacity; Update capacity collects an
  e-number and Capacity. Capacities are nonnegative safe integers, with zero
  allowed. Valid edits reset all flows; rejected edits preserve them. Maximum
  flow collects different source/sink values and uses Edmonds–Karp residual BFS
  with reverse cancellation and exact BigInt flow arithmetic. Publish each
  augmenting path atomically so intermediate scenes conserve flow. Label source,
  sink, and flow/capacity, and report the exact total. Traversal follows stored
  directed edges regardless of capacity and does not change flows.
- **Functional Graph:** Add vertex collects a successor, existing or itself.
  Set successor replaces its one outgoing edge without changing the edge ID.
  Read successor returns its actual target. Vertex deletion redirects surviving
  predecessors to self-loops; direct edge deletion is unavailable.
- **Adjacency Matrix / Adjacency List / Edge List / CSR:** Use directed binary
  graphs with self-loops, unique endpoint pairs, and separate vertex registries.
  Matrix stores actual square cells; adjacency list stores per-source arrays;
  edge list stores endpoint records; CSR stores offsets[V + 1], sorted packed
  columns[E], and parallel stable edge numbers, with implicit values of 1.
  Keep isolates visible, and repair row/column indices and offsets after edits.
  Show storage beside topology and offer Inspect storage without input.
  Array-row connectors illustrate order rather than linked storage pointers.

The ten additional graph entries use registry-based value search, BFS/recursive
DFS from an existing start, and incremental clear with stable ID counters.
Load ten vertices by default; cap these examples at 16 vertices, 128 ordinary
edges, and 32 hyperedges. Record at most 96 detailed trace events while executing
every operation fully, and disclose omitted events. Clone models for playback,
commit only on the final frame, retain scene bounds across the sequence, and
preserve committed graph state when switching Overview/Algorithms scopes.
Action info explains costs for the actual representation, excluding playback
clones and scene snapshots. Query final frames report actual results and retain
visited highlights. Rejected operations leave the model and ID counters intact.

- **AST:** Build from expression collects an arithmetic expression. Preorder,
  Inorder, Postorder, Evaluate, and Clear run without input, including on an empty
  tree. Validate expression syntax in the dialog before starting the build.

Value actions accept any safely representable whole number. Start the input
empty, and block nonnumeric
characters while typing or pasting; value inputs also allow a leading minus.
Search by index accepts a zero-based index within the current Array or list;
explain an empty structure and disable submission until an element exists.
Linear insertion actions retain their fixed start, middle, or end position and ask only
for the new value. Empty, fractional, and out-of-range input displays an error.
Cancel, close, Escape, or a backdrop click dismisses the dialog without starting
an action or changing the model. Focus the input on open and return focus on close.
Clear, Pop, Dequeue, Peek, and end-deletion actions run without an input dialog.
A full Circular buffer still accepts an enqueue request so its animation can
explain rejection without overwriting data. Graph uses its
definition's default value (99 when unspecified).
All actions use normal playback speed.

Place a noninteractive animation progress bar in the app header, replacing the
structure name and element count. Do not provide Play, Pause, replay, or seeking
controls. Use a native progress indicator without a draggable handle or keyboard
input. Keep the full structure Reset button before the progress bar, including
on narrow screens; resetting cancels playback and restores the default structure.
Show Reset only when an action is selected; hide it in the initial structure view
and after resetting or selecting another structure.
Use an icon-only Reset button with an accessible label.
Show only the progress bar in the timeline across data structures, algorithms,
and overviews. Do not render a step description, label, hint, or tooltip above
the bar. Retain an accessible name and the current step's description in the
progress indicator's accessible value text. Hardware arrow captions remain
below the renderer legend. Hide the pseudocode trigger before an
action is selected. Align diagrams to the top of their viewport instead of
vertically centering them in unused canvas space.
Omit the step heading, action introduction, phase progress bar, step counter,
playback status badges, and previous/next/reset buttons.

Do not render an algorithm overview card or a default prompt on the canvas.
An action's info button opens its **Algorithm overview** in a centered modal
dialog, independently of action selection. Preserve the current action and let
its animation continue while the dialog is open. Close it using its close
button, Escape, or a backdrop click; return focus to the invoking info button.
The dialog scrolls within the viewport on smaller screens. Include time complexity,
additional memory complexity, with labeled best, average, and worst cases for
both costs, and definitions of only the terms and letters used
by that action. Each action owns its summary, complexity explanations, and glossary
in its sequence class; the shared dialog only displays the supplied information.
For actions under Data Structures Algorithms (Sorting and Graphs Traversal), also
show **Real technologies** with verified primary documentation or source links
and a description of the algorithm's actual use in each bullet. Do not display
an additional explanatory paragraph below populated technology lists. Keep
supporting variant notes in the evidence catalog; show the educational-use
notice only when the technology list is empty.
Add a separate **Real products** section for these algorithms. Each product name
links directly to first-party documentation, engineering articles, or source code
that supports the specific algorithm use. Display only linked product names in
a comma-separated paragraph, without bullets or descriptions. Include multiple
verified products when available; one product is enough when that is all the
evidence supports. Keep supporting explanations and version/variant details in
the evidence catalog. If no product can be verified, show "No verified real products."
Never infer use from a company's
industry, a general graph feature, or an interview-preparation example.
Keep this section out of Overview operations such as Add, Search, and Clear.
Store shared algorithm-use evidence in `AlgorithmTechnologyCatalog`; App attaches
it only for the selected algorithm scope. If no practical use has been verified,
display an explicit educational-example notice instead of invented examples.
Algorithm demonstration libraries, sorting collections such as cpp-sort, and
educational visualizers do not qualify as real technology or product examples.
Require evidence of an algorithm's practical use in a product or system beyond
merely providing a demonstration implementation.
Do not infer that an algorithm is used only academically from missing evidence.
Provide a larger info button at the action card's top-right corner for general
structure information. It opens a separate centered dialog with a one- or
two-sentence introduction and a two-column table containing four or five areas
of use, each with a one- or two-sentence explanation of how it is used and what
problem it solves. Below the table, list verified real technologies, with primary
documentation or source links and a short explanation of their concrete use.
Follow this with a separate **Real products** section containing only
comma-separated linked product names, matching the algorithm dialog. Use the
curated labels in `StructureInfo/StructureProductCatalog.ts` with the existing
technology evidence links; retain variant and historical qualifications. Deduplicate
products per structure and do not treat a specification alone as a product.
If none are established, show "No verified real products." Product names are
also searchable in the Data structures search target.
Include real systems, language runtimes, standard libraries, and established
application libraries; exclude competitive-programming collections, educational
algorithm catalogs, and standalone projects without evidence of application use.
Identify variants explicitly, and do not count a related structure as an example
of the exact implementation shown. There is no minimum count: one verified use is
better than five padded entries. If none can be verified, explain the limitation
in the description and leave the list empty; do not assert universal non-use.
Support close, Escape, backdrop dismissal, focus return,
and uninterrupted playback in the same way as the action overview dialog.
Do not add generic definitions or unused variables to every action. For example,
linked list insertion explains `n`, `O(n)`, and `O(1)` without introducing `k`.
Fixed-array insertion uses only `n` and `O(n)` because both copying and additional
storage are linear.
Values such as the original input size must describe the current run, including
after completion and replay. For the active action, keep the run's original size
in its description; for another action, use the current committed model size.
Close the dialog on structure selection or reset.

Do not put standalone text annotations in the structure diagram, including hints,
action results, or original/new array headings. Keep these explanations in the
step description above the timeline. Diagram text is limited to values, indices, and node roles
and statuses. The algorithm overview remains a separate dialog.

Compare best, average, and worst cases at the same input size. Explain empty and
singleton boundary cases separately; do not use an empty input to claim constant
best-case time for an operation that always traverses a growing nonempty input.
State average-case assumptions explicitly. Additional memory includes output
storage required by the underlying operation, but excludes playback copies,
recorded paths, and scene snapshots. For deletion, distinguish a missing value
from a successful deletion that allocates a replacement structure.
Keep summaries and complexity explanations short. Explain each case with its
concrete trigger, such as a head match versus a full traversal.

Keep structure selection and action selection distinct. Only offer working actions;
identify structures with previews but no animated actions clearly.

## Fundamental memory and storage scope

Hardware > Fundamental includes latch, SRAM cell, DRAM row access, HDD sector
access, NAND cell/page/block operations, SSD FTL, garbage collection, and wear
leveling. Use RAM or Disk tags in the existing flat workspace; do not add memory
or disk menu subcategories. Keep OS disk scheduling outside these overviews.

Each lesson owns a mechanism model, layout, class component, stylesheet, animation,
and sourced overview. Reuse the existing workspace, automatic playback, reset,
information dialog, and search destinations. ComponentLesson shares CpuTrace and
CpuModel as visual snapshot adapters using hardware-component scenes, without
inventing CPU/cache context for local memory or device mechanisms. Component
traces preserve explicit transactions even when successive payload values match.
HardwareDiagram paths support latch waveforms and HDD tracks inside the shared
Renderer; do not introduce a separate renderer or timing loop.

Follow the boundaries in coverage.md: distinguish transparent latches from edge
triggered flip-flops; identify conventional 6T SRAM and SLC NAND; restore DRAM
through sensing while the row is open; precharge bit lines after recovery; keep
host LBAs separate from HDD geometry; erase complete NAND blocks; publish flash
mapping changes only after successful programming; preserve live pages before
garbage collection erases; track erase counts separately from validity. Show
relocation write costs and distinguish space reclamation from wear balancing.
All time intervals are symbolic. Mapping durability, analog transistor behavior,
vendor firmware, and bit-level controller ECC are outside these bounded examples.

## Real-system CPU hardware lessons

System Components Overview > Hardware > Fundamental offers register renaming,
out-of-order execution with in-order retirement, history-based branch prediction,
and return-address stack prediction. Reuse shared playback, header Reset/progress,
renderer, algorithm search, and information dialogs. Menu browsing and
information preserve playback; selecting a different lesson or structure disposes
the previous session. Header Reset clears the lesson without starting another run
and returns focus to the first hardware choice.

Each mechanism owns actual state transitions: physical source identities and
renaming/retirement; dependency readiness, reorder-buffer completion and branch
squashing; history/counter training; or bounded return prediction independent of
actual return addresses. Record independent snapshots with fixed diagram bounds
per lesson, at most 96 events, and no hardware timing claims. Use labeled CPU
core regions with registers, cache context, and mechanism-specific units. Connect
those components with directed paths and highlight the current logical transfer.
Renaming shows captured operands, physical destinations, and retirement; the
out-of-order lesson separates load request/response, execution, commitment, and
fetch recovery. Branch prediction shows history lookup, direction selection,
training, and redirect; return prediction shows push/pop and actual-target
validation. The predictor tables and return stack are not data/instruction caches.
Keep cache lookup/replacement and exact physical wiring explicitly out of scope.

Reference the documented processor in information. Intel Core examples use
illustrative register counts and execution events. Cortex-A53 documents global
history and an eight-entry return stack; the small counter table, its exact
indexing/training, and stack overflow/underflow policies are teaching choices.
Show those distinctions in overview information. Complexity bounds
describe fixed visualizer examples, not production hardware latency. Keep
coherence, memory barriers, and other cross-component topics in Complex.

## Applied structure operations

Applied structures listed in README follow the Fundamental and Advanced menu
subjects in their source folders. All use the shared renderer, validated structured
inputs, automatic playback, full Reset, final-clone commits, independent snapshots,
and 96 detailed trace frames with an omission count. All default logical counts
are ten; allocated cells, internal pages, unitigs, and filter bits are not counted
as additional logical records. Labels identify the counted quantity.

Their class-based models must execute the advertised storage algorithms: radix
branches for XArray, a stored 256-entry fanout array, per-slot SPSC sequences,
operator-class GiST splitting, block KD and metric-ball bounds, nonoverlapping
Maple range pages, parent-stored block checksums, sorted term postings, minimizer
window minima, within-block Bloom probes, actual HNSW layers, unitig compaction,
and typed AddressSpace references. Never present these as production-equivalent
kernel, database, genomic, or protocol implementations. Explain the variant in
structure information and action-owned complexity descriptions.

HNSW, compacted de Bruijn, and AddressSpace graph BFS/DFS live under Algorithms >
Graphs Traversal, bringing its graph entries to eighteen. Traversals start at a
visible vertex ID, visit reachable outgoing links, report actual output, and retain
visited marks. Their Overview cards retain structure-specific editing and queries.
HNSW and LSH similarity queries explicitly report approximate results. De Bruijn
walk membership does not establish occurrence in the original DNA source.

SPSC publication is sequential, without real threads. GiST supports one interval
operator class. Maple edits rebuild pivot pages and may split ranges; reject
results over 64 ranges before consuming IDs. Checksum corruption deliberately
changes data without repairing expected parent pointers; verification detects it
without repair. Clear resets that ten-block example to zero. Append-only Log
clear retains the next offset, and SPSC draining retains sequence counters.

coverage.md records deferred storage/search indexes, layered storage systems,
message schemas, and advanced numerical extensions. The five fundamental numerical
representations now belong to Linear; their permitted operations are in README.

Numerical defaults contain ten occupied dense cells or ten sparse nonzeros.
Accept 1 to 4 tensor axes and exactly two grid/matrix axes, dimensions 1 to 8,
and at most 64 logical cells. Build validates all row-major safe-integer values
before replacing storage. Read/Set use current shape bounds. Tensor Reshape keeps
the same allocation and value order; dense Clear zeroes every allocated cell.
COO append retains duplicates and explicit zeros, while Set replaces a coordinate
and Coalesce sums duplicates and removes zeros. Reject overflowing coalesced sums
without changes. CSC/CSR show actual major pointers, sorted minor indices, and
numeric values; structural edits repair subsequent pointers. Numerical CSR is
independent of binary graph CSR. Matrix-vector products use exact BigInt sums and
preserve matrix storage. Show results in timeline descriptions, count occupied
dense cells or stored sparse triplets/nonzeros, and reuse bounded automatic
playback, independent scenes, final clone commits, and full Reset.

## Action responsibilities

Each action describes its own ordered animation sequence. Define the sequence in
a TypeScript class next to its `.tsx` component and `.css` file in the action folder.
Each step includes a phase, title, explanation, duration, and scene snapshot.
Keep trace code separate from the static listing in the pseudocode dialog. Keep
scene snapshots independent so stepping backward and replaying are deterministic.
Searches and membership checks end on their result frame, without an extra
commit, no-mutation, or generic completion step. Report whether the value was
found and include its location when available (index, bucket and collision-chain
position, tree depth or page/key position, vertex, or checked Bloom bit indices).
Retain the result highlight. Bloom positives remain **possibly present**, never
an exact match. Mutating actions keep their existing final commit step.
Retain phase metadata in the animation plan without displaying a phase progress
bar in the controls. A duplicate rejection skips creation stages entirely.

The shared Renderer draws the supplied nodes, edges, and highlights and animates
their transitions. It must not decide the algorithm or hard-code action phases.
Playback timing belongs to a separate controller class. Cancel scheduled playback
when the action unmounts, the selected structure changes, or the user performs
a full reset. Run steps automatically in order and stop on the final frame.
Menus and dialogs must not interrupt playback, and the progress bar must not
change its timing or position in the sequence.

Keep intermediate visual states separate from the data model. Publish a completed
insertion only on its final step; rewinding restores the original model. Replay
must not insert duplicate nodes. The renderer's element count reflects committed
nodes; a pending new node is labeled separately until completion.

## LinkedList / AddInTheMiddle

Use a singly linked list. Insert at zero-based index `floor(length / 2)`, so a
10-element list receives the new node between existing indices 4 and 5.

1. **Start:** highlight the head node.
2. **Traverse:** follow next pointers and highlight each visited node in order.
3. **Middle:** stop at the predecessor and save its successor reference.
4. **Create:** make the new node appear above the insertion point.
5. **Make space:** fade the old middle link, then shift the right half of the
   drawing to open a gap. Keep the saved successor reference. This movement is a
   visual aid; linked list insertion does not require shifting adjacent memory.
6. **Insert:** lower the new node into the gap.
7. **Connect:** connect the new node to its successor, then the predecessor to
   the new node. Finish with an updated element count and index labels.

Use separate frames for unlinking and opening space, and for the two pointer
connections. Include a visible current-node marker and text labels for visited
and new nodes, so color is not the only indication of state.

## Array / AddInTheMiddle

The Array feature is a simple fixed-size array, with every slot occupied. Its
length never changes. Insertion at zero-based index `floor(length / 2)` produces
a separate fixed array of exactly the original length plus one. Keep the original
array visible and unchanged while building the result. Never model this feature
as a dynamic array with spare capacity or automatic buffer growth.

1. **Locate:** identify the insertion index in the original fixed array.
2. **Allocate:** show an empty result array of exactly `n + 1` slots in a second
   row, below the original array of `n` slots. Explain the rows in the step description.
3. **Prefix:** read and copy each element before the middle to the same index in
   the result. Use separate reading and copying frames. Preserve the source value.
4. **Insert:** show the new value above the result's middle slot and lower it in.
5. **Suffix:** copy each remaining original element into the result at its old
   index plus one. The original array's values and slots must stay fixed.
6. **Replace:** show both arrays with the result fully populated and explain that
   both allocations coexist in memory.
7. **Finish:** switch to the completed result, fade the old row, and update the
   element count. The original storage can be released once it is unused.

The default array has exactly 10 occupied slots; the first insertion allocates a
new array of exactly 11 slots. Subsequent insertions repeat the same operation
with a new exact-sized result. Time and additional memory are both O(n). Explain
only `n` and `O(n)` in this action's glossary. Label copied values **COPIED**;
do not label copies **SHIFTED** or add standalone row headings to the diagram.

Both insertion actions reuse the shared class-based playback controls. Plans keep
the original model unchanged so replay, stepping backward, and reset are safe.
Search and other actions can be added through their own action folders and plans.

## BinaryTree / Insert

Use an unbalanced binary search tree with unique keys. Its default example has
10 nodes and satisfies strict ordering: every left-subtree key is smaller than
its ancestor and every right-subtree key is larger. Reject equal keys without
changing links, count, or the next node ID. Do not perform rotations.
The existing `binary-tree` selection is labeled **Binary search tree (BST)**;
keep its model, actions, and selection key so existing sessions remain compatible.

1. **Start:** highlight the root, or identify an empty root pointer.
2. **Compare:** show the comparison at each visited node, then follow the chosen
   child in a separate frame. Mark the visited path and current node with text.
   Stop at an equal key and finish with **Duplicate rejected**, highlighting the
   existing node. Do not create a pending node, empty slot, or connection for a
   rejected insertion. The remaining steps apply only to new keys.
3. **Locate:** identify the empty child position (or empty root).
4. **Create:** show the new leaf with empty child pointers, labeled as pending.
5. **Connect:** draw the parent-to-leaf pointer, or set the root pointer.
6. **Finish:** commit the result and update the element count.

Keep the original model unchanged, committing only on the final step. Rewinding
restores the original; replay never adds a second node for an existing key.
Use the shared playback controls and renderer. Layout uses scene dimensions
to accommodate additional levels and horizontal scrolling on narrow screens.
The action's information explains O(h) time and O(1) extra memory for iterative
insertion. Show best-case O(1) for a root match or empty root child, average-case
O(log n) assuming distinct keys inserted in random order, and worst-case O(n)
for a chain of sorted distinct keys. Explain the empty-tree boundary separately.
Additional memory is O(1): a few pointers and at most one new leaf, with no node
allocated for a duplicate. Define n, h, O(h), O(log n), O(n), and O(1), and keep n tied to the
original input size for the current run. Animation snapshots are visualization overhead,
excluded from the algorithm memory cost.

## Stack

Use a linked, last-in-first-out stack with a top pointer and a cached count.
The default example pushes 10 through 100, so 100 is initially at the top. Stack
belongs to **Data Structures Overview → Linear**.

Provide animated **Push**, **Pop**, **Peek (top)**, **Clear**, and **Search by value**
actions. Push and pop modify only the top. Peek and search leave the stack unchanged.
Keep cached size and emptiness checks in the model, without separate menu actions.
Empty pop and peek
return no value and explain that result in the step description. Clear repeatedly removes
the top until empty. Value search is an optional traversal of the linked nodes;
stop at the first match from the top without changing the order. Do not offer
index access, insertion in the middle, or arbitrary-value deletion for Stack.
This stack is unbounded, so there is no fixed-capacity fullness check.

Show a vertical stack of rectangular nodes, with top/bottom roles next to the
nodes and node statuses on the other side. No standalone canvas hints or headings.
Animate a pending push above the stack and lower it into place. Pop lifts the
removed top before revealing the successor. Existing values stay in position.
Commit the model and count only on the final frame; rewind restores the original.

Push, pop, and peek use O(1) time and additional memory in every case.
Clear explicitly releases all n nodes, taking O(n) time
and O(1) extra memory. Search takes O(1) best-case time for a top match and O(n)
worst-case time for a bottom match or a miss. Average O(n) assumes uniformly
distributed matching depths. It uses O(1) extra memory. Explain empty boundary
cases separately and exclude playback copies and snapshots from algorithm costs.

## Queue and Deque

Queue uses singly linked nodes, cached front/rear pointers, and a cached count.
Provide **Enqueue**, **Dequeue**, **Peek (front)**, **Clear**, and **Search by value**.
Enqueue adds at the rear; dequeue removes the front in FIFO order. Removing the
last node clears both end pointers. Search traverses without changing order.

Deque is a double-ended queue backed by doubly linked nodes. Reuse the doubly
linked representation through composition, exposing **Push front**, **Push back**,
**Pop front**, **Pop back**, **Peek front**, **Peek back**, **Clear**, and
**Search by value**. Both ends are cached; no traversal is needed to remove the
back. Do not offer arbitrary insertion, indexed access, or value deletion for
these queue interfaces.

Show horizontal linked nodes with front/rear or front/back roles. Label directed
links **next** and, for deque, **prev**, routing the two directions separately.
Create and lower pending insertions; show end-pointer updates before committing.
Detach removals before closing the visual gap. Empty pop, dequeue, and peek
return no value. End operations take O(1) time and extra memory; clear releases
all n nodes in O(n) time and O(1) extra memory. Search has O(1) best and O(n)
average/worst time, assuming uniformly distributed matching positions.

## DoublyLinkedList

Keep the existing singly linked list as a separate structure. The doubly linked
list has head/tail pointers, a cached count, and reciprocal prev/next node links.
Offer insertion at the start, middle, and end; deletion at either end and by
first matching value; search by value and index; and clear.

Use the nearer cached end for indexed access and middle insertion. Animate
forward traversal with next and backward traversal with prev. Show the two new
node pointers and the two neighbor connections in separate frames. Deletion
separately reconnects predecessor.next and successor.prev, including null at
the boundaries. Both pointers are null after the final singleton is removed.

End insertion/deletion takes O(1) time; middle insertion takes O(n) time for
growing nonempty inputs. Indexed search is O(1) at either end and O(n) in the
middle, with O(n) average time for uniformly distributed valid indices. Value
search/deletion stops at the first match from head: O(1) best and O(n)
average/worst time, assuming uniformly distributed matching positions. Clear
explicitly releases all n nodes in O(n). All these actions use O(1) extra memory.

## CircularBuffer

Use fixed-capacity FIFO storage, read/write indices, and a cached count. The
default has 12 physical slots and 10 occupied values, starting at read index 8
to demonstrate wraparound. Capacity never grows. Provide **Enqueue**, **Dequeue**,
**Peek (oldest)**, **Clear**, and **Search by value**. Reject enqueue when full;
never overwrite existing values. Equal read/write indices mean empty at count
zero and full at count equal to capacity.

Show physical slots around a ring with index labels and read/write roles.
Enqueue moves a pending value into write, then advances write modulo capacity.
Dequeue reads and releases the oldest slot, then advances read modulo capacity.
Keep other values fixed in their physical slots. Search visits occupied slots
in FIFO order with wraparound; clear releases each occupied slot in that order.
Empty dequeue/peek returns no value. Enqueue/dequeue/peek take O(1) time, search
takes O(1) best and O(n) average/worst time under uniformly distributed matching
positions, and clear takes O(n). All use O(1) extra memory, excluding the existing
fixed allocation. Unused slots are not included in search or clear traversal.

All four structures load 10 elements and use the shared playback session, final
frame commits, deterministic snapshots, reduced-motion behavior, and lifecycle
cleanup.

## Additional priority structures

All nine live under Overview > Queue / Priority and use class-based models,
shared automatic playback, final-frame commits, validated structured input,
full Reset, action-owned complexity information, and independent scene snapshots.
Each starts with ten logical entries; Monotonic Queue starts with ten descending
window values, and Fibonacci Heap starts with ten nodes after a demonstration
consolidation. Keep heap examples bounded to 64 nodes and traces to 96 detailed
events. Execute all events and disclose omitted detail in the final description.

- Priority Queue stores value/priority pairs in a binary min-heap. Smaller
  numeric priorities leave first; ties preserve FIFO insertion order.
- Binary Max-Heap stores numeric values in a complete binary max-heap; insert
  sifts up, extract maximum replaces the root and sifts down.
- Binomial Heap stores a unique-degree forest of binomial min-trees. Use constant
  pointer-work child/sibling links and a logarithmic degree table for carry
  consolidation. Reverse the removed root's child list before union.
- Fibonacci Heap uses circular doubly linked root and child lists, cached
  minimum, degrees, and loss marks. Consolidate on extract-min. Decrease-key
  addresses a visible numeric handle, cuts a violating child, marks the first
  non-root child loss, and cascades later losses. Clear marks on promoted roots.
  Include numeric-handle Map maintenance and donor transfer in complexity notes.
- Pairing Heap uses child/sibling links, adjacent left-to-right pairing, then
  right-to-left combination. Keep the working forest visible during extraction.
- Leftist Heap maintains rank(null) = 0, rank(node) = 1 + rank(right), and
  rank(left) >= rank(right). Recursively meld right spines and swap when needed.
- Skew Heap has no balance ranks; unconditionally exchange children while
  returning from recursive meld. Distinguish amortized logarithmic work from a
  linear individual operation.
- Indexed Priority Queue keeps unique integer keys and a key-to-position Map.
  Update inverse positions on every exchange. Support both increases and
  decreases, direct deletion, extraction, peek, and clear; reject duplicate keys.
- Monotonic Queue is a decreasing linked candidate deque for the latest ten
  arrivals. Expire front indices and remove dominated backs before appending.
  Equal values retain the newest candidate. Display circular window history in
  a separate lower row, with a window-value count rather than a candidate count.

Priority Queue insertion collects Value and Priority; indexed insertion/update
collects Key and Priority, and deletion collects Key. Fibonacci decrease-key
collects visible ID and New key; reject missing IDs and increased keys unchanged.
Meld collects 1–16 comma-separated whole safe integers, builds a separate donor,
then melds it. Include donor construction in the action's costs and reject a
result above 64 nodes before allocating IDs or changing links. Peek, extract,
dequeue, and clear run without input and handle empty structures safely.
Explain amortized rows explicitly rather than presenting them as random-input
averages. Preserve the existing binary min-heap as a separate menu entry.

## Extended linear and text structures

All eight use shared automatic playback, structured input, immutable scene
snapshots, final-frame model commits, action and structure information, and full
Reset. Preserve the original logical count until commit. Show only values,
indices, links, roles, and statuses in the diagram; put results in the timeline.

- **Skip List:** ten unique sorted keys; seeded geometric towers capped at six
  levels. Insert, search by key, delete by key, and clear. Draw horizontal next
  links and vertical down links; reject duplicates without allocating an ID.
- **Unrolled Linked List:** ten values in linked blocks of capacity four. Insert
  at an explicit zero-based index, search/delete the first matching value, and
  clear. Split full blocks and merge a following block after deletion when it
  fits; show global index ranges and block occupancy.
- **XOR Linked List:** ten linked numeric values with cached endpoints and a
  Map of simulated addresses. Append, search/delete the first matching value,
  and clear. Store `previous XOR next` as BigInt, decode links while carrying
  the previous address, and repair both neighbors when deleting. Label address
  and XOR fields and explicitly identify the simulation.
- **Gap Buffer (under String / Text):** ten ASCII characters around a movable gap. Insert text at an
  index, move the gap, delete an indexed span, search for text, and clear. Show
  physical indices and logical text indices separately. Grow gap storage only
  when needed; retain a nonzero gap so cursor movement remains valid.
- **Rope (under String / Text):** ten ASCII characters in immutable AVL-balanced chunks of at most
  four characters. Insert, concatenate, read by index, delete a span, and clear.
  Show left-subtree weights and leaf text. Split/join edits share unchanged
  subtrees and update weights and heights; do not flatten and rebuild all text.
- **Bit Array / BitSet (under Set / Union):** ten logical bits packed into unsigned 32-bit words.
  Set, clear, toggle, test by index, and clear all. Show word values and expanded
  bit positions. Clear preserves bit count; preserve unsigned bit-31 behavior.
- **Sparse Array:** 64 logical slots and ten initially stored entries. Set/read
  an indexed entry, delete an entry, and clear stored entries. Unstored holes
  read as zero; explicit zero is a stored entry. Deletion never shifts indices
  or changes logical length. Draw only stored entries and directory metadata.
- **Free List:** ten fixed simulated pool slots, initially three allocated and
  seven free. Allocate a value, release a slot by ID, and release all. Allocation
  pops the free head and release pushes onto it. Reject exhaustion and double
  release. Separate allocated and free rows while preserving physical slot IDs.

Use numeric safe-integer validation and current index bounds. Text input accepts
1–32 printable ASCII characters, preserving spaces. Validate complete deletion
spans before mutation. List examples allow 64 values and text examples allow 256
characters. Keep at most 96 detailed operation frames and a final result, stating
how many additional events were executed but omitted. The cap limits recording,
not algorithm execution. Explain fixed-height skip-list limits, Map assumptions,
rope path-copy storage, packed-word counts, and deferred garbage collection in
the relevant action information.

## Additional Set / Union operations

Disjoint Set starts with ten members in three components and stores real parent
links and ranks. Make set creates one new singleton. Find representative uses
iterative full path compression; Union components links lower rank under higher
rank and increases rank only on a tie. Check connectivity compares compressed
representatives. Validate both requested members before either find changes a
parent. Same-component union never adds a link; no arbitrary member deletion.
Clear releases descendants before parents. Ranks remain height upper bounds
after compression. Show actual child-to-parent arrows and root/rank roles.

Ordered Set starts with ten unique keys in the canonical AVLTree storage.
Add, Contains, Lower bound, Remove, and Clear use the real tree algorithms.
Lower bound returns the smallest key at least the query, or null. Show AVL
heights, balances, comparisons, and rotations. Reject duplicate keys unchanged.

Multiset starts with ten occurrences across six distinct values, storing one
positive Map count per value and a cached total. Add increments one occurrence;
Count returns an exact count, including zero for absence. Remove one occurrence
decrements one counter and deletes an entry only when it reaches zero. Clear
releases distinct entries. Show value/count cards and count total occurrences;
positions imply insertion order, without claiming visible hash-table storage.

Interval Set starts with ten stored closed integer intervals. Union with interval
coalesces overlaps and adjacency; Subtract interval keeps nonempty remainders and
may split a range. Contains value binary-searches the sorted intervals. Intersect
with interval returns exact overlap bounds without changing storage. Clear
releases stored intervals. Both endpoints are included; never enumerate covered
integers. Use exact adjacency comparisons at safe-integer limits, with guarded
endpoint increments/decrements. Count stored intervals, not covered integers;
equal card spacing represents sorted storage rather than numeric distance.

All four use whole safe-integer inputs, structured dialogs, shared automatic
playback, stable IDs, independent scenes, final-clone commits, and full Reset.
Allow up to 64 members, ordered keys, total bag occurrences, or stored intervals.
Reject a complete request before consuming IDs if its result exceeds the limit,
including an interval split. Keep 96 detailed events and disclose omissions while
executing all algorithm work. Queries finish on result frames with visited
highlights; find and connectivity may commit compressed parents. Complexity
information states Map assumptions, actual interval-array costs, output storage,
and amortized sequence bounds without confusing them with per-operation bounds.

## Hash-based, set, and probabilistic structures

Hash Map associates unique whole-number keys with whole-number values. Use
separate collision chains and an initial eight buckets; double the bucket count
before a new entry would exceed a 0.75 load factor. Existing-key updates keep the
node ID and count, and do not resize. Normalize negative remainders into valid
bucket indices. Show bucket roles, key/value cells, collision comparisons, and
rehashing in the shared renderer. Hash Set belongs to Set / Union, composes the same storage, keeps values
unique, and leaves duplicates unchanged. Clear releases entries one by one while
retaining bucket capacity and the ID counter. Both default examples have ten entries.

Bloom Filter belongs to Overview's Probabilistic group. It uses 32 bits and three
deterministic seeded hashes. Add sets bits;
membership checks stop at the first zero (**definitely absent**), otherwise report
**possibly present**, explicitly explaining false positives. Do not offer individual
deletion, exact enumeration, or an exact distinct-member count. Its default records
ten add operations, and repeated adds count as operations even if bits stay set.
Clear resets all bits and the add-operation count. Show bit indices and SET/ZERO
statuses, with results in the timeline description rather than standalone canvas text.

All three reuse validated numeric input, automatic playback, final-frame commits,
the full Reset button, structure information, and per-action complexity dialogs.
Hash-table operations have expected O(1) time under uniform hashing and bounded
load (amortized for insertion), with O(n) worst-case collision or resize work.
Insertion may allocate O(b) bucket references during growth; clear visits all
n entries and b buckets. Bloom add costs O(k), membership costs O(1) best and
O(k) average/worst, and clear costs O(m), with k = 3 hashes and m = 32 bits.
Explain these parameters even though the example fixes their values.

### Additional probabilistic structures

The six additional entries have their own storage and animated operations under
Overview > Probabilistic. Their defaults record ten insertions, weighted updates,
or arrivals; count labels must identify that quantity rather than claiming an
exact distinct cardinality. Display full counter labels below cells with enough
space for active/visited statuses above the following row. Keep diagram bounds
fixed throughout playback and retain the shared 96-detailed-frame cap.

- **Counting Bloom Filter:** 32 four-bit counters, three seeded hashes, and
  at most 64 live insertions. Aggregate repeated hash positions before overflow
  checks; reject the complete insertion if a counter would exceed 15. Membership
  uses counters only. Remove decrements one recorded occurrence, guarded by an
  extra exact-key occurrence ledger. Disclose that this guard adds O(n) storage.
- **Cuckoo Filter:** eight buckets with two nonzero eight-bit fingerprints each.
  Alternate buckets use an involutive XOR mapping. Find a complete relocation
  path by deterministic BFS before moving residents; reject without mutation if
  no path reaches a hole. This is a BFS teaching variant rather than random kicks.
  Queries inspect fingerprints only. An extra exact-key ledger guards removal;
  false-positive membership alone never authorizes deletion. No resizing is offered.
- **Quotient Filter:** sixteen circular slots, four quotient bits, eight remainder
  bits, and occupied/continuation/shifted metadata. Keep one empty slot, allowing
  fifteen fingerprint occurrences, including duplicates. Membership walks actual
  metadata and sorted runs. Insertion decodes fingerprints and rebuilds packed
  runs around a valid circular cut, with its higher complexity disclosed. Store no
  full keys; individual deletion is not offered by this variant.
- **Count-Min Sketch:** three rows of eight BigInt counters with separate fixed
  hash seeds. Add a positive safe-integer weight to one counter per row. Estimate
  frequency by the minimum; positive updates guarantee no underestimation, while
  collisions can overestimate. Show total weight independently of update count.
  Queries never mutate counters. Clear runs without input; no decrements are offered.
- **HyperLogLog:** sixteen register maxima from a fixed 64-bit hash: four index
  bits and sixty rank bits. Add computes leading-zero rank plus one; repeated
  values leave their register contribution unchanged. Estimate distinct count runs
  without input, using alpha16 = 0.673 and small-range linear counting. Empty
  registers estimate zero. Typical standard error is about 26% under ideal hashing,
  not a guaranteed error bound. This is classic HLL, not HLL++, without an exact set.
- **Reservoir Sampling Buffer:** Algorithm R with five retained stream occurrences.
  Fill initially, then draw an integer from 0 through seen - 1 and replace only
  if it indexes a sample slot. Count skipped arrivals and keep duplicates as
  separate occurrences. Show arrival numbers and stable item IDs. Inspect sample
  and Clear run without input. Clone generator state; Clear restarts the fixed
  seed but preserves the item-ID counter. Use integer rejection sampling to avoid
  modulo bias; limit experiments to 2^32 - 1 arrivals.

Use fixed seeded avalanche mixing for reproducibility, not cryptographic promises
or proofs of hash independence. Explain that theoretical filter/sketch error and
equal reservoir-inclusion claims assume suitable hashing or ideal uniform draws.
Keep exact keys out of sketches and reservoir histories. The two explicit deletion
guards are the only full-key registries in these new models and never answer queries.
Action information describes each implemented variant and excludes trace snapshots
from algorithmic complexity. Include only verified real-technology links. The
Quotient Filter entry cites [Squeakr](https://github.com/splatlab/squeakr), explicitly
identified as a counting quotient filter variant used for genomic k-mer counting.

Algorithm references: [Cuckoo Filter paper](https://www.cs.cmu.edu/~binfan/papers/conext14_cuckoofilter.pdf),
[Quotient Filter paper](https://www3.cs.stonybrook.edu/~bender/newpub/2012-PVLDB-dont-thrash-BenderFaJo.pdf),
[HyperLogLog paper](https://algo.inria.fr/flajolet/Publications/FlFuGaMe07.pdf), and
[reservoir sampling](https://xlinux.nist.gov/dads/HTML/reservoirSampling.html).

## Clear for Array, LinkedList, BinaryTree, and Graph

Each structure provides a working **Clear** action with no value input. Use the
shared playback controls, preserve the original model, and commit an empty result
only on the final frame. Rewind and replay restore the original. Empty inputs
complete safely. Keep ID counters across clear so future insertions use fresh IDs.

- **Array:** return a separate fixed array of length zero and fade the old
  allocation as a whole. Do not overwrite values, leave spare capacity, or resize
  the original fixed array. This reference replacement takes O(1) time and extra
  memory; automatic collection of unused storage is outside the operation.
- **Linked list:** save head.next, disconnect the old head, and release it.
  Repeat until head is null. Show each release without moving surviving nodes.
  Time is O(n) and extra memory is O(1).
- **Binary tree:** use iterative left-right-root postorder and release children
  before their parent. Show visits, incoming-pointer disconnections, and releases
  separately. The model clears actual links without rotations or repeated value
  searches. Time is O(n); traversal stack space is O(h), with O(log n) best and
  average space for balanced trees and distinct random-order insertions,
  respectively, and O(n) worst space for a chain. Explain empty inputs separately.
- **Graph:** empty every adjacency list, then release all vertices. Show each
  undirected edge once and include self-loops, isolated vertices, duplicate values,
  and disconnected components. Time is O(n + e), where e counts undirected edges;
  extra memory is O(1). The model releases adjacency records in place without
  rebuilding the graph or searching for each vertex.

Keep the original element count until commit. Scene snapshots, recorded paths,
and playback copies do not contribute to the underlying algorithm memory cost.

## Balanced search trees and multiway trees

Add **AVL tree**, **Red-Black tree**, **B-Tree**, and **B+ Tree** under Trees.
Each loads ten unique integer keys and provides **Insert a key**, **Search by
key**, **Delete a key**, and **Clear**. Use the same action names for the BST.
These four models use unique keys:
duplicate insertion and missing deletion leave the model and ID counter unchanged.
The original unbalanced BST also rejects duplicates, using strict left < node < right ordering.

Tree input dialogs pass their values through the existing model algorithms.
Do not attach or remove nodes directly from the dialog or bypass rotations,
recoloring, page splits, borrowing, merging, or separator/leaf-link repairs.
Keep the original valid model committed while showing intermediate frames and
publish the completed result only on the final frame. Enable another tree action
only after that commit. Repeated operations must use that result, including
after duplicate rejection, a missing key, an empty tree, and clear/reinsert.

Keep actual algorithms in the structure model and expose synchronous trace
events, without timers or rendering dependencies. Each action owns its sequence
class, descriptions, and complexity information. Shared trace playback
records independent scenes from a cloned result. Intermediate steps retain the
original committed key count; commit only the final result, restoring the source
on rewind. Continue to use the shared Renderer and ActionPlayback controls.

- **AVL:** cache parent pointers and subtree heights. Show height/balance checks
  and separate single rotations for LL/RR and double rotations for LR/RL. Deletion
  transplants surviving nodes and repairs ancestors rather than rebuilding.
- **Red-Black:** use black NIL sentinels internally. Show red/black fills and
  explicit RED/BLACK text, so color alone does not carry meaning. Trace recoloring
  and rotations separately for insertion and deletion, including black-height
  deficit repair. Never expose NIL as a stored key. Preserve surviving node IDs.
- **B-Tree:** use minimum degree 2 (order 4), with at most three keys and four
  children per page. Non-root pages have at least one key. Split full children
  before descending; move the median into the parent. Deletion borrows through
  parent separators or merges siblings, and collapses an empty root.
- **B+ Tree:** use order 4: internal pages have two to four children and non-root
  leaves two to three records. Internal separators copy the minimum of each child
  after the first. Store records only in leaves; count records, not separators or
  pages. Leaf splits copy separators upward and repair next-leaf links. Deletion
  refreshes cached minima, borrows or merges, repairs leaf links, and collapses a
  one-child root. Local repairs must not recompute the whole tree.

Draw multi-key pages as rectangular nodes with separate key cells, child edges
clipped to page boundaries, and directed next-leaf links for B+ Tree. Layout
infrastructure is shared across the two binary balanced trees and the two multiway
trees, with structure-specific layout wrappers colocated with their models.
Keep icons as bounded SVGs in the existing menu style.

B+ Tree also offers **Range from key**, with inclusive minimum and maximum keys
collected in its input dialog. Descend once to the first leaf, then scan next links
until a key exceeds the maximum. Report results
in the step description; do not add standalone result text to the diagram. Time is
O(log n + k) and extra memory O(k + 1), including the k returned records. Its model
provides the same inclusive bounded range used by the animation.

Balanced searches and mutations have O(log n) worst-case time at fixed page order.
Explain early matches and duplicate/no-op cases in each action. Binary balanced
models and B+ deletion use cached parent references and O(1) auxiliary space.
B-Tree deletion uses a logarithmic recursion stack on success and constant space
for a miss. Page insertion can allocate O(log n) split pages in the worst case;
its O(1) average allocation is amortized over insertion-only unique-key sequences.
Clear releases nodes/pages in postorder in O(n) time with O(log n) stack space;
it does not repeatedly rebalance a discarded tree. Exclude tracing and snapshot
storage from algorithm costs, and explain empty inputs separately.

## Additional tree structures

Trie, Heap, Segment Tree, Fenwick Tree (BIT), R-Tree, and LSM Tree each load ten
logical elements. Reuse the shared renderer, input dialog, progress toolbar,
automatic playback, final-frame commits, and full Reset. Each action retains its
own sequence class and complexity information beside its component and CSS.

- Trie stores words through character nodes with cached parent links and word-end
  markers. Reject duplicate words without allocating IDs; preserve shared prefixes
  during deletion. Prefix checks do not require a word-end marker.
- Heap is a complete binary min-heap in array order. Insertion appends and sifts
  up; extraction replaces the root with the last leaf and sifts down. Only offer
  insert, extract minimum, peek minimum, and clear; allow duplicate values.
- Segment Tree stores cached interval sums; point assignment recomputes only its
  ancestor path. Query fully covered segments and prune disjoint ones.
- Fenwick Tree stores one-based BIT cells, with zero-based user indices. Add a
  delta through update ancestors; prefix queries subtract the least significant
  set bit. Range queries subtract two prefixes. Show each cell's covered interval.
  Segment and Fenwick sums use exact integers; Clear resets values to zero and
  preserves array length. Their input dialogs enforce current index bounds.
- R-Tree uses order-4 pages with at least two entries per non-root page, quadratic
  splitting, least-area-enlargement descent, and inclusive rectangle intersection.
  Deletion scans for the record ID, condenses underfull pages, reinserts orphan
  records without changing their IDs, and collapses a one-child root. Draw the
  bounding-rectangle hierarchy and record IDs; describe returned IDs above the
  timeline. Rectangle area comparisons use exact integer arithmetic.
- LSM Tree is an in-memory teaching model: a sorted-array memtable, automatic
  flush at four distinct keys, immutable sorted runs, and explicit full compaction.
  Keep sequence numbers and tombstones. Lookups search memory and newest runs first
  and stop at tombstones. Compaction flushes memory, pairwise merges every run,
  keeps the newest version, then drops tombstones only when all older runs are
  covered. Show storage rows newest first and distinguish pending compaction
  output from source records with unique scene IDs. State that disk I/O and a
  write-ahead log are outside this model. Complexity describes this implementation,
  including exact-count lookups before writes and sequential pairwise merging.

## Abstract Syntax Tree (AST)

Add AST under Trees with a ten-node default expression:
`-(8 + 2) * (9 - 3) / 2`, which evaluates to `-30`. Support Build from expression,
preorder/inorder/postorder traversals, evaluation, and clear. Expressions contain
whole safe integer literals, unary signs, `+`, `-`, `*`, `/`, and parentheses,
with at most 128 source characters. Use a class-based recursive-descent parser;
never execute source text. Multiplication/division bind before addition/subtraction,
binary operators associate left, and unary signs bind to the next operand.

Keep the parser and node types with the AST model. Validate the complete expression
before replacing a root or allocating IDs. Build a new tree with separate creation
and operand-connection frames; the source remains committed until the final frame.
Build replaces the old root reference; collection of discarded storage is outside
parsing cost. Clear explicitly releases children before parents and preserves the
next ID. Parentheses affect grouping but are not stored as syntax nodes.

Show literals, unary operators, and binary operators as labeled nodes with ordered
operand edges. Traversals return token lists, using `neg` and `pos` for unary signs;
inorder visits a unary sign before its operand and does not recreate parentheses.
Evaluation uses finite JavaScript numbers, supports fractional division results,
and reports division by zero or unsafe integer results at the offending node.
Queries leave syntax intact and finish with their actual numeric or token-list
return value in the timeline description; arithmetic failures display their error there.
Empty traversal returns `[]`, empty evaluation returns `null`, and empty clear is
safe. Use the shared input, playback, reset, renderer, and info dialogs.

Building costs O(m) time and additional memory for m source characters. Traversals
cost O(n) time and O(n) memory, including the returned tokens. Successful evaluation
costs O(n) time and O(h) stack memory; clear takes O(n) time and O(h) stack memory.
Here n is syntax node count and h is tree height: logarithmic for balanced binary
expressions, linear for a unary chain. State the balanced-shape average assumption
and exclude animation snapshots and trace records from algorithm memory costs.

## Graph variants

Keep graph models on a shared edge-ID adjacency representation. Each variant has
its own model class and action folders; reuse GraphModel, GraphSceneLayout,
GraphAnimation, and StructuredGraphAction across variants. Preserve the original
Graph API for legacy model consumers. New UI vertex values are unique so numeric
endpoint selection is unambiguous. All five default examples have ten vertices.
Render directed arrows, perpendicular curves for reciprocal/parallel edges,
visible self-loops, and e-number labels (plus weights where appropriate). Final
query descriptions must show the actual returned traversal, ordering, distance, or
boolean. Snapshots are independent and model/count changes commit at the final
frame; Reset disposes playback. GraphActionInput validates current vertex and
edge IDs through ActionInputRequest in the shared dialog.

## Algorithm navigation

Keep algorithm groups separate from the Overview structure groups in
MenuNavigation. Sorting lists Array and exposes its forty-eight sorting actions; Graphs Traversal
lists all eighteen graphs and reuses their model, input, sequence, renderer,
and info implementations. ActionCatalog.getScopedActions controls the visible
choices and App validates action selection against the selected scope. Keep the
selected action scope separate from menu browsing state: opening Algorithms or
Overview must not change a running example. Reopening the menu from a graph
example returns to the branch where it was selected, with reversible Back
navigation. Selecting the same graph in the other scope cancels the current
playback, preserves its last committed model, and opens the new action card.
Reset restores the default example within the selected scope.

Sorting reuses the fixed array model, shared renderer, and automatic playback.
Start its ten-element example in a deterministic shuffled order. Bubble Sort
compares adjacent values, swaps only when the left value is greater, and shortens
the unsorted prefix after each pass. Stop early after a pass without swaps.
Show both compared entries and label the sorted suffix. Keep stable element IDs
and fixed slot positions; never resize or add spare capacity. Sort a playback
clone and commit it only on the final frame. Empty and singleton arrays complete
safely. Reset restores the shuffled example, while switching scopes for the same
array preserves its last committed values. Best time is O(n) for an already
sorted array; average and worst time are O(n²), assuming uniformly random distinct
permutations for the average. Algorithm auxiliary memory is O(1), excluding
playback clones and snapshots.

Also provide Selection Sort, Insertion Sort, Binary Insertion Sort, Merge Sort,
Quick Sort, Heap Sort, Shell Sort, Counting Sort, Radix Sort, and Bucket Sort.
Also include TimSort, IntroSort, Dual-Pivot QuickSort, and Block Merge Sort.
Also include WikiSort, Smoothsort, Tree Sort, Tournament Sort, and Patience Sort.
Also include Cycle Sort, Comb Sort, Cocktail Shaker Sort, and Gnome Sort.
Also include Odd-Even Sort, Odd-Even Merge Sort, Bitonic Sort, Pairwise Sorting
Network, and Sample Sort.
Also include Parallel Merge Sort, Parallel QuickSort, External Merge Sort,
Polyphase Merge Sort, and Natural Merge Sort.
Also include Flashsort, American Flag Sort, Spreadsort, Burstsort, and Pigeonhole Sort.
Also include Interpolation Sort, Library Sort, Splay Sort, Strand Sort, Pancake
Sort, Stooge Sort, Slow Sort, Bogo Sort, and Sleep Sort.
Each action owns its component, CSS, sequence, and complexity
information. Keep model entry points and optional synchronous trace callbacks in
the canonical FundamentalDataStructures/Linear/Array/FixedArray model, with sorting
actions and helpers under DataStructuresAlgorithms/Sorting/Array. Reuse
ArraySortingLayout and ArraySortingAnimation for independent snapshots and fixed
slot positions. None of these actions collects a value.

Selection sort scans the complete unsorted suffix for each minimum, then swaps it
into place: all time cases are O(n²), auxiliary memory O(1), and it is unstable.
Insertion sort holds an entry above its empty slot, scans backward, shifts larger
entries right, and inserts stably. Best time is O(n), average/worst O(n²), with
O(1) extra memory. Binary insertion always binary-searches the prefix for the
position after equal values, then shifts entries. Its best time is O(n log n),
average/worst O(n²), and extra memory O(1); fewer comparisons do not remove shifts.

Merge sort splits recursively, copies sorted halves into one shared O(n) buffer,
and merges stably back into the existing allocation, taking O(n log n) time in
all cases. Distinguish auxiliary copies by their scene IDs; show empty unwritten
output slots and both compared buffer heads. Quicksort uses a deterministic
last-entry Lomuto pivot with <= on the left and > on the right. Show pivot choice,
comparisons, swaps, and finalized pivot positions; it is unstable. Best/average
time is O(n log n), worst O(n²). Recursive stack space is O(log n) best/average
and O(n) worst. Sorted, reverse-sorted, and all-equal values trigger its worst
case. Average assumptions use uniformly random permutations of distinct values.
Explain empty/singleton constant-time cases separately. All sorts preserve stable
entry IDs, fixed length, the source model, and the final-frame commit/reset flow.

Heap Sort builds a max-heap bottom up and iteratively sifts after extracting each
maximum into the sorted suffix. It is unstable, with O(1) extra storage, O(n)
best time for all-equal keys, and O(n log n) average/worst time. Shell Sort uses
decreasing Knuth gaps and gapped insertion by exchanges. It is unstable, uses
O(1) extra space, and takes O(n log n) best and O(n^(3/2)) worst time. Display
O(n^(3/2)) for the average as a conservative upper bound valid for every input
distribution. Explain that it follows from the proven worst-case bound and
that a tight expected growth rate remains unknown. Do not label this upper
bound as a tight average rate. The action-ordering control uses this same value.
Primary reference: [Princeton Shellsort documentation](https://algs4.cs.princeton.edu/code/javadoc/edu/princeton/cs/algs4/Shell.html).

Counting Sort uses a stable output array and key-relative counts and offsets.
Limit its inclusive max - min + 1 range to 4,096 before allocation; reject wider
inputs unchanged with a visible explanation. Accepted runs cost O(n + k) time
and space. Draw observed count cells only, explain omitted zero-frequency cells,
and distinguish COUNT, NEXT, and OUTPUT states. Radix Sort uses stable decimal
LSD buckets and takes O(d(n + b)) time and O(n + b) space, with b = 10 and at most
17 passes for safe integers. Bucket Sort uses b = n equal-width buckets and stable
insertion exchanges within each bucket. Best/average time is O(n + b), with an
independent uniform-key assumption for the average; worst time is O(n² + b).
Extra space is O(n + b). Use exact BigInt arithmetic for range normalization,
digit extraction, and bucket scaling, including negative and extreme safe integers.
Distribution scenes reserve consistent space for buckets/output and counters;
auxiliary copies use separate stable IDs. Empty/singleton runs take O(1).

Keep action panels bounded to the viewport and scroll only their action lists.
Keep their heading and back/info controls visible; contain overscroll and allow
keyboard scrolling with visible focus.

TimSort detects nondecreasing or strictly decreasing natural runs; reverse only
strict runs to preserve equal-key order. Extend short runs by stable binary
insertion. Use minrun threshold eight for the teaching array, the corrected
four-run collapse condition, and exponential/binary galloping after seven wins.
This variant uses a fixed gallop trigger and copies both adjacent runs into a
buffer. State those differences from the optimized OpenJDK implementation.
Best time is O(n), average/worst O(n log n); best space is O(1), average/worst
O(n). Run-stack and output scenes must retain unread entries and stable IDs.

IntroSort uses median-of-three quicksort with a 2 floor(log2 n) path budget,
heap-sorts a remaining range when the budget expires, and insertion-sorts ranges
of up to four entries. Recurse on the smaller partition and loop over the larger.
All time bounds are O(n log n); stack space is O(1) best and O(log n)
average/worst. The hybrid is unstable. Dual-Pivot QuickSort orders its endpoint
pivots, divides into three ranges, and skips the middle for equal pivots. Recurse
only into the two smaller ranges and loop over the largest to bound stack space.
It is unstable: time is O(n) best for all-equal keys, O(n log n) average for random
distinct permutations, and O(n²) worst for ordered distinct inputs. Extra space
is O(1) best and O(log n) average/worst. Do not claim the production OpenJDK
hybrid's guarantees for this unsampled endpoint-pivot variant.

Block Merge Sort demonstrates a locally implemented buffered block-wise multiway
merge variant. Sort blocks of ceil(sqrt(n)) entries by stable bottom-up merging,
then merge all block heads through a min-heap into a separate output array.
The final block may be shorter. Resolve equal head keys by original block order
to preserve stability across blocks. An initial ordered-input scan gives O(n)
best time with O(1) extra memory. Other inputs take O(n log n) time and O(n)
extra memory, including output; head cursors and the heap use O(√n). This is
distinct from constant-space internal-buffer block sorting. Show block pieces,
buffer reads, heap-head comparisons, and growing output with independent scene
IDs. Copy output back into the fixed allocation before the final commit.

WikiSort demonstrates the cache-free internal-buffer block merge algorithm.
Insertion-sort small base runs, borrow distinct keys as block tags and a second
internal merge buffer when available, roll tagged blocks through the right run,
then sort and redistribute all borrowed keys. Adapt the block size and use
stable rotation merging when distinct keys are scarce. Never allocate an
input-sized external buffer or replace this with the buffered Block Merge Sort
lesson. An ordered-input scan gives O(n) best time; average/worst time is
O(n log n), with random distinct permutations as the average assumption.
Additional algorithm memory is O(1), excluding trace snapshots; ties stay stable.

Smoothsort uses Leonardo max-heaps with iterative sift, trinkle, and semitrinkle
repairs. Encode the forest with arithmetic rather than JavaScript's signed
32-bit bitwise operations. Grow the forest, then split its rightmost heap while
finalizing the sorted suffix. Sorted input gives O(n) best time; random distinct
permutations and worst-case repairs take O(n log n). Extra memory is O(1) and
the algorithm is unstable.

Tree Sort inserts one auxiliary unbalanced BST node per array entry, directing
equal keys right to preserve arrival order. Read the tree in order through
parent links, without recursion, into the existing array. Show the auxiliary
tree and leave unwritten destination slots empty during output. Best/average
time is O(n log n), with balanced insertion order for the best and random
distinct permutations for the average. Sorted, reverse-sorted, and all-equal
input takes O(n²). Additional memory is O(n), and this variant is stable.

Tournament Sort builds a complete padded winner tree in O(n), then repeatedly
outputs the minimum and replays only that leaf's ancestors. Show matches,
exhausted leaves, and growing output. Use an empty marker rather than a numeric
sentinel, and break ties by original input position. All time cases are
O(n log n), additional memory is O(n), and this variant is stable. The verified
STXXL example uses tournament selection during external run merging; distinguish
that application from this whole-array lesson.

Patience Sort binary-searches for the leftmost pile whose top is at least the
new key. Show decreasing piles, then merge their tops through a min-heap into
output. Equal keys stacked together pop in reverse order, so this variant is
unstable. Nonincreasing and all-equal input gives O(n) best time; random distinct
permutations give O(n log n) average time and the worst case is O(n log n).
Extra memory, including piles, heap, and output, is O(n). Do not present patience
diff or subsequence detection as verified use of the complete sorting algorithm.

All five actions handle empty/singleton arrays in O(1), keep the allocation and
entry IDs, sort only the playback clone, and commit on the final frame. Reserve
consistent viewport bounds for growing auxiliary trees and piles throughout
each animation. Auxiliary copies have separate scene IDs and are removed from
the final frame; source element counts remain unchanged throughout playback.

Cycle Sort uses the comparison-based variant: count strictly smaller suffix keys
to locate a held entry's destination, skip equal keys already occupying that
destination, then write the entry and continue with the displaced entry until
the cycle closes. Show the held entry above the empty cycle-start slot; retain
all entry IDs exactly once in every scene. Array writes leave already correct
values untouched. All time cases are O(n²), including sorted input, because
every suffix is scanned; average assumes random distinct permutations. Extra
memory is O(1), and the algorithm is unstable. Do not claim the linear-time
bound of variants with precomputed destinations for this comparison variant.

Comb Sort uses gap = max(1, floor(gap * 10 / 13)), starting from the array length.
Do not apply the optional CombSort11 gap adjustment. Make one forward exchange
pass at each gap, and stop only after a gap-one pass without swaps. Show the
current gap and both compared entries. Sorted input still requires all shrinking
gaps, giving O(n log n) best time. Display O(n²) for the average case, assuming
uniformly random distinct permutations, and explain that it is a conservative
upper bound rather than a tight growth rate. At most n full gap-one passes give
O(n²) total work. Retain O(n²) as the worst-case upper bound. Extra memory is
O(1); distant exchanges make the algorithm unstable.
Do not show an unqualified "Not established" label or turn a published lower
bound into a tight average-time claim. For example, Section 5 of
[Vitányi's survey](https://arxiv.org/pdf/0905.4452) gives Ω(n² / 2^p) for a related
Dobosiewicz variant with p prescribed passes and an insertion-sort cleanup.
This lesson uses repeated gap-one bubble passes; its displayed bounds follow
directly from its own loops rather than assuming that related variant is identical.

Cocktail Shaker Sort alternates forward and backward adjacent sweeps. Each
forward sweep fixes a maximum at the right boundary; each backward sweep fixes
a minimum at the left boundary. Shrink the active range and stop after a sweep
without swaps. Show the direction and finalized prefix/suffix. Ordered input
takes O(n), random distinct permutations take O(n²) on average, and reverse
order takes O(n²) in the worst case. Use O(1) extra memory and exchange strictly
inverted neighbors only, preserving stable ties.

Gnome Sort walks one slot forward when neighboring entries are ordered, or
exchanges a strictly inverted pair and steps backward. At index zero, turn
forward. Show forward steps and backtracking without labeling a tentative
prefix as globally final. Best time is O(n) for ordered input; average assumes
random distinct permutations and takes O(n²), as does reverse-order worst time.
Extra memory is O(1), and adjacent strict exchanges preserve stability.

These four actions require no value input, complete empty/singleton arrays in
O(1), keep fixed slots and entry IDs, and reuse automatic playback with a final
commit of the sorted clone. Their usage catalogs show educational-example
notices until practical product use has been verified; do not cite algorithm
demonstration collections as real products.

Odd-Even Sort alternates adjacent pairs starting at even and odd zero-based
indices. Stop only after a complete two-phase round without swaps. One clean
parity phase is insufficient. Strict adjacent exchanges preserve stable ties.
Best time is O(n) for ordered input, average time O(n²) for random distinct
permutations, and worst time O(n²) for reverse order. Extra memory is O(1).

Odd-Even Merge Sort uses Batcher's construction: recursively sort halves, merge
the even and odd wires, then repair neighboring outputs. Pairwise Sorting
Network uses Parberry's distinct recursive construction: compare pairs, sort
their lower and upper members in strided subnetworks, then combine ordered
pairs at decreasing pair distances. For arbitrary lengths, generate the next
power-of-two schedule and prune comparisons touching conceptual trailing
infinity wires. Do not allocate actual sentinels or additional model slots.
Do not implement either action by renaming another sorting algorithm.

Bitonic Sort uses Lang's arbitrary-length construction: sort the first half in
the opposite direction, sort the remainder in the requested direction, then
merge at the greatest power of two strictly below the range length. Preserve
ascending and descending comparator directions. Simply skipping out-of-range
comparators in the usual padded bitonic network is insufficient.

These three recursive networks take O(n log² n) sequential comparator work in
every case, since their schedules depend only on length. The average bound
holds for any input distribution. The generators use O(log n) stack memory;
comparators are executed on demand instead of stored as a network. All three
are unstable. Describe sequential work separately from parallel network depth.
The shared layout draws the active comparator between real array slots, labels
its direction, and removes the link on the final frame. All entry IDs and fixed
slot positions remain intact. The verified Bitonic Sort product example is
PyTorch's small unstable CUDA tensor-sort path; identify its padded parallel
implementation as a different variant from this sequential lesson.

Sample Sort is a stable sequential teaching variant with two to four buckets.
Choose at most seven regularly spaced entries, stably sort this sample, and
select sample quantiles as splitters. Binary-search the splitter array for each
source key; ties go to the right bucket. Preserve arrival order, allow repeated
splitters and empty buckets, stably bottom-up merge-sort each bucket, then
concatenate into separate output before copying back to the fixed allocation.
Skewed and all-equal inputs finish through local merge sorting without recursive
repartitioning. This bounded-fan-out variant takes O(n log n) sequential work
in all cases and O(n) auxiliary memory, including buckets, buffers, and output.
Its average bound holds for any input distribution. Display independent sample,
splitter, bucket, and output rows with stable auxiliary IDs and consistent scene
bounds. Local buffered merges publish complete merged pieces so partial writes
never create duplicate scene IDs. Do not claim this variant has the memory or
parallel-time guarantees of production in-place parallel sample sorts.

All five actions use the shared no-input playback and final-frame commit/reset
flow. Empty and singleton inputs take O(1). Use educational-example notices when
practical product use of the demonstrated variant has not been verified.

Parallel Merge Sort and Parallel QuickSort show two logical worker lanes and
explicit task dependencies. Record operations deterministically in one thread;
do not present simulated lanes as actual browser parallelism. Merge parents
wait for both child sorts, then perform a stable sequential buffered merge.
Total work is O(n log n) in every case, auxiliary memory O(n), and ideal
unlimited-worker span is O(n) with these sequential merges. QuickSort partitions
around the middle-slot key into less/equal/greater regions before forking its
disjoint children. All-equal input takes O(n) work and O(1) task space; random
distinct input averages O(n log n), adversarial pivots can take O(n²), and the
retained task graph uses O(n) average/worst space. QuickSort is unstable.

External Merge Sort forms stable sorted runs in RAM chunks of at most three
records and alternates them between two input tapes. Merge adjacent run pairs
into two alternating output tapes; copy an unpaired run. Exchange the two pairs
of tapes after each balanced pass. Polyphase Merge Sort instead uses three
tapes: fill consecutive Fibonacci quotas on two inputs with real and empty
dummy runs, then merge until an input is exhausted. Rotate that empty tape into
the output role without redistributing the remaining runs. A dummy plus a real
run transfers the real run without record I/O; two dummies yield a dummy. Its
simple tape-order tie rule is unstable after rotation. Both lessons use O(n log n)
total record work with fixed chunk size and O(n) auxiliary simulation storage.
Logical merging needs two head records and one output record, but all virtual
tape data lives in RAM. Never claim actual disk files or constant total app
memory. Count logical one-record reads/writes during run generation and tape
merges; exclude the final load into the visualization array. Keep the original
array order visible until that final load and retain all record IDs.

Natural Merge Sort recognizes nondecreasing or strictly decreasing runs,
reverses only strict descents, and stably merges adjacent pairs in successive
passes. Carry the final unpaired run. A single run takes O(n) time and O(1)
auxiliary memory because its buffer is lazy. For r runs, work is O(n + n log r),
with O(n log n) average/worst time and O(n) average/worst memory. Average
assumptions use randomly ordered distinct keys. Distinguish this lesson from
TimSort: do not extend short runs, use a run-stack policy, or gallop.

All five sorts use no-input shared playback, clone-only execution and final
commit/reset behavior. Empty/singleton inputs take O(1). Keep task/run/tape
roles legible alongside color, use distinct auxiliary IDs, hide unread main
slots during buffered writes, and reserve maximum diagram bounds for the full
session. Production examples must identify their actual variant: OpenJDK has
optimized parallel merges, oneTBB has different quicksort pivots and leaf sorts,
PostgreSQL uses balanced multiway merging (polyphase is historical version 14),
and GHC sorts lists using optimized natural-run merges.

Flashsort uses max(2, floor(0.43n)) value-range classes. Map keys with exact
BigInt arithmetic, accumulate exclusive class ends, move the maximum to the
first slot, and perform class-end-directed cycles with one held entry. Hide
the cycle hole so every original ID remains represented exactly once alongside
the held entry. Finish by adjacent insertion exchanges. All-equal input takes
O(n) time and O(1) memory before allocating classes. Expected time is O(n) for
independent uniform keys with this linear class count; clustered keys can need
O(n²) cleanup. Otherwise extra memory is O(n), and class permutation is unstable.

American Flag Sort uses an in-place MSD radix permutation with 16 hexadecimal
bins. Normalize keys by subtracting the observed minimum exactly; never coerce
safe integer keys through JavaScript signed 32-bit operations. Count each digit,
prefix-sum the contiguous bin intervals, and exchange misplaced entries with
the next free slot of their actual bin. Recurse to the next lower digit. State
O(nd) average/worst upper bounds and O(d) stack/metadata space for fixed radix
16, where d is the hexadecimal width of max - min (1 through 14). All-equal
input takes O(n) time and O(1) space. The permutation is unstable.

Spreadsort is a reduced-fan-out teaching integer variant. Scan each range for
actual bounds and existing order, choose up to four significant range bits
according to range size, and permute up to 16 bins in place. Sort ranges of at
most four entries by insertion exchanges. Limit partition depth to
2 floor(log2 n); heap-sort a remaining range when that budget expires. Ordered
input takes O(n) time and O(1) space. O(n log n) average/worst entries are
guaranteed upper bounds, not tight claims about the optimized Boost algorithm;
active boundaries and recursion use O(log n) space. This variant is unstable.
NEST Simulator documents practical Boost Spreadsort use for connection sorting;
explain the difference from the lesson rather than citing a demo collection.

Burstsort is explicitly an integer adaptation of string Burstsort. Encode
value - min as a zero-padded hexadecimal string of common width d so lexical
and numeric order agree. Insert record pointers into prefix containers; when a
container exceeds three records, replace it with a trie node and redistribute
by the next digit. Recursively burst oversized children. Full-key equal
containers are terminal and must never recurse beyond d. Sort nonterminal
leaf suffixes by stable insertion exchanges, traverse trie children in digit
order, and gather into stable output. Retain one digit and parent link per
trie node; reconstruct complete prefixes only in trace snapshots. With bounded
leaf size, encoding, traversal, and suffix comparisons take O(nd) time and
encoded keys, trie nodes, and output use O(nd) memory. Do not claim the cache
performance of optimized string Burstsort for this teaching adaptation.

Pigeonhole Sort allocates one list for each possible integer key in the
inclusive range k = max - min + 1, appends complete original entries to these
lists in arrival order, and gathers lists in key order into output. This is
distinct from Counting Sort frequency/prefix placement. Reject ranges wider
than FixedArray.maximumPigeonholeRange (4,096) unchanged after a bounds scan,
before allocating holes. Use exact BigInt offsets for negatives and extreme
safe keys. Accepted inputs take O(n + k) time and memory in every case, with
stable ties. Display occupied holes and explain omitted empty holes.

These five actions use shared no-input playback, independent snapshots, stable
entry IDs, fixed slot positions, and clone-only execution with final commit.
Empty/singleton inputs take O(1). Reserve the maximum diagram bounds throughout
each session, label counts/cursors and trie/container roles, and keep every
dependency edge attached to an existing scene node. The Burstsort diagram
places containers below the deepest possible key level. Rejected Pigeonhole
Sort ends with an unchanged array, without sorted badges. Show educational-use
notices wherever concrete product use has not been verified.

Interpolation Sort uses n estimated-rank intervals with
floor((key - min) * (n - 1) / (max - min)), evaluated exactly using BigInt.
Count intervals, prefix-sum their output positions, place entries in source
order, then insertion-sort the interpolated arrangement. This buffered stable
histogram variant differs from Flashsort class-end cycles. All-equal input
takes O(n) time and O(1) memory before allocation. Independent uniform keys
give O(n) expected work; clustered collisions can need O(n²) cleanup. Otherwise
histogram and output storage use O(n) memory. Strict exchanges preserve ties.

Library Sort uses a separate auxiliary shelf, never gaps or spare capacity in
the fixed numeric model. Precheck for ordered input in O(n) time and O(1)
memory. Otherwise allocate 2n + 1 auxiliary slots. Double insertion-round
targets, redistribute existing books evenly, upper-bound search the gapped
shelf, and shift toward a nearby gap while retaining shelf order. Equal keys
insert after previous arrivals, making the variant stable. Gapped-insertion
average O(n log n) assumes uniformly random distinct arrival order; the app
preserves input order. Adversarial arrivals can require O(n²) gap shifts.
Shelf, rebalance, and gather storage use O(n) space. Keep shelf slot IDs stable
as gaps move, and reserve the largest shelf width for the full playback.

Splay Sort inserts original entries into an auxiliary splay tree and brings
every inserted leaf to the root using zig, zig-zig, or zig-zag rotations.
Publish only complete rotations with every parent/child link consistent.
Read the tree in order through parent links into separate output before
copying back. New equal entries descend right and rotations preserve inorder
entry order, so ties are stable. Monotone insertion gives O(n) best time;
amortized insertion bounds total average/worst time by O(n log n) without a
random-input assumption, even though a single insertion can be linear.
Tree and output use O(n) memory. Do not present general splay-tree applications
as proof that a product uses this complete sorting pipeline.

Strand Sort uses linked auxiliary nodes to preserve constant-time unlinking.
Scan the remaining list and extract a nondecreasing strand; stably merge it
into the accumulated sorted list, then repeat. Resolve merge ties in favor of
the older accumulated list. Relink nodes without losing or duplicating original
IDs, and keep all remaining/strand/sorted/merged records visible in separate
rows. Ordered input forms one strand in O(n); reverse input needs O(n²).
O(n²) is also a conservative average upper bound for every distribution.
Auxiliary linked nodes use O(n) memory. The fixed array changes only at gathering.

Pancake Sort prechecks ordered input in O(n). Otherwise scan each active prefix
for its maximum, flip that maximum to the front if needed, then flip it to the
prefix end. The sorted suffix must never be touched. Reverse prefixes by
pairwise exchanges without temporary reversed arrays. At most 2n - 3
nontrivial flips and full maximum scans give O(n²) average/worst time and
O(1) space. Prefix flips can reorder equal keys, so this variant is unstable.

Stooge Sort compares endpoints, then sorts the first two-thirds, last
two-thirds, and first two-thirds again. Its three overlapping recursive calls
give exponent log base 1.5 of 3, about 2.7095; display O(n^2.71) as a rounded
upper bound for every input order. Space is O(log n). Slow Sort sorts both
halves, compares their maxima to fix the final slot, then sorts the prefix of
length n - 1. Its data-independent recurrence gives superpolynomial work;
display O(n^(log₂ n)) as a conservative quasipolynomial upper bound, not a
tight rate. Its prefix recursion uses O(n) stack space. Both sorts are unstable.
Accept at most 12 entries (the respective FixedArray constants); reject larger
inputs unchanged before recursion. Execute the actual recurrence completely
for accepted input, recording at most 64 detailed operation frames and an
explicit summary of omitted comparisons/exchanges. Do not substitute a faster
sorting algorithm or claim summarized work did not occur.

Bogo Sort first checks sortedness, then tries at most 24 fixed-seed Fisher-Yates
shuffles (FixedArray.maximumBogoShuffles). Record each whole shuffle and its
sortedness result. On exhaustion restore the original order and end with an
unchanged, unfinished result without sorted badges. Never silently use a
fallback sort. Explain that ideal independent uniform shuffles of distinct
keys have O(n · n!) expected work, O(n) best-case checks, and no finite worst
termination bound. These ideal rows are separate from the capped simulation,
whose fixed number of attempts takes O(n) work and is not guaranteed to succeed.
Sorted input uses O(1) memory; attempted input keeps O(n) rollback references.
Actual seeded attempts are deterministic rather than independent ideal draws.

Sleep Sort is explicitly a simulation with no real timers, sleeping, or
threads. Normalize virtual deadlines as BigInt(key) - min so negative and
extreme safe integers are supported without overflow. Maintain a min-heap
ordered by deadline then original input position, and jump virtual time to
the next event instead of waiting. Heap scheduling gives O(n log n) time upper
bounds for every distribution and O(n) event/output storage. Stable equal-time
ordering is a choice of this simulation, not a promise about OS timer ordering.
Explain that real Sleep Sort depends on key range, timer precision, and
scheduling; launching n timers does not prove a correct O(n) sort.

All nine actions use no-input shared playback, independent snapshots, fixed
main-array slots, stable entry IDs, and final clone commit/reset behavior.
Empty/singleton inputs take O(1). Distinguish original records from auxiliary
copies, keep rotations and list moves structurally valid in every scene, and
reserve maximum auxiliary dimensions for the entire session. Rejected or
unfinished demonstrations leave the committed array unchanged. Use explicit
educational-example notices until practical use of the actual sorting variant
has been verified; algorithm collections and related structures do not qualify.

## Additional String / Text operations

Add Suffix Array, Suffix Automaton, Aho-Corasick Automaton, Directed Acyclic Word
Graph (DAWG), and FM-Index only once under String / Text. The first, second, and
fifth default to ten source characters; the dictionary automata default to ten
distinct words. Count labels distinguish source characters, dictionary patterns,
and dictionary words from allocated storage cells or states. Preserve the six
existing text structures and their keys.

All five support replacement Build, exact search, and Clear. Suffix Automaton also
supports online Append. Reuse shared structured input, automatic playback,
immutable scene snapshots, final-frame commit, fixed maximum sequence bounds,
96 detailed frames plus initial/final frames, and full Reset. Execute complete
operations even when recording is capped, disclosing omitted events. Query final
frames return results and retain visited states. Invalid rebuild input is checked
before storage changes; oversized appends reject without consuming IDs.

- **Suffix Array:** build source + a unique `$` terminator, merge-sort suffix start
  positions using direct source-range comparisons, and compute adjacent LCP by
  direct scans. Show source characters, SA positions, and LCP metadata. Do not
  claim SA-IS, prefix doubling, Kasai LCP, or linear-time construction. Search uses
  lower and upper binary bounds and reports all zero-based starts in suffix order.
- **Suffix Automaton:** store maximum lengths, character transitions, suffix
  links, and clone flags. Extend online with true clone-state splitting and
  transition redirection; retain source characters in an appendable array.
  Mark complete suffixes by the final state's suffix-link chain. Substring search
  accepts any reachable state, independent of suffix-final marks. Builds accept
  32 letters; appends accept 32 letters per request up to 64 total. Keep stable IDs
  across clear, with a persistent root role.
- **Aho-Corasick Automaton:** build a pattern trie and assign failure links breadth
  first with explicit fallback walks. Store own terminal pattern IDs and a link
  to the nearest terminal failure state; do not copy inherited output sets into
  every node. Show character, failure, and output links. Scan text once, report
  all overlapping matches and terminal suffix patterns, and return pattern/start/
  end records using zero-based half-open ranges. Scans preserve the dictionary.
  Preprocessing bounds must reflect sparse fallback walks rather than claiming
  the completed-transition-table linear bound.
- **Dictionary DAWG:** build a temporary trie, then minimize it bottom up using
  accepting flags and sorted labeled transitions to canonical child states.
  Equivalent right languages share one state with multiple incoming edges;
  display the actual acyclic graph. A lookup accepts only a complete word ending
  at a final state. This is a finite-dictionary minimal acyclic DFA, distinct from
  the suffix automaton entry. Do not claim incremental dictionary insertion.
- **FM-Index:** derive BWT from temporary suffix order, then keep cumulative
  counts C, dense exclusive-prefix Occ arrays, and sampled SA positions whose
  source positions are divisible by four. Discard temporary source and complete
  SA after construction. Backward search processes pattern characters right to
  left with `[l,r) = [C[c]+Occ(c,l), C[c]+Occ(c,r))`. Locate matching rows using
  LF steps to a stored sample, then add the number of steps modulo index length.
  Every row is within three LF steps of a sample. Expose actual rank counters;
  explain that dense Occ is an uncompressed teaching representation.

Use 1–32 lowercase a-z letters for source, append, substring, and word inputs.
Reserve `$` internally; reject uppercase, spaces in text, punctuation, and empty
patterns. Dictionary builds accept 1–16 distinct CSV words, at most 32 letters each
and 128 letters total; trim whitespace around words. Scan text accepts 1–128
letters. Clear runs without input, including on empty models. Empty searches
return no positions, no pattern matches, or false, as appropriate. Report results
in timeline descriptions rather than standalone diagram annotations. Give
captions and status markers enough space between rows.

Structure information includes verified primary-source technology examples and
variant notes. The suffix automaton cites the
[Baseten Speculation Engine](https://www.baseten.co/blog/boosting-mtp-acceptance-rates-in-baseten-speculation-engine/)
for token drafting during inference; distinguish that token-sequence application
from this lowercase substring-recognition lesson.
Algorithm references include the [dictionary-automata paper](https://aclanthology.org/J00-1002/),
[Aho-Corasick definition](https://xlinux.nist.gov/dads/HTML/ahoCorasick.html),
[suffix-automaton definition](https://xlinux.nist.gov/dads/HTML/suffixautmtn.html), and
[FM-index author's description](https://pages.di.unipi.it/ferragina/Libraries/fmindexV2/index.html).

## Extended tree operations

Trees also contains General Tree (N-ary Tree), Binary Tree, Complete Binary Tree,
Threaded Binary Tree, Splay Tree, Treap, Cartesian Tree, Scapegoat Tree, AA Tree,
2-3 Tree, 2-3-4 Tree,
Interval Tree, Order Statistic Tree, Persistent Segment Tree, Sparse Table,
KD-Tree, Quadtree, Octree, Bounding Volume Hierarchy (BVH), Merkle Tree, and
Van Emde Boas Tree. Radix Tree (Patricia Trie), Ternary Search Tree, and Suffix Tree
belong to String / Text alongside Trie, Rope, and Gap Buffer. Preserve the original BST and its key. Every entry starts
with ten elements and has working animated operations, structured inputs, and
structure information. Only offer the operations listed in README; do not imply
unimplemented deletion or balancing policies.

General/Binary attachment collects a unique key and parent key; Binary also
collects side (0 left, 1 right). Empty attachment creates a root; subtree deletion
removes descendants. Complete Binary Tree appends without heap order, permits
duplicate values, and replaces a deleted match with the deepest rightmost value.
Threaded inorder follows actual tagged neighbor pointers without a traversal
stack; returned output still uses linear space. Radix/Ternary/Suffix use lowercase
text of 1–32 letters. Suffix construction is explicitly naive and quadratic.
Interval Tree stores inclusive endpoint pairs and returns one overlap using an
unbalanced maximum-endpoint BST. Rank counts strictly smaller keys; selection is
zero-based in an AVL tree augmented with subtree counts.

Persistent updates collect an existing version, zero-based index, and replacement
value; queries collect version and inclusive index bounds. Keep old immutable roots
and share unchanged branches; allow eight versions. Sparse Table builds 1–64 CSV
safe integers and queries two power-of-two minimum blocks in constant time; explain
that this is a table, not a node tree. KD uses alternating 2D split axes without
rebalancing. Quad/Oct point buckets use [-1024,1024) integer coordinates, bucket
size two, sparse occupied children, and depth at most eleven. Queries use inclusive
boxes; Octree also collects Z bounds. BVH uses incremental 2D rectangle leaves and
refits AABB ancestors, without claiming balanced-query guarantees.

Merkle update and proof verification collect a data-leaf index and value. Use
SHA-256, prefix 0x00 for decimal-UTF8 data leaves and 0x01 for ordered child digests;
ten data leaves are padded to sixteen with empty-byte leaves. Compare full digests
and identify the padding difference from transparency-log trees. Show sibling
hash visits during verification. Van Emde Boas uses the integer universe 0..255,
recursive clusters and summaries, and strict successor queries. Preserve min/max
and local-key semantics; describe lazy allocation rather than eager O(U) space.

Bound traces to 96 detailed events while executing all work, report omitted detail,
keep independent scenes and fixed session bounds, and commit only the final clone.
Expected/amortized bounds must state their assumptions. Rejected requests retain
the original model, structure shape, and ID counters. Clear resets the ten fixed
values (and versions/hashes) in Persistent Segment Tree and Merkle Tree; other
extended entries become empty. No additional playback controls or browser checks.

## Additional hash operations

Hash-based also includes Open Addressing Hash Table, Separate Chaining Hash Table,
Robin Hood Hash Table, Cuckoo Hash Table, Hopscotch Hashing, Extendible Hashing,
Linear Hashing, Perfect Hash Table, and Consistent Hashing Ring. Preserve Hash Map
in Hash-based, Hash Set in Set / Union, and Bloom Filter in Probabilistic. Each new entry starts with ten records, keys, or servers
as appropriate and has validated structured inputs and action/structure information.

Seven mutable tables offer Insert/update (separate key and value), Lookup, Delete
by key, and Clear. Open addressing uses linear probes with real tombstones. Robin
Hood stores actual displacement ordering, permits early negative lookup, and shifts
backward on deletion. Show displaced or evicted entries in explicit holding cells
so a swap never silently loses a record. Cuckoo has two tables and two legal hash
positions; bound kick chains and try at most eight larger-table rebuilds. Hopscotch
has four-slot neighborhoods, home-owned bitmaps, wrapped legal relocations, and a
256-slot cap. A bitmap belongs to the home index, independently of its occupant.

Extendible hashing uses real shared directory references and local depths; draw
each aliased bucket only once. Three-record full buckets split on the next low hash
bit; only equal local/global depths double the directory. Cap depth at eight and
retain directory size on deletion. Linear hashing stores primary and linked overflow
pages; above 0.75 primary-page load split exactly the next pointed bucket, redistribute
with cached destination tails, and wrap the pointer after a complete round. Do not
substitute a doubled directory or a generic map for its storage. Deletion does not
reverse split rounds. Clear resets these two models to their initial metadata.

Perfect Hash Table is a static FKS key set. Build accepts 1–64 distinct CSV safe
integers; use n primary groups, require sum(s²) <= 4n, then allocate s² secondary
cells per group and retry collision-free affine hashes. Try at most 128 primary
and 128 secondary seeds per bucket; failure preserves the previous complete set.
Display candidate buckets and key copies separately until success. Lookup must
compare the complete stored key, including when a nonmember hashes into an occupied
cell. Do not offer dynamic insert/delete or call this table minimal perfect hashing.

Consistent Hashing Ring adds/removes server IDs, routes numeric keys, inspects ten
sample owners, and clears. Use three deterministic virtual tokens per server,
32-bit positions, stable tie ordering, clockwise lower-bound lookup, and wraparound.
Cap physical servers at sixteen. Display real token positions; equally spaced sorted
token geometry represents order, not numeric hash distance. Changes affect only
the joining/departing servers' intervals. Routed keys are not stored; sample key
cards show ownership only. Do not imply actual networking, replication, or threads.

Other new tables allow 64 entries. Keep snapshots independent and session bounds
fixed, record at most 96 detailed events while executing all work, disclose omissions,
and commit the final clone only. Rejected bounded attempts preserve canonical data,
placement metadata, capacities, seeds, and ID counters. Complexity descriptions
must distinguish deterministic bounded-rebuild costs from ideal randomized expected
bounds, and explain tombstone accumulation and retained allocations. Never run
npm, equivalent builds/type checks/tests, or browser application verification.
