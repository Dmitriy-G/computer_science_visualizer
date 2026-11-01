# Computer Science Visualizer project guidance

## Purpose and stack

Build Computer Science Visualizer, an interactive app for computer science
concepts with TypeScript and React, using Vite. Its current feature area is data structures.
The app uses TypeScript and React class components. Linked list, array, binary
search tree, graph, and stack operations have animated actions. The menu groups
structures under Linear, Trees, Graphs, and Hash-based within Data Structures
Overview. Data Structures Algorithms contains Sorting (Array with twenty-nine sorting algorithms)
and Graphs Traversal; graph algorithm examples live in the latter.
Use npm for dependency management.

## Required project rules

Read and follow these documents before implementing or changing application code:

- [Tech stack](docs/rules/tech-stack.md)
- [Component structure](docs/rules/component-structure.md)
- [Code style](docs/rules/code-style.md)
- [Visualization flow and action animations](docs/rules/visualization-flow.md)

These documents are part of this project's agent instructions.

## Agent restrictions

- Never run npm commands, including installs, development servers, builds,
  type checks, and tests. The user runs them manually.
- Never open or use a browser to check the application. The user performs all
  browser verification manually.
- Do not bypass these restrictions by invoking equivalent commands through
  other package managers, direct executables, scripts, or browser automation.

## Commands (for the user to run manually)

- `npm install`: install dependencies and generate or update `package-lock.json`.
- `npm run dev`: start the Vite development server.
- `npm run build`: check TypeScript and create the production build in `dist/`.
- `npm run preview`: serve the production build locally after building.
- `npm run typecheck`: check application TypeScript without emitting files.
- `npm test`: run data structure, animation sequence, and playback controller tests.

Tests use Node.js's built-in test runner and experimental TypeScript stripping
(Node.js 22.12+). There is currently no lint configuration.
Commit `package-lock.json` when generated; do not commit `node_modules/` or `dist/`.

## Structure

- `index.html`: document and React mount point.
- `src/main.tsx`: React entry point with StrictMode and global styles.
- `src/components/App/App.tsx`: root application class component.
- `src/components/MainMenu/`: structure and action selection.
- `src/components/Renderer/`: shared scene renderer.
- `src/components/ActionPlayback/`: shared playback controls and animation session.
- `src/components/DataStructures/<Group>/<StructureName>/`: each structure's model,
  layout, supporting types, and action folders, kept together.
- `src/visualization/`: shared scene contracts, structure catalog, and animation
  playback classes used across structures.
- `src/style.css`: global styles and initial app layout.
- `tests/`: model, animation sequence, and playback tests.
- `public/`: assets served without bundling.
- `vite.config.js`: Vite configuration with the React plugin.

Follow the
[component structure rules](docs/rules/component-structure.md) for new components.
Create directories when needed, rather than adding empty scaffolding.

## Implementation conventions

- Use TypeScript classes and React class components as described in the
  [code style rules](docs/rules/code-style.md).
- Use `.tsx` for React components, `.ts` for other application code, and PascalCase
  for class and component names.
- Follow the existing `DataStructures/Linear/LinkedList/` organization for new structures:
  keep structure-specific entities beside their actions and reserve shared
  infrastructure for code used across structures. Match path casing exactly.
- Follow the existing two-space indentation, single quotes, and no-semicolon style.
- Keep state immutable and use stable keys for rendered nodes.
- Keep data structure operations separate from rendering and animation timing.
- The Array feature models fully occupied fixed-size arrays. Insertion creates
  a separate array of exactly the original length plus one and preserves the
  original. Do not add spare capacity, in-place growth, or capacity doubling.
- Stack uses linked nodes, a top pointer, and a cached count. Push and pop affect
  only the top. Clear releases nodes one at a time; value search preserves order.
- Prefer deterministic operation steps so future visualizations can support stepping,
  pausing, and resetting. Clean up timers, subscriptions, and animations in class
  lifecycle methods, including under StrictMode.
- Use semantic HTML, labeled controls, visible keyboard focus, and text alongside
  color to communicate state. Respect reduced-motion preferences when adding animation.
- Keep layouts usable on narrow screens.
- Add dependencies only when they provide a clear benefit for the requested feature.
