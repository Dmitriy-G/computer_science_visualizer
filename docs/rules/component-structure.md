# Component structure

All React components belong under `src/components/`.

## Data structures and actions

Use `src/components/DataStructures/` for data structure components and related
entities. Paths in these rules are relative to the project root. Give each
data structure its own PascalCase folder, such as `LinkedList` or `ArrayList`.

Keep all entities specific to one structure together in that structure's folder:
its model class, layout class, supporting types, and action folders. Follow the
existing `LinkedList/` organization: `LinkedList.ts` and `LinkedListLayout.ts`
sit beside `AddInTheMiddle/`. Do not split structure-specific entities into
top-level model or visualization folders.

Inside each data structure folder, create a PascalCase folder for each action,
such as `AddInTheMiddle` or `SearchByElementValue`. Every action folder must contain
a `.tsx` React component and a separate `.css` file with its styles. Name both
files after the action and import the stylesheet from the component.
Keep action-specific sequence classes, such as `InsertionAnimation.ts`, in the
same action folder. Import the structure's model and layout from the parent
folder, using relative imports and matching the exact directory casing.

```text
src/components/
  DataStructures/
    LinkedList/
      LinkedList.ts
      LinkedListLayout.ts
      AddInTheMiddle/
        AddInTheMiddle.tsx
        AddInTheMiddle.css
        InsertionAnimation.ts
    ArrayList/
      ArrayList.ts
      ArrayListLayout.ts
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

Place the shared `Renderer` component in `../../src/components/Renderer/`. Keep the
folder name lowercase as shown. It displays data structures and animates their
dynamic changes. Reuse it across data structure actions instead of creating a
separate rendering system for every action.

Keep data structure operations separate from rendering and animation timing.

## Shared visualization infrastructure

Keep contracts and infrastructure used across structures in `src/visualization/`,
such as `Scene.ts`, `AnimationController.ts`, and `StructureCatalog.ts`.
Structure-specific layouts belong in their structure's folder under
`src/components/DataStructures/`, alongside the model.

## Main menu

Place the `MainMenu` component in `src/components/MainMenu/`. It lets the user
choose the data structure and action to visualize.

Create these components and folders as their features are implemented. The tree
defines the required organization; it does not mean those features already exist.
