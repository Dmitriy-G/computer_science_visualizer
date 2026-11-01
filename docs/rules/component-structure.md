# Component structure

All React components belong under `src/components/`.
`App` is the root of Computer Science Visualizer. `DataStructures` names the
current subject area; keep this folder and its structure-specific module names
so future computer science subjects can be added alongside it.

## Data structures and actions

Use `src/components/DataStructures/` for data structure components and related
entities. Paths in these rules are relative to the project root. Group structures
under `Linear`, `Trees`, `Graphs`, or `HashBased`, with a PascalCase folder for
each structure, such as `Linear/LinkedList` or `Linear/Array`.

Keep all entities specific to one structure together in that structure's folder:
its model class, layout class, supporting types, and action folders. Follow the
existing `LinkedList/` organization: `LinkedList.ts` and `LinkedListLayout.ts`
sit beside `AddInTheMiddle/`. Do not split structure-specific entities into
top-level model or visualization folders.

Inside each data structure folder, create a PascalCase folder for each action,
such as `AddInTheMiddle` or `SearchByValue`. Every action folder must contain
a `.tsx` React component and a separate `.css` file with its styles. Name both
files after the action and import the stylesheet from the component.
Keep action-specific sequence classes, such as `InsertionAnimation.ts`, in the
same action folder. Import the structure's model and layout from the parent
folder, using relative imports and matching the exact directory casing.
Tree action components use key terminology: `SearchByKey`, `DeleteByKey`, and
the B+ Tree's `RangeFromKey`. Match their class, folder, `.tsx`, and `.css` names.
Trie uses word terminology (`SearchByWord`, `DeleteByWord`, and `StartsWith`),
and R-Tree deletes spatial records with `DeleteById`. Segment and Fenwick actions
use `Update` / `Add`, `PrefixSum`, and `RangeSum` as appropriate.
AST keeps its grammar parser beside its model and uses `Build`, `Preorder`,
`Inorder`, `Postorder`, `Evaluate`, and `Clear` action folders. Reuse its parser
for expression validation in the shared input dialog.

```text
src/components/
  DataStructures/
    Linear/
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
        SearchByValue/
          SearchByValue.tsx
          SearchByValue.css
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

Scenes can supply an optional `hint` with a title, description, and optional code.
The renderer displays it in a small block below the node-state legend and above
the action pseudocode, outside the SVG. Omit the block entirely when no hint is
supplied. Keep structure-specific hint content in its layout, not in the renderer.

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
Use two consistent card styles for menu buttons. Category, group, and structure
cards have one leading icon, a heading, and up to two description lines; omit
trailing arrow icons. Action cards have a heading and up to two description lines,
with no icon inside the card. Keep their info controls separate and vertically
centered beside them. Both styles use the shared --menu-card-height token (112px),
matching text sizes and spacing. Allow headings up to two lines for long names;
keep full text in the DOM and provide title text for clipped content. Preserve
keyboard focus visibility and the independently scrolling action list.
The card's top-left back button reopens the current structure group's list,
preserving the selected structure and playback session.
The card's top-right corner has a larger info button for general structure
information. Keep that separate dialog in `src/components/StructureInfo/`;
it shows a one- or two-sentence introduction and a two-column table of four or
five use cases, pairing each area of use with a short explanation of its purpose.
Below the table, list only verified uses in real systems, language runtimes,
standard libraries, or established application libraries. Each entry needs a
primary documentation or source link and a short explanation of what the
technology uses the structure for. Identify implementation variants explicitly.
There is no minimum example count. Exclude competitive-programming collections,
educational algorithm catalogs, and standalone projects without evidence of real
application use. If no use can be verified, leave the list empty and state that
limitation without claiming the structure is never used anywhere.
Shared value/index dialogs belong in `src/components/ActionInput/`, with their
request configuration and validation in `src/visualization/ActionInputRequest.ts`.
Reuse them for Array, Linked list, Stack, Queue, Deque, Doubly linked list,
Circular buffer, all tree types, Hash Map, Hash Set, and Bloom Filter.
The additional Trie, Heap, Segment Tree, Fenwick Tree, R-Tree, LSM Tree, and AST
use structured fields in the same dialog. Keep field validation in
`src/visualization/StructuredTreeInput.ts`, with its request attached to
`ActionInputRequest`. Word, expression, and rectangle input must not be coerced through the
legacy single-number callback. Reuse the shared playback session through
`StructuredTreeAction`; keep each action's component, CSS, sequence, and
complexity information in its own action folder.
Hash Map insertion collects
separate whole-number key and value fields; the second value is not a range bound.
These dialogs are separate from the info dialogs and start an action only when
the user confirms valid input. Keep structure-specific operations in
their existing models and action folders.
The B+ Tree range action uses two numeric fields in this shared dialog and passes
both inclusive bounds through the action definition and playback to its model.

Create these components and folders as their features are implemented. The tree
defines the required organization; it does not mean those features already exist.

## Hash-based structures

Keep Hash Map, Hash Set, and Bloom Filter under
`src/components/DataStructures/HashBased/`, each with its model, layout, and action
folders. Hash Set composes the chained Hash Map storage. Reuse shared hashing,
bucket layout, and trace playback from `src/visualization/` where they serve more
than one structure. Each action has its own sequence, class component, and CSS file.

## Graphs

Keep the original undirected Graph under Graphs/SimpleGraph and add DirectedGraph,
WeightedGraph, DAG, and Multigraph beside it. GraphModel, GraphSceneLayout, and
GraphAnimation are shared across these variants. Each allowed action has its own
component, CSS, animation class, and complexity description. Reuse
StructuredGraphAction for playback and GraphActionInput for structured dialogs;
shared field contracts live in StructuredActionInput. Expose variant-specific real
technology examples with primary links and explain differences from this model.

Algorithm menu groups stay in MainMenu/MenuNavigation alongside root-category
navigation. Reuse MainMenu to list graphs under Algorithms > Graphs Traversal;
list Array under Sorting with Bubble Sort, SelectionSort, InsertionSort,
BinaryInsertionSort, MergeSort, QuickSort, HeapSort, ShellSort, CountingSort,
RadixSort, BucketSort, TimSort, IntroSort, DualPivotQuickSort, and BlockMergeSort.
Each action owns its component,
CSS, and sequence folder under Linear/Array. Keep the model entry points in FixedArray,
with shared array-specific algorithms, trace, layout, and snapshot helpers beside it.
HybridArraySort implements TimSort, IntroSort, and Dual-Pivot QuickSort on the
existing allocation. BlockMergeArraySort implements buffered block-wise multiway
merging with stable ties and O(n) working storage.
ActionMenu receives an explicit
ActionScope, and App preserves the selected scope independently of menu browsing.
Algorithm structure buttons show at most two example names in one truncated line;
keep the complete list in the independently scrolling action panel.
Do not duplicate graph models or sequence classes to expose traversal examples
in the Algorithms branch.
