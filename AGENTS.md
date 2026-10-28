# Project guidance

## Purpose and stack

Build an interactive data structures visualizer with TypeScript and React, using Vite.
The app uses TypeScript and React class components. Linked list and array middle
insertion are animated actions; binary tree and graph previews are also available.
Use npm for dependency management.

## Required project rules

Read and follow these documents before implementing or changing application code:

- [Tech stack](docs/rules/tech-stack.md)
- [Component structure](docs/rules/component-structure.md)
- [Code style](docs/rules/code-style.md)
- [Visualization flow and action animations](docs/rules/visualization-flow.md)

These documents are part of this project's agent instructions.

## Commands

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
- `src/components/DataStructures/<StructureName>/`: each structure's model,
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
- Follow the existing `DataStructures/LinkedList/` organization for new structures:
  keep structure-specific entities beside their actions and reserve shared
  infrastructure for code used across structures. Match path casing exactly.
- Follow the existing two-space indentation, single quotes, and no-semicolon style.
- Keep state immutable and use stable keys for rendered nodes.
- Keep data structure operations separate from rendering and animation timing.
- The Array feature models fully occupied fixed-size arrays. Insertion creates
  a separate array of exactly the original length plus one and preserves the
  original. Do not add spare capacity, in-place growth, or capacity doubling.
- Prefer deterministic operation steps so future visualizations can support stepping,
  pausing, and resetting. Clean up timers, subscriptions, and animations in class
  lifecycle methods, including under StrictMode.
- Use semantic HTML, labeled controls, visible keyboard focus, and text alongside
  color to communicate state. Respect reduced-motion preferences when adding animation.
- Keep layouts usable on narrow screens.
- Add dependencies only when they provide a clear benefit for the requested feature.

## Verification

Run `npm run build` after code or configuration changes when dependencies are installed.
Run `npm test` for data structure and animation changes.
For UI changes, check the affected behavior in a browser when available.
When implementing data structure operations, verify normal cases, empty structures,
duplicates where relevant, and invalid input; add focused automated tests as needed.
Report checks that could not run and the reason. Keep this file aligned with actual
scripts and architecture as the project evolves.
