# Data Structures Visualizer

A TypeScript and React app powered by Vite, built with class components and
object-oriented data structure and animation classes.

## Explore

Open the menu in the top left and choose a data structure. Linked list, array,
binary tree, and graph previews each start with 10 elements.

Choose **Linked list → Insert in the middle** to watch traversal, node creation,
unlinking, opening space, insertion, and both new pointer connections. Playback
starts automatically unless reduced motion is enabled. Pause, step backward or
forward, scrub the timeline, replay, or adjust speed. Reset the animation to its
first step to change the inserted value. Completion commits the new node;
rewinding or replaying restores the original list before applying the action again.

Only linked list middle insertion currently has an animated action. The other
structures have previews. **Reset** restores the selected 10-element example.
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

Tests cover linked list edge cases, the insertion sequence, final pointer
connections, structure previews, and playback cancellation, stepping, speed,
and replay. They run with Node.js's built-in test runner and experimental
TypeScript stripping; the experimental warning on Node.js 22 is expected.

See [AGENTS.md](AGENTS.md) for project structure and development conventions,
and [visualization flow](docs/rules/visualization-flow.md) for the action contract.
