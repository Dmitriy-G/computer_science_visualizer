# Code style

Use an object-oriented style based on TypeScript classes throughout application code.

- Implement React components as classes extending `React.Component` or
  `React.PureComponent`, with explicitly typed props and state.
- Do not use function components or React hooks.
- Model data structures, their operations, and animation controllers with classes.
  Keep behavior in methods and encapsulate internal state with appropriate access
  modifiers.
- Use class methods for event handlers and React lifecycle methods for setup and
  cleanup of timers, subscriptions, and animations.
- Use object-oriented methods and straightforward control flow instead of a
  functional programming style or chains of functional transformations.
- Use `setState` for React state changes. Treat React state as immutable and keep
  mutable data structure internals separate from React state snapshots.
- Use PascalCase for class and component names and camelCase for methods and fields.
- Follow two-space indentation, single quotes, ES module imports and exports,
  and the existing no-semicolon formatting style.

Use `.tsx` for React components, `.ts` for other application code, and colocated
`.css` files for component styles, following the
[component structure rules](component-structure.md).
