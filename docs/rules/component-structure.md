# Component structure

All React components belong under `src/components/`.

## Data structures and actions

Use `src/components/datastructures/` for data structure components. Give each
data structure its own PascalCase folder, such as `LinkedList` or `ArrayList`.

Inside each data structure folder, create a PascalCase folder for each action,
such as `AddInTheMiddle` or `SearchByElementValue`. Every action folder must contain
a `.tsx` React component and a separate `.css` file with its styles. Name both
files after the action and import the stylesheet from the component.

```text
src/components/
  datastructures/
    LinkedList/
      AddInTheMiddle/
        AddInTheMiddle.tsx
        AddInTheMiddle.css
    ArrayList/
      AddInTheMiddle/
        AddInTheMiddle.tsx
        AddInTheMiddle.css
      SearchByElementValue/
        SearchByElementValue.tsx
        SearchByElementValue.css
  renderer/
    Renderer.tsx
    Renderer.css
  MainMenu/
    MainMenu.tsx
    MainMenu.css
```

## Renderer

Place the shared `Renderer` component in `src/components/renderer/`. Keep the
folder name lowercase as shown. It displays data structures and animates their
dynamic changes. Reuse it across data structure actions instead of creating a
separate rendering system for every action.

Keep data structure operations separate from rendering and animation timing.

## Main menu

Place the `MainMenu` component in `src/components/MainMenu/`. It lets the user
choose the data structure and action to visualize.

Create these components and folders as their features are implemented. The tree
defines the required organization; it does not mean those features already exist.
