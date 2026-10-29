# Visualization flow and action animations

## Main flow

1. Start with an empty renderer and a clickable menu icon in the top left.
2. Open the menu to see the available data structures.
3. Selecting a structure loads an example containing 10 elements in the shared
   renderer. Lists, trees, graphs, and other structures can use different layouts.
4. After selection, show an action menu for that structure.
5. Selecting an implemented action starts its detailed animation. Honor
   reduced-motion preferences by waiting for the user to press Play instead.

Keep the detailed animation controls collapsed initially behind an **Animation
controls** disclosure button. Clicking it opens the controls and explanation;
the close (X) button hides them again. Toggling this panel must preserve the
current animation, playback state, and entered value.

When an action is selected, show its algorithm information in the upper-right
of the canvas, independently of the collapsed controls. Include time complexity,
additional memory complexity, with labeled best, average, and worst cases for
both costs, and definitions of only the terms and letters used
by that action. Each action owns its summary, complexity explanations, and glossary
in its sequence class; the shared renderer only displays the supplied information.
Do not add generic definitions or unused variables to every action. For example,
linked list insertion explains `n`, `O(n)`, and `O(1)` without introducing `k`.
Fixed-array insertion uses only `n` and `O(n)` because both copying and additional
storage are linear.
Values such as the original input size must describe the current run, including
after completion and replay. Clear the card on structure
selection or reset. On smaller screens, let the card wrap above the diagram so
it does not overlap nodes or controls.

Keep structure selection and action selection distinct. Only offer working actions;
identify structures with previews but no animated actions clearly.

## Action responsibilities

Each action describes its own ordered animation sequence. Define the sequence in
a TypeScript class next to its `.tsx` component and `.css` file in the action folder.
Each step includes a phase, title, explanation, relevant pseudocode, duration, and
scene snapshot. Keep scene snapshots independent so stepping backward and replaying
are deterministic.

The shared Renderer draws the supplied nodes, edges, and highlights and animates
their transitions. It must not decide the algorithm or hard-code action phases.
Playback timing belongs to a separate controller class. Cancel scheduled playback
when the action unmounts or the selected structure changes, and pause when opening
the menu. Support pause/resume, previous/next step, replay, timeline seeking, and speed.

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
   labeled row, below the original array of `n` slots.
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
only `n` and `O(n)` in this action's glossary. Label copied values **COPIED**,
and explicitly label the original and new rows; do not label copies **SHIFTED**.

Both insertion actions reuse the shared class-based playback controls. Plans keep
the original model unchanged so replay, stepping backward, and reset are safe.
Search and other actions can be added through their own action folders and plans.

## BinaryTree / Insert

Use an unbalanced binary search tree. Its default example has 10 nodes and
satisfies the search ordering. Smaller values go left; larger or equal values
go right. Duplicates are separate nodes with stable IDs. Do not perform rotations.

1. **Start:** highlight the root, or identify an empty root pointer.
2. **Compare:** show the comparison at each visited node, then follow the chosen
   child in a separate frame. Mark the visited path and current node with text.
3. **Locate:** identify the empty child position (or empty root).
4. **Create:** show the new leaf with empty child pointers, labeled as pending.
5. **Connect:** draw the parent-to-leaf pointer, or set the root pointer.
6. **Finish:** commit the result and update the element count.

Keep the original model unchanged, committing only on the final step. Rewinding
restores the original; replay never adds duplicates beyond the requested node.
Use the shared playback controls and renderer. Layout uses scene dimensions
to accommodate additional levels and horizontal scrolling on narrow screens.
The action's information explains O(h) time and O(1) extra memory for iterative
insertion. Show best-case O(1), average-case O(log n) assuming distinct keys
inserted in random order, and worst-case O(n) time. Additional memory is O(1)
in all cases. Define n, h, O(h), O(log n), O(n), and O(1), and keep n tied to the
original input size for the current run. Animation snapshots are visualization overhead,
excluded from the algorithm memory cost.
