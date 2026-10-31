# Component structure

All React components belong under `src/components/`.

## Data structures and actions

Use `src/components/DataStructures/` for data structure components and related
entities. Paths in these rules are relative to the project root. Give each
data structure its own PascalCase folder, such as `LinkedList` or `Array`.

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
Tree action components use key terminology: `SearchByKey`, `DeleteByKey`, and
the B+ Tree's `RangeFromKey`. Match their class, folder, `.tsx`, and `.css` names.

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
    Array/
      FixedArray.ts
      ArrayLayout.ts
      AddInTheMiddle/
        AddInTheMiddle.tsx
        AddInTheMiddle.css
      SearchByElementValue/
        SearchByElementValue.tsx
        SearchByElementValue.css
  Renderer/
    Renderer.tsx
    Renderer.css
  MainMenu/
    MainMenu.tsx
    MainMenu.css
```

## Renderer

Place the shared `Renderer` component in `src/components/Renderer/`. Match the
folder's PascalCase spelling exactly. It displays data structures and animates their
dynamic changes. Reuse it across data structure actions instead of creating a
separate rendering system for every action.

Keep data structure operations separate from rendering and animation timing.
Keep the algorithm overview dialog in `src/components/AlgorithmInfo/`, outside
the renderer. The app supplies its action information and open/close state.

## Shared action playback

Use `src/components/ActionPlayback/` for the shared playback component and its
styles. Each action's component supplies its own class-based definition with phase
labels, explanations, and a factory method that creates its animation plan.
Keep structure-specific algorithms and model types in their action folders;
reuse the common animation session and progress display. Accept an optional
operation value, an optional upper range bound, and completion callback so actions can collect input separately
and unlock further operations after the result is committed. Otherwise use each
action's default value. Keep normal playback speed and do not render a bottom panel.
The app header provides the `playback-toolbar` host. `ActionPlayback` renders
its step description and noninteractive progress bar there through a React portal, keeping them
connected to the same controller without adding a bottom-panel wrapper.
Actions start automatically and run to completion. The header's full structure
Reset is the only playback control; do not add pause, play, or seeking controls.
The renderer provides the `renderer-code` host above the diagram in its center
column. `ActionPlayback` renders the current step's pseudocode there through a
second portal, using the same playback index as the scene and timeline.

## Shared visualization infrastructure

Keep contracts and infrastructure used across structures in `src/visualization/`,
such as `Scene.ts`, `AnimationController.ts`, and `StructureCatalog.ts`.
Structure-specific layouts belong in their structure's folder under
`src/components/DataStructures/`, alongside the model.

## Main menu

Place the `MainMenu` component in `src/components/MainMenu/`. It lets the user
choose the data structure. Keep its canvas action card in
`src/components/MainMenu/ActionMenu/`, with a `.tsx` class component and a separate
`.css` file. The app supplies this card to the shared renderer as a child so
action selection remains separate from drawing the scene.
Each action row has a separate info button on its right. It opens that action's
overview dialog without selecting or restarting the action.
The card's top-left back button reopens the current structure group's list,
preserving the selected structure and playback session.
The card's top-right corner has a larger info button for general structure
information. Keep that separate dialog in `src/components/StructureInfo/`;
it shows a one- or two-sentence introduction and a two-column table of four or
five use cases, pairing each area of use with a short explanation of its purpose.
Below the table, list five or six named real technologies with documentation
links, identifying implementation variants where relevant.
Shared value/index dialogs belong in `src/components/ActionInput/`, with their
request configuration and validation in `src/visualization/ActionInputRequest.ts`.
Reuse them for Array, Linked list, Stack, Queue, Deque, Doubly linked list,
Circular buffer, and all five tree types. They are separate from the info dialogs
and start an action only when the user confirms valid input. Keep structure-specific operations in
their existing models and action folders.
The B+ Tree range action uses two numeric fields in this shared dialog and passes
both inclusive bounds through the action definition and playback to its model.

Create these components and folders as their features are implemented. The tree
defines the required organization; it does not mean those features already exist.
