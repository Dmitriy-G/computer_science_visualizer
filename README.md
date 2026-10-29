# Data Structures Visualizer

A TypeScript and React app powered by Vite, built with class components and
object-oriented data structure and animation classes.

## Explore

Open the menu in the top left and choose **Data structures common operations**.
Choose **Linear** for Array and Linked list, **Trees** for Binary tree, or
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

Choose **Binary tree → Insert a value** to insert into a binary search tree.
Compare from the root, follow left for smaller values or right for larger or
equal values, find an empty child pointer, and create and connect a new leaf.
Duplicates remain separate nodes. The tree does not rebalance itself. Insertion
takes O(h) time, where h is the tree height, and O(1) additional algorithm memory.
The new node remains pending until the final step; rewind and replay preserve
the original tree. Subsequent insertions use the completed result.

Linked list, array, and binary tree insertion have animated actions. Graph has a
preview. **Reset** restores the selected 10-element example.
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
final pointer connections, tree ordering and duplicate placement, fixed-array allocation,
preserved originals, prefix/suffix copies, structure previews,
and playback cancellation, stepping, speed, and replay. They run with Node.js's built-in test runner and experimental
TypeScript stripping; the experimental warning on Node.js 22 is expected.

See [AGENTS.md](AGENTS.md) for project structure and development conventions,
and [visualization flow](docs/rules/visualization-flow.md) for the action contract.
