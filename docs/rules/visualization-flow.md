# Visualization flow and action animations

## Main flow

1. Start with an empty renderer and a clickable menu icon in the top left.
2. Open the menu to see categories. The initial category is **Data structures
   common operations**. Selecting it shows **Linear** (Array, Linked list, Stack,
   Queue, Deque, Doubly linked list, and Circular buffer),
   **Trees** (Binary search tree (BST), AVL tree, Red-Black tree, B-Tree, and
   B+ Tree), and **Graphs** (Graph). Choose a group to see only
   its structures. Provide a path and Back navigation through these levels.
3. Selecting a structure loads an example containing 10 elements in the shared
   renderer. Lists, trees, graphs, and other structures can use different layouts.
4. After selection, close the structure picker and show the structure's allowed
   actions in a persistent card at the upper-left of the canvas. Mark the
   selected action with a highlight and `aria-current`, and put a small info
   button to each action's right.
5. Selecting a value/index action on a linear structure opens its input dialog.
   Confirming valid input starts its animation. Actions without an argument run
   directly. Trees and Graph continue to start with default inputs. Animations
   run to completion automatically. Reduced-motion styles still suppress visual
   transitions.

Browsing categories or groups must preserve the current visualization and action
session. Opening menus or info dialogs does not pause playback. If a structure is already selected,
reopen its structure group and retain the group path for Back navigation.
Actions are selected directly from the canvas card, without reopening the menu.
On smaller screens, place the action card above the diagram so it does not
overlap nodes. Move keyboard focus to the first action after choosing
a structure. Linear-structure actions can be repeated after completion, reopening
their input dialog when applicable and using the latest committed model. Disable their
operation buttons while an animation runs; keep info buttons and full Reset
available. Other structures preserve the session when selecting the current action.
Place the Current / Visited / New node legend at the top-left of the renderer's
center area, beside the actions panel and above the code snippet. Let the legend
wrap on narrow screens; do not keep it in the canvas footer.

Do not render a bottom animation panel or speed selector. Use the shared input
dialog for these actions:

- **Array, Linked list, Doubly linked list:** Insert at the start, middle, or end;
  Search by value; Search by index; Delete by value.
- **Stack:** Push and Search by value.
- **Queue and Circular buffer:** Enqueue and Search by value.
- **Deque:** Push front, Push back, and Search by value.

Value actions accept any safely representable whole number. Start the input
empty, and block nonnumeric
characters while typing or pasting; value inputs also allow a leading minus.
Search by index accepts a zero-based index within the current Array or list;
explain an empty structure and disable submission until an element exists.
Insertion actions retain their fixed start, middle, or end position and ask only
for the new value. Empty, fractional, and out-of-range input displays an error.
Cancel, close, Escape, or a backdrop click dismisses the dialog without starting
an action or changing the model. Focus the input on open and return focus on close.
Clear, Pop, Dequeue, Peek, and end-deletion actions run without an input dialog.
A full Circular buffer still accepts an enqueue request so its animation can
explain rejection without overwriting data. Trees and Graph use their
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
Center the current step's description above the timeline, replacing the visible
"Animation timeline" label and generic hint. Use the full available timeline
width and keep the text on a single line so it never changes header height or
shifts the diagram. On narrow screens, truncate overflow with an ellipsis and
provide the full description as a tooltip and accessible text. Retain an
accessible name for the progress indicator. Keep the description and code in separate rows.
Show the current step's pseudocode in a separate bar above the diagram in the
renderer center column beside the action card.
On narrow screens, place it above the diagram after the cards and allow long
snippets to scroll.
Hide the empty snippet area before an action is selected. During playback,
reserve a fixed-height snippet area so changing code line counts does not resize
or reposition the diagram. Align diagrams to the top of their viewport instead
of vertically centering them in unused canvas space. Center short code
within the bar and scroll longer snippets inside it.
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
Provide a larger info button at the action card's top-right corner for general
structure information. It opens a separate centered dialog with an empty content
area for future text. Support close, Escape, backdrop dismissal, focus return,
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

## Action responsibilities

Each action describes its own ordered animation sequence. Define the sequence in
a TypeScript class next to its `.tsx` component and `.css` file in the action folder.
Each step includes a phase, title, explanation, relevant pseudocode, duration, and
scene snapshot. Keep scene snapshots independent so stepping backward and replaying
are deterministic.
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
belongs to **Data structures common operations → Linear**.

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
value**, **Delete by value**, and **Clear**. These four models use unique keys:
duplicate insertion and missing deletion leave the model and ID counter unchanged.
The original unbalanced BST also rejects duplicates, using strict left < node < right ordering.

Keep actual algorithms in the structure model and expose synchronous trace
events, without timers or rendering dependencies. Each action owns its sequence
class, descriptions, pseudocode, and complexity information. Shared trace playback
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

B+ Tree also offers **Range from value**, with an inclusive minimum and unbounded
upper end. Descend once to the first leaf, then scan next links. Report results
in the step description; do not add standalone result text to the diagram. Time is
O(log n + k) and extra memory O(k + 1), including the k returned records. Its model
also supports an inclusive bounded range for reuse.

Balanced searches and mutations have O(log n) worst-case time at fixed page order.
Explain early matches and duplicate/no-op cases in each action. Binary balanced
models and B+ deletion use cached parent references and O(1) auxiliary space.
B-Tree deletion uses a logarithmic recursion stack on success and constant space
for a miss. Page insertion can allocate O(log n) split pages in the worst case;
its O(1) average allocation is amortized over insertion-only unique-key sequences.
Clear releases nodes/pages in postorder in O(n) time with O(log n) stack space;
it does not repeatedly rebalance a discarded tree. Exclude tracing and snapshot
storage from algorithm costs, and explain empty inputs separately.
