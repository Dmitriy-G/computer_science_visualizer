# Computer Science Visualizer project guidance

## Purpose and stack

Read the [project overview](docs/project-overview.md) for the app's purpose,
stack, and current feature organization. It is part of these project instructions.

## Required project rules

Read and follow these documents before implementing or changing application code:

- [Tech stack](docs/rules/tech-stack.md)
- [Component structure](docs/rules/component-structure.md)
- [Code style](docs/rules/code-style.md)
- [Visualization flow and action animations](docs/rules/visualization-flow.md)

These documents are part of this project's agent instructions.

## Agent restrictions

- Do not modify `README.md` unless the user directly requests changes to that
  file. Do not initiate README updates or ask for permission to make them.
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
- `src/components/FundamentalDataStructures/<Group>/<StructureName>/`: fundamental
  models, layouts, supporting types, and ordinary-operation action folders.
- `src/components/AdvancedDataStructures/<Group>/<StructureName>/`: advanced
  models, layouts, supporting types, and ordinary-operation action folders.
- `src/components/StructureFeatures/`: shared class-based action dispatchers that
  connect multiple categories and subjects to App.
- `src/components/DataStructuresAlgorithms/Sorting/Array/`: sorting actions and
  array-specific algorithm helpers, traces, and layouts.
- `src/components/DataStructuresAlgorithms/GraphsTraversal/<Graph>/`: graph
  algorithm action folders, reusing the canonical Fundamental or Advanced graph models.
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
- Follow the main-category/subcategory/structure/action hierarchy. Use
  `FundamentalDataStructures/Linear/LinkedList/` for ordinary list operations,
  `FundamentalDataStructures/QueuePriority/Queue/` for queues,
  `AdvancedDataStructures/StorageIndexes/SSTable/` for advanced indexes, and
  `DataStructuresAlgorithms/Sorting/Array/` for sorting actions. Algorithms import
  canonical models from their Fundamental or Advanced location. Put helpers used
  across subjects in `src/visualization/` and cross-subject React dispatchers in
  `src/components/StructureFeatures/`. Match path casing exactly.
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
