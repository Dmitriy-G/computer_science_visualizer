# Visualization flow and action animations

## Main flow

1. Start with an empty renderer and a clickable menu icon in the top left.
2. Open the menu to see the available data structures.
3. Selecting a structure loads an example containing 10 elements in the shared
   renderer. Lists, trees, graphs, and other structures can use different layouts.
4. After selection, show an action menu for that structure.
5. Selecting an implemented action starts its detailed animation. Honor
   reduced-motion preferences by waiting for the user to press Play instead.

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

The current implementation covers this action. Search and other insertion actions
can be added through their own action folders and sequence classes.
