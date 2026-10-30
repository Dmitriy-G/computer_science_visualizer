# Data Structures Visualizer

A TypeScript and React app powered by Vite, built with class components and
object-oriented data structure and animation classes.

## Explore

Open the menu in the top left and choose **Data structures common operations**.
Choose **Linear** for Array, Linked list, Stack, Queue, Deque, Doubly linked list,
and Circular buffer, **Trees** for BST, AVL, Red-Black, B-Tree, and B+ Tree, or
**Graphs** for Graph, then choose the structure and an action. Each structure
starts with 10 elements. Back navigation follows the same category path.

Choose **Linked list → Insert in the middle** to watch traversal, node creation,
unlinking, opening space, insertion, and both new pointer connections. Playback
starts automatically unless reduced motion is enabled. Pause, step backward or
forward, scrub the timeline, replay, or adjust speed. Reset the animation to its
first step to change the inserted value. Completion commits the new node;
rewinding or replaying restores the original list before applying the action again.

Choose **Array → Insert in the middle** to see an original fixed array and a
separate newly allocated array with exactly one extra slot. Copy the prefix to
the same indices, place the new value in the middle, then copy the suffix one
index farther right in the new array. The original values stay in place throughout
copying. Once the result is complete, switch to it and release the original if
unused. The default array has exactly 10 slots, and the first result has 11.
Both time and additional memory are O(n).

Choose **Binary search tree (BST) → Insert a value** to insert into an unbalanced binary search tree.
Compare from the root, follow left for smaller values or right for larger values,
find an empty child pointer, and create and connect a new leaf. Duplicate keys
are rejected: the animation highlights the existing node and leaves links, count,
and node IDs unchanged. The tree does not rebalance itself. Insertion
takes O(h) time, where h is the tree height, and O(1) additional algorithm memory.
The new node remains pending until the final step; rewind and replay preserve
the original tree. Subsequent insertions use the completed result.

Choose **AVL tree** to inspect cached heights, balance factors, and single/double
rotations. Choose **Red-Black tree** to watch red/black recoloring and rotations,
including the repair of black-height deficits after deletion. Colors also have
explicit RED/BLACK labels.

Choose **B-Tree** for order-4 pages with up to three keys, or **B+ Tree** for
order-4 internal pages and linked leaves that hold all records. Insertion shows
page splits; deletion shows borrowing, merging, separator updates, and root
contraction. Both count stored keys rather than page nodes; B+ separator copies
do not increase the count. Their default insertion of 99 demonstrates splits.

All four new trees provide **Insert a key**, **Search by value**, **Delete by
value**, and **Clear**. They use unique keys: duplicate insertion and missing
deletion leave the tree unchanged. The original unbalanced BST also rejects
duplicates and keeps its existing selection key. **B+ Tree / Range from value** reports all
records at or above an inclusive minimum, using the next-leaf chain after one
descent. Results appear in the animation controls.

Choose **Linear → Stack** for a linked, last-in-first-out stack. Animate **Push**,
**Pop**, **Peek (top)**, **Clear**, or **Search by value**. The example pushes 10
through 100, so 100 starts at the top. Push, pop, and peek take O(1) time. Clear
releases every node in O(n); search walks from the top with O(n) worst-case time.
Empty pop and peek return no value, and search preserves the stack order. Only
push and search need a value input. Each action supports the shared playback,
rewind, and replay controls. Mutations commit only on the final frame.

Choose **Queue** for FIFO enqueue/dequeue, front peek, clear, and value search.
Choose **Deque** (double-ended queue) to push, pop, and peek at either end, plus
clear and value search. End operations use cached pointers and take O(1) time.

Choose **Doubly linked list** to see separate **next** and **prev** connections.
Insert at the start, middle, or end; delete at either end or by value; search by
value or index; or clear. Indexed searches traverse from the nearer end, showing
backward navigation through prev pointers when starting at the tail.

Choose **Circular buffer** for a fixed-capacity FIFO ring. Its 12 slots initially
contain 10 values, with read starting at slot 8 to show wraparound. Enqueue writes
to the next free slot and rejects full buffers. Dequeue releases the oldest slot.
Peek, clear, and value search preserve physical slot positions while read/write
indices wrap around. Capacity stays fixed and full writes never overwrite data.

Every structure has animated actions with shared playback controls.
**Clear** is available for every structure. Array clear selects a new empty
fixed array; linked list clear releases nodes from the head; binary tree clear
uses postorder; and graph clear releases edges before vertices. Clear supports
empty inputs, stepping backward, and replay, and commits only on the final frame.
**Reset** restores the selected 10-element example.
When an action is selected, its overview in the upper-right of the canvas explains
time complexity, additional memory, and only the terms used by that action.

## Development

Use Node.js 22.12+ and npm.

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

`npm run build` runs the TypeScript checker before building.

## Checks

```sh
npm run typecheck
npm test
```

Tests cover linked list, array, and binary search tree edge cases, insertion sequences,
final pointer connections, strict tree ordering and duplicate rejection, fixed-array allocation,
preserved originals, prefix/suffix copies, structure previews, FIFO ordering,
reciprocal prev/next pointers, deque end operations, circular-buffer wraparound
and full/empty boundaries,
and playback cancellation, stepping, speed, and replay. They run with Node.js's built-in test runner and experimental
TypeScript stripping; the experimental warning on Node.js 22 is expected.

See [AGENTS.md](AGENTS.md) for project structure and development conventions,
and [visualization flow](docs/rules/visualization-flow.md) for the action contract.

Algorithm references: [MIT search-tree rotations and Red-Black trees](https://ocw.mit.edu/courses/6-046j-introduction-to-algorithms-sma-5503-fall-2005/resources/lecture-10-red-black-trees-rotations-insertions-deletions/),
[University of Alberta B-Tree deletion](https://webdocs.cs.ualberta.ca/~holte/T26/del-b-tree.html),
and [University of Utah B+ Tree split, redistribution, and merge exercises](https://users.cs.utah.edu/~lifeifei/cs6530/lab2.html).
